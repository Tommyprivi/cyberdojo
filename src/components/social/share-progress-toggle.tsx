"use client";

import { useEffect, useState } from "react";
import { changeShareProgress, readShareProgress } from "@/app/actions/docente";
import { SHARE_PROGRESS_EXPLAIN } from "@/lib/docente/rules";

/** Interruttore del consenso dello studente: spento di default, con la spiegazione di cosa vede il docente. */
export function ShareProgressToggle({ groupId }: { groupId: string }) {
  const [share, setShare] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    readShareProgress(groupId).then((r) => {
      if (alive && r.ok) setShare(r.share);
    });
    return () => {
      alive = false;
    };
  }, [groupId]);

  if (share === null) return null;

  async function toggle(next: boolean) {
    if (busy) return;
    setBusy(true);
    setError(null);
    const r = await changeShareProgress(groupId, next).catch(() => ({ ok: false as const, error: "Qualcosa non ha funzionato: riprova." }));
    if (r.ok) setShare(next);
    else setError(r.error);
    setBusy(false);
  }

  return (
    <div className="grid gap-2 rounded-md border border-border bg-background p-3">
      <label className="flex min-h-11 items-start gap-3 text-sm font-semibold">
        <input type="checkbox" className="mt-0.5 size-6 shrink-0 accent-[var(--primary)]" checked={share} disabled={busy} onChange={(e) => toggle(e.target.checked)} />
        <span>Fai vedere i miei progressi al docente di questa classe</span>
      </label>
      <p className="text-xs">{SHARE_PROGRESS_EXPLAIN}</p>
      <p className="text-xs text-muted">Vale solo se chi ha creato il gruppo è un docente verificato da CyberDojo. Se non lo è, non cambia nulla.</p>
      {error && (
        <p role="alert" className="text-sm font-semibold text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
