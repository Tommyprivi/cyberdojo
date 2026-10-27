"use client";

import { useEffect, useState } from "react";
import { savePortfolio } from "@/app/actions/portfolio";
import { Avatar } from "../social/avatar";
import { useAction } from "../social/use-action";

type Values = { enabled: boolean; showCertificates: boolean; showBelt: boolean };

const OPTIONS: { key: keyof Values; title: string; text: string }[] = [
  { key: "enabled", title: "Pagina pubblica accesa", text: "Chiunque abbia il link la vede, anche senza account. Spenta, il link smette di funzionare." },
  { key: "showBelt", title: "Mostra cintura e XP", text: "Compaiono la tua cintura, il livello e i punti XP totali." },
  { key: "showCertificates", title: "Mostra i certificati", text: "Ogni certificato rimanda alla verifica pubblica, che mostra solo nome e iniziale del cognome." },
];

/** Interruttori del portfolio con anteprima e link da copiare. Spento di default; ogni scelta si salva subito. */
export function PortfolioSettings({
  initial,
  blockedReason,
  nickname,
  avatar,
  publicId,
  certificateCount,
}: {
  initial: Values;
  blockedReason: string | null;
  nickname: string | null;
  avatar: string;
  publicId: string | null;
  certificateCount: number;
}) {
  const [values, setValues] = useState<Values>(initial);
  const { busy, notice, setNotice, run } = useAction();
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => setOrigin(window.location.origin), []);

  const link = publicId ? `${origin}/p/${publicId}` : "";

  const change = async (key: keyof Values, on: boolean) => {
    const prev = values;
    const next = { ...values, [key]: on };
    setValues(next);
    const r = await run(() => savePortfolio(next), on ? "Salvato: attivato." : "Salvato: disattivato.");
    if (!r.ok) setValues(prev);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setNotice({ kind: "ok", text: "Link copiato." });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setNotice({ kind: "error", text: "Non riesco a copiare: seleziona il link e copialo a mano." });
    }
  };

  return (
    <div className="grid gap-4">
      {blockedReason && (
        <p role="note" className="rounded-lg border border-border bg-surface-muted p-3 text-sm">
          {blockedReason}
        </p>
      )}

      <div className="grid gap-3">
        {OPTIONS.map((o) => (
          <label key={o.key} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-3">
            <input
              type="checkbox"
              role="switch"
              className="mt-1 size-5 shrink-0 accent-[var(--primary)]"
              checked={values[o.key]}
              disabled={busy || (blockedReason !== null && o.key === "enabled")}
              onChange={(e) => void change(o.key, e.target.checked)}
            />
            <span>
              <strong>{o.title}</strong>
              <span className="mt-0.5 block text-sm text-muted">{o.text}</span>
            </span>
          </label>
        ))}
      </div>

      <section aria-label="Anteprima" className="grid gap-3 rounded-lg border border-border bg-surface p-4">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted">Anteprima: cosa vede chi apre il link</h2>
        <div className="flex items-center gap-3">
          <Avatar id={avatar} size={56} />
          <p className="font-display text-xl font-bold [overflow-wrap:anywhere]">{nickname ?? "Scegli un soprannome"}</p>
        </div>
        <ul className="grid gap-1 text-sm">
          <li>{values.showBelt ? "Cintura e XP: visibili" : "Cintura e XP: nascosti"}</li>
          <li>{values.showCertificates ? `Certificati: visibili (${certificateCount})` : "Certificati: nascosti"}</li>
          <li className="text-muted">Mai visibili: nome vero, email, età, risultati delle verifiche. La pagina non compare nei motori di ricerca.</li>
        </ul>
      </section>

      {values.enabled && !blockedReason && publicId ? (
        <section aria-label="Il tuo link" className="grid gap-2 rounded-lg border border-border bg-surface p-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted">Il tuo link</h2>
          <input
            readOnly
            value={link}
            aria-label="Link della tua pagina pubblica"
            onFocus={(e) => e.currentTarget.select()}
            className="min-h-11 w-full rounded-md border border-border bg-background px-3 font-mono text-sm"
          />
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary min-h-11" onClick={() => void copy()}>
              {copied ? "Copiato" : "Copia il link"}
            </button>
            <a href={`/p/${publicId}`} target="_blank" rel="noreferrer" className="btn btn-ghost min-h-11">
              Apri la pagina
            </a>
          </div>
        </section>
      ) : (
        <p className="text-sm text-muted">Il link compare qui quando accendi la pagina pubblica.</p>
      )}

      {notice && (
        <p role={notice.kind === "error" ? "alert" : "status"} className={`font-semibold ${notice.kind === "error" ? "text-accent" : "text-success"}`}>
          {notice.text}
        </p>
      )}
    </div>
  );
}
