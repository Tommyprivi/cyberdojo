"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteMyAccount, exportMyData } from "@/app/actions/profile";
import { authClient } from "@/lib/auth-client";

/** Diritti sui dati (GDPR): scaricare tutto ciò che sappiamo di te, oppure cancellare l'account. */
export function AccountActions({ email }: { email: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");

  const download = async () => {
    setBusy(true);
    setMessage(null);
    const r = await exportMyData();
    if (!r.ok) setMessage(r.error);
    else {
      const url = URL.createObjectURL(new Blob([r.json], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = r.filename;
      a.click();
      URL.revokeObjectURL(url);
    }
    setBusy(false);
  };

  const remove = async () => {
    setBusy(true);
    setMessage(null);
    const r = await deleteMyAccount(typed);
    if (!r.ok) {
      setMessage(r.error);
      return setBusy(false);
    }
    await authClient.signOut().catch(() => {});
    router.push("/");
    router.refresh();
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={download} disabled={busy} className="btn btn-ghost">
          Scarica i miei dati
        </button>
        {!confirming && (
          <button type="button" onClick={() => setConfirming(true)} className="btn btn-ghost text-accent">
            Cancella il mio account
          </button>
        )}
      </div>

      {confirming && (
        <div role="alertdialog" aria-label="Conferma cancellazione" className="grid gap-3 rounded-2xl border-2 border-accent bg-surface-muted p-4">
          <p className="font-bold">Questa azione non si può annullare.</p>
          <p>Cancelliamo l&apos;account, i progressi, gli XP e la serie. Per confermare, scrivi la tua email: <strong>{email}</strong></p>
          <input className="field" type="email" autoComplete="off" value={typed} onChange={(e) => setTyped(e.target.value)} aria-label="Riscrivi la tua email" />
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={remove} disabled={busy || typed.trim() === ""} className="btn btn-primary">
              Cancella per sempre
            </button>
            <button type="button" onClick={() => { setConfirming(false); setTyped(""); }} className="btn btn-ghost">
              Annulla
            </button>
          </div>
        </div>
      )}
      {message && <p role="alert" className="font-semibold text-accent">{message}</p>}
    </div>
  );
}
