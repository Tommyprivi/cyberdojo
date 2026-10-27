"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { challengeFriend } from "@/app/actions/duels";

/** Bottone «Sfida» accanto a un amico: crea il duello e porta alla sua pagina. */
export function ChallengeButton({ friendshipId, name }: { friendshipId: string; name: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const r = await challengeFriend(friendshipId);
      if (r.ok) router.push(`/duelli/${r.id}`);
      else setError(r.error);
    } catch {
      setError("Non sono riuscito a creare la sfida: riprova.");
    }
    setBusy(false);
  }

  return (
    <>
      <button type="button" disabled={busy} className="btn btn-ghost" onClick={go} aria-label={`Sfida ${name} a un duello`}>
        {busy ? "Invio…" : "Sfida"}
      </button>
      {error && (
        <p role="alert" className="basis-full rounded-lg border border-accent bg-surface-muted p-2 text-sm font-semibold">
          {error}
        </p>
      )}
    </>
  );
}
