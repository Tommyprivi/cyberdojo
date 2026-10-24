"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { authErrorMessage } from "@/components/auth/auth-card";
import { authClient } from "@/lib/auth-client";
import { backupCodesFile, classifyCode, formatManualKey, isValidTotpCode, normalizeTotpCode, secretFromOtpauthUri } from "@/lib/two-factor";
import { QrCode } from "./qr-code";

type View =
  | { name: "idle" }
  | { name: "enable-password" }
  | { name: "scan"; uri: string; codes: string[] }
  | { name: "codes"; codes: string[]; reason: "enabled" | "regenerated" }
  | { name: "regenerate" }
  | { name: "disable" };

/**
 * Sezione «Sicurezza» del profilo: verifica in due passaggi con app di autenticazione.
 * `hasPassword` è falso per chi è entrato solo con Google o con il link: per loro l'attivazione
 * richiede prima di impostare una password (vedi docs/2fa.md).
 */
export function SecuritySettings({ enabled, hasPassword, email }: { enabled: boolean; hasPassword: boolean; email: string }) {
  const router = useRouter();
  const [view, setView] = useState<View>({ name: "idle" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const go = (v: View) => {
    setError(null);
    setNotice(null);
    setView(v);
  };

  // ---- Attivazione, passo 1: la password, poi il server crea chiave e codici di recupero ----
  const startEnable = async (password: string) => {
    setBusy(true);
    setError(null);
    const { data, error } = await authClient.twoFactor.enable({ password, method: "totp" });
    setBusy(false);
    if (error || data?.method !== "totp") return setError(authErrorMessage(error));
    setView({ name: "scan", uri: data.totpURI, codes: data.backupCodes });
  };

  // ---- Attivazione, passo 2: il primo codice conferma che l'app è configurata ----
  const confirmEnable = async (code: string, codes: string[]) => {
    setBusy(true);
    setError(null);
    const { error } = await authClient.twoFactor.verifyTotp({ code: normalizeTotpCode(code) });
    setBusy(false);
    if (error) return setError(authErrorMessage(error));
    setView({ name: "codes", codes, reason: "enabled" });
    router.refresh();
  };

  const regenerate = async (password: string) => {
    setBusy(true);
    setError(null);
    const { data, error } = await authClient.twoFactor.generateBackupCodes({ password });
    setBusy(false);
    if (error || !data?.backupCodes) return setError(authErrorMessage(error));
    setView({ name: "codes", codes: data.backupCodes, reason: "regenerated" });
  };

  const disable = async (password: string, code: string) => {
    setBusy(true);
    setError(null);
    // Il server controlla sia la password sia il codice (vedi src/lib/auth.ts).
    const { error } = await authClient.twoFactor.disable({ password, code } as { password: string });
    setBusy(false);
    if (error) return setError(authErrorMessage(error));
    setView({ name: "idle" });
    setNotice("Verifica in due passaggi disattivata. Ti abbiamo mandato un'email di conferma.");
    router.refresh();
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-start justify-between gap-3 rounded-md border border-border bg-background p-3">
        <div>
          <p className="font-semibold">Verifica in due passaggi</p>
          <p className="text-sm text-muted">
            Oltre alla password, per entrare serve un codice a 6 cifre che cambia ogni 30 secondi, generato da un&apos;app sul tuo telefono.
          </p>
        </div>
        <span
          className={`shrink-0 rounded-md px-2 py-1 font-mono text-xs font-bold ${enabled ? "bg-success text-success-fg" : "bg-surface-muted text-muted"}`}
        >
          {enabled ? "ATTIVA" : "SPENTA"}
        </span>
      </div>

      {notice && (
        <p role="status" className="rounded-md border border-border bg-surface-muted p-3 font-semibold">
          {notice}
        </p>
      )}

      {view.name === "idle" && (
        <>
          {!enabled && !hasPassword && (
            <div className="grid gap-2 rounded-md border border-border bg-surface-muted p-3 text-sm">
              <p className="font-semibold">Prima serve una password.</p>
              <p>
                Il tuo account entra solo con Google o con il link via email, e per questi metodi la verifica in due passaggi non esiste.
                Se vuoi attivarla, scegli una password: poi potrai entrare con email, password e codice.
              </p>
              <Link href="/password-dimenticata" className="font-semibold text-primary underline">
                Imposta una password
              </Link>
            </div>
          )}
          {!enabled && hasPassword && (
            <button type="button" className="btn btn-primary" onClick={() => go({ name: "enable-password" })}>
              Attiva la verifica in due passaggi
            </button>
          )}
          {enabled && (
            <div className="grid gap-2 sm:grid-cols-2">
              <button type="button" className="btn btn-ghost" onClick={() => go({ name: "regenerate" })}>
                Nuovi codici di recupero
              </button>
              <button type="button" className="btn btn-ghost text-accent" onClick={() => go({ name: "disable" })}>
                Disattiva
              </button>
            </div>
          )}
          <p className="text-sm text-muted">
            {enabled
              ? "Con la verifica attiva, il link via email e l'accesso con Google sono disattivati per questo account: si entra con email, password e codice. Se perdi il telefono, usa un codice di recupero."
              : "Vale per l'accesso con email e password. Una volta attiva, il link via email e Google vengono disattivati per il tuo account, perché altrimenti aggirerebbero il secondo codice."}
          </p>
        </>
      )}

      {view.name === "enable-password" && (
        <PasswordForm
          title="Conferma che sei tu"
          text="Scrivi la tua password per iniziare. Nei prossimi passi vedrai un codice QR da inquadrare con l'app."
          action="Continua"
          busy={busy}
          error={error}
          onSubmit={(p) => startEnable(p)}
          onCancel={() => go({ name: "idle" })}
        />
      )}

      {view.name === "scan" && (
        <ScanStep
          uri={view.uri}
          busy={busy}
          error={error}
          onConfirm={(code) => confirmEnable(code, view.codes)}
          onCancel={() => go({ name: "idle" })}
        />
      )}

      {view.name === "codes" && (
        <BackupCodes
          codes={view.codes}
          email={email}
          intro={
            view.reason === "enabled"
              ? "Fatto: la verifica in due passaggi è attiva. Salva ora i codici di recupero: li vedi solo adesso."
              : "Ecco i nuovi codici di recupero. Quelli vecchi non funzionano più. Li vedi solo adesso."
          }
          onDone={() => go({ name: "idle" })}
        />
      )}

      {view.name === "regenerate" && (
        <PasswordForm
          title="Nuovi codici di recupero"
          text="Scrivi la password. I codici attuali smetteranno di funzionare."
          action="Genera nuovi codici"
          busy={busy}
          error={error}
          onSubmit={(p) => regenerate(p)}
          onCancel={() => go({ name: "idle" })}
        />
      )}

      {view.name === "disable" && (
        <PasswordForm
          title="Disattiva la verifica in due passaggi"
          text="Servono la password e un codice: quello dell'app o uno di recupero. Il tuo account tornerà protetto solo dalla password."
          action="Disattiva"
          danger
          withCode
          busy={busy}
          error={error}
          onSubmit={(p, c) => disable(p, c ?? "")}
          onCancel={() => go({ name: "idle" })}
        />
      )}
    </div>
  );
}

function Box({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 rounded-md border border-border bg-background p-4">
      <p className="font-display text-lg font-semibold">{title}</p>
      {children}
    </div>
  );
}

function PasswordForm({
  title,
  text,
  action,
  busy,
  error,
  danger,
  withCode,
  onSubmit,
  onCancel,
}: {
  title: string;
  text: string;
  action: string;
  busy: boolean;
  error: string | null;
  danger?: boolean;
  withCode?: boolean;
  onSubmit: (password: string, code?: string) => void;
  onCancel: () => void;
}) {
  const id = useId();
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!password) return setLocalError("Scrivi la password.");
    if (withCode && classifyCode(code) === "invalid") return setLocalError("Scrivi il codice a 6 cifre dell'app o un codice di recupero (xxxxx-xxxxx).");
    setLocalError(null);
    onSubmit(password, withCode ? code.trim() : undefined);
  };
  const shown = localError ?? error;

  return (
    <form onSubmit={submit} noValidate>
      <Box title={title}>
        <p className="text-sm text-muted">{text}</p>
        <label className="grid gap-1.5" htmlFor={`${id}-pw`}>
          <span className="font-semibold">Password</span>
          <input id={`${id}-pw`} className="field" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
        </label>
        {withCode && (
          <label className="grid gap-1.5" htmlFor={`${id}-code`}>
            <span className="font-semibold">Codice dell&apos;app o di recupero</span>
            <input
              id={`${id}-code`}
              className="field font-mono"
              type="text"
              inputMode="text"
              autoComplete="one-time-code"
              autoCapitalize="none"
              spellCheck={false}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
            />
          </label>
        )}
        {shown && (
          <p role="alert" className="font-semibold text-accent">
            {shown}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={busy} className={`btn ${danger ? "btn-ghost text-accent" : "btn-primary"}`}>
            {busy ? "Attendi…" : action}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-ghost">
            Annulla
          </button>
        </div>
      </Box>
    </form>
  );
}

function ScanStep({
  uri,
  busy,
  error,
  onConfirm,
  onCancel,
}: {
  uri: string;
  busy: boolean;
  error: string | null;
  onConfirm: (code: string) => void;
  onCancel: () => void;
}) {
  const id = useId();
  const [code, setCode] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const secret = secretFromOtpauthUri(uri);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidTotpCode(code)) return setLocalError("Il codice ha 6 cifre.");
    setLocalError(null);
    onConfirm(code);
  };
  const shown = localError ?? error;

  return (
    <Box title="Collega l'app di autenticazione">
      <ol className="grid list-decimal gap-1 pl-5 text-sm">
        <li>Installa un&apos;app di autenticazione (Google Authenticator, Authy, Microsoft Authenticator…).</li>
        <li>Inquadra il codice QR, oppure scegli «inserisci una chiave» e scrivi quella qui sotto.</li>
        <li>Scrivi qui il codice a 6 cifre che l&apos;app ti mostra.</li>
      </ol>

      <div className="grid justify-items-center gap-3">
        <div className="size-56 max-w-full">
          <QrCode value={uri} label="Codice QR da inquadrare con l'app di autenticazione" />
        </div>
        {secret && (
          <div className="w-full text-center">
            <p className="text-sm text-muted">Non puoi inquadrare il QR? Chiave manuale:</p>
            <p className="select-all break-words font-mono text-lg font-bold tracking-wider" aria-label="Chiave manuale">
              {formatManualKey(secret)}
            </p>
            <p className="text-xs text-muted">Tienila riservata: chi la conosce può generare i tuoi codici.</p>
          </div>
        )}
      </div>

      <form onSubmit={submit} className="grid gap-3" noValidate>
        <label className="grid gap-1.5" htmlFor={`${id}-code`}>
          <span className="font-semibold">Codice a 6 cifre</span>
          <input
            id={`${id}-code`}
            className="field font-mono text-xl tracking-[0.3em]"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={7}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </label>
        {shown && (
          <p role="alert" className="font-semibold text-accent">
            {shown}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={busy} className="btn btn-primary">
            {busy ? "Controllo…" : "Conferma e attiva"}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-ghost">
            Annulla
          </button>
        </div>
      </form>
    </Box>
  );
}

function BackupCodes({ codes, email, intro, onDone }: { codes: string[]; email: string; intro: string; onDone: () => void }) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState<"ok" | "ko" | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(codes.join("\n"));
      setCopied("ok");
    } catch {
      setCopied("ko");
    }
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([backupCodesFile(codes, email)], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "cyberdojo-codici-di-recupero.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box title="Codici di recupero">
      <p role="status">{intro}</p>
      <ul className="grid grid-cols-2 gap-2 font-mono text-base font-bold" aria-label="I tuoi codici di recupero">
        {codes.map((c) => (
          <li key={c} className="select-all rounded-md border border-border bg-surface px-2 py-1.5 text-center">
            {c}
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted">
        Ogni codice vale una volta sola e sostituisce il codice dell&apos;app se perdi il telefono. Conservali lontano dal telefono (un foglio, un gestore di password).
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={copy} className="btn btn-ghost">
          Copia
        </button>
        <button type="button" onClick={download} className="btn btn-ghost">
          Scarica (.txt)
        </button>
      </div>
      {copied && (
        <p role="status" className="text-sm font-semibold">
          {copied === "ok" ? "Copiati." : "Non riesco a copiare: seleziona i codici a mano o scaricali."}
        </p>
      )}
      <label className="flex items-start gap-3">
        <input type="checkbox" className="mt-1 size-5 accent-[var(--primary)]" checked={saved} onChange={(e) => setSaved(e.target.checked)} />
        <span className="font-semibold">Ho salvato i codici in un posto sicuro</span>
      </label>
      <button type="button" disabled={!saved} onClick={onDone} className="btn btn-primary">
        Fatto
      </button>
    </Box>
  );
}
