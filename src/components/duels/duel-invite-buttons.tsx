"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { answerDuelInvite } from "@/app/actions/duels";

/** Accetta o rifiuta un invito. Un tocco alla volta. */
export function DuelInviteButtons({ id, goTo }: { id: string; goTo?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function answer(accept: boolean) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const r = await answerDuelInvite(id, accept);
      if (!r.ok) setError(r.error);
      else if (accept && goTo) router.push(`/duelli/${id}`);
      else router.refresh();
    } catch {
      setError("Qualcosa è andato storto: riprova.");
    }
    setBusy(false);
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} className="btn btn-primary min-h-12" onClick={() => answer(true)}>
          Accetta
        </button>
        <button type="button" disabled={busy} className="btn btn-ghost min-h-12" onClick={() => answer(false)}>
          Rifiuta
        </button>
      </div>
      {error && (
        <p role="alert" className="rounded-lg border border-accent bg-surface-muted p-2 text-sm font-semibold">
          {error}
        </p>
      )}
    </div>
  );
}
