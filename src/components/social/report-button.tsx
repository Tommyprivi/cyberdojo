"use client";

import { useId, useState } from "react";
import { reportSocial } from "@/app/actions/social";
import { REPORT_REASONS, type ReportReason } from "@/lib/social/rules";
import { NoticeLine, useAction } from "./use-action";

/**
 * «Segnala»: motivo da un elenco chiuso (nessun testo libero). Segnalare blocca subito l'elemento per chi
 * segnala; al titolare arrivano solo identificativo, motivo e data.
 */
export function ReportButton({ kind, targetId, what }: { kind: "user" | "group"; targetId: string; what: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | null>(null);
  const { busy, notice, run } = useAction();
  const name = useId();

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-muted underline underline-offset-2 hover:text-accent" aria-label={`Segnala ${what}`}>
        Segnala
      </button>
    );
  }

  return (
    <div role="group" aria-label={`Segnala ${what}`} className="grid w-full gap-2 rounded-lg border-2 border-accent bg-surface p-3">
      <p className="text-sm font-semibold">Perché lo segnali?</p>
      <div className="grid gap-1">
        {REPORT_REASONS.map((r) => (
          <label key={r.id} className="flex min-h-11 cursor-pointer items-center gap-2 text-sm">
            <input type="radio" name={name} className="size-5 accent-[var(--accent)]" checked={reason === r.id} onChange={() => setReason(r.id)} />
            {r.label}
          </label>
        ))}
      </div>
      <p className="text-xs text-muted">
        Lo blocchiamo subito per te: non lo vedrai più. A noi arrivano solo l&apos;identificativo, il motivo e la data, nessun tuo dato.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!reason || busy}
          className="btn btn-primary"
          onClick={async () => {
            if (!reason) return;
            const r = await run(() => reportSocial({ kind, targetId, reason }), "Segnalazione inviata e blocco attivo.");
            if (r.ok) setOpen(false);
          }}
        >
          Segnala e blocca
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)} disabled={busy}>
          Annulla
        </button>
      </div>
      <NoticeLine notice={notice} />
    </div>
  );
}
