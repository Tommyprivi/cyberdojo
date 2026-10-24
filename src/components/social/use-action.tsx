"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type Notice = { kind: "ok" | "error"; text: string } | null;

/**
 * Esegue un'azione sul server, mostra l'esito e ricarica i dati della pagina.
 * Un solo passaggio alla volta (`busy`), così un doppio tocco sul telefono non la ripete.
 */
export function useAction() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  async function run<T extends { ok: boolean }>(fn: () => Promise<T | { ok: false; error: string }>, okText?: string): Promise<T | { ok: false; error: string }> {
    if (busy) return { ok: false, error: "Un attimo: sto ancora lavorando." };
    setBusy(true);
    setNotice(null);
    try {
      const r = await fn();
      if (r.ok) {
        if (okText) setNotice({ kind: "ok", text: okText });
        router.refresh();
      } else {
        setNotice({ kind: "error", text: (r as { error: string }).error });
      }
      return r;
    } catch {
      const r = { ok: false as const, error: "Qualcosa non ha funzionato: riprova tra poco." };
      setNotice({ kind: "error", text: r.error });
      return r;
    } finally {
      setBusy(false);
    }
  }

  return { busy, notice, setNotice, run };
}

export function NoticeLine({ notice }: { notice: Notice }) {
  if (!notice) return null;
  return (
    <p role={notice.kind === "error" ? "alert" : "status"} className={`text-sm font-semibold ${notice.kind === "error" ? "text-accent" : "text-success"}`}>
      {notice.text}
    </p>
  );
}
