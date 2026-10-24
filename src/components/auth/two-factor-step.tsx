"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { isValidBackupCode, isValidTotpCode, normalizeBackupCode, normalizeTotpCode } from "@/lib/two-factor";
import { authErrorMessage } from "./auth-card";

const RESTART_CODES = new Set(["TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE", "INVALID_TWO_FACTOR_COOKIE"]);

/**
 * Secondo passo dell'accesso: codice a 6 cifre dell'app oppure un codice di recupero.
 * Se la finestra di 10 minuti è scaduta o i tentativi sono finiti, si torna al primo passo.
 */
export function TwoFactorStep({ next, onRestart }: { next: string; onRestart: (message: string) => void }) {
  const router = useRouter();
  const [mode, setMode] = useState<"totp" | "backup">("totp");
  const [code, setCode] = useState("");
  const [trust, setTrust] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const switchMode = (m: "totp" | "backup") => {
    setMode(m);
    setCode("");
    setError(null);
    requestAnimationFrame(() => input.current?.focus());
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = mode === "totp" ? isValidTotpCode(code) : isValidBackupCode(code);
    if (!valid) {
      setError(mode === "totp" ? "Il codice ha 6 cifre." : "Il codice di recupero ha la forma xxxxx-xxxxx.");
      input.current?.focus();
      return;
    }
    setBusy(true);
    setError(null);
    const { error } =
      mode === "totp"
        ? await authClient.twoFactor.verifyTotp({ code: normalizeTotpCode(code), trustDevice: trust })
        : await authClient.twoFactor.verifyBackupCode({ code: normalizeBackupCode(code), trustDevice: trust });
    if (error) {
      setBusy(false);
      if (error.code && RESTART_CODES.has(error.code)) return onRestart(authErrorMessage(error));
      setError(authErrorMessage(error));
      setCode("");
      input.current?.focus();
      return;
    }
    router.push(next);
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="grid gap-4" noValidate>
      <div className="grid gap-1.5">
        <h2 className="font-display text-2xl font-semibold">Verifica in due passaggi</h2>
        <p className="text-muted">
          {mode === "totp"
            ? "Apri l'app di autenticazione sul telefono e scrivi il codice a 6 cifre di CyberDojo."
            : "Scrivi uno dei codici di recupero che hai salvato. Ognuno vale una sola volta."}
        </p>
      </div>

      <label className="grid gap-1.5">
        <span className="font-semibold">{mode === "totp" ? "Codice a 6 cifre" : "Codice di recupero"}</span>
        <input
          ref={input}
          className="field font-mono text-xl tracking-[0.3em]"
          type="text"
          inputMode={mode === "totp" ? "numeric" : "text"}
          autoComplete="one-time-code"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          autoFocus
          maxLength={mode === "totp" ? 7 : 12}
          placeholder={mode === "totp" ? "000000" : "xxxxx-xxxxx"}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          aria-describedby={error ? "tf-error" : undefined}
          aria-invalid={error ? true : undefined}
        />
      </label>

      <label className="flex items-start gap-3">
        <input type="checkbox" className="mt-1 size-5 accent-[var(--primary)]" checked={trust} onChange={(e) => setTrust(e.target.checked)} />
        <span>
          <span className="font-semibold">Ricorda questo dispositivo per 30 giorni</span>
          <span className="block text-sm text-muted">Usalo solo su un dispositivo tuo. Su questo non ti chiederemo il codice per un mese.</span>
        </span>
      </label>

      {error && (
        <p id="tf-error" role="alert" className="font-semibold text-accent">
          {error}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn btn-primary">
        {busy ? "Controllo…" : "Verifica e accedi"}
      </button>

      <div className="grid gap-2 text-center text-sm">
        {mode === "totp" ? (
          <button type="button" onClick={() => switchMode("backup")} className="font-semibold text-primary underline">
            Non hai il telefono? Usa un codice di recupero
          </button>
        ) : (
          <button type="button" onClick={() => switchMode("totp")} className="font-semibold text-primary underline">
            Usa il codice dell&apos;app
          </button>
        )}
        <button type="button" onClick={() => onRestart("")} className="font-semibold text-muted underline">
          Torna indietro
        </button>
      </div>
    </form>
  );
}
