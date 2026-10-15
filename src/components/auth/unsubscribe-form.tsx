"use client";

import Link from "next/link";
import { useState } from "react";
import { unsubscribeReminders } from "@/app/actions/mail";

/** Conferma esplicita: un semplice clic sul link non disattiva nulla (gli antivirus aprono i link da soli). */
export function UnsubscribeForm({ token }: { token: string }) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  if (state === "done") {
    return (
      <div role="status" className="grid gap-3">
        <p className="text-lg font-semibold">Fatto: i promemoria sono disattivati.</p>
        <p className="text-muted">Non ti scriveremo più per ricordarti di studiare. Puoi riattivarli quando vuoi dal tuo profilo.</p>
        <Link href="/profilo" className="btn btn-ghost w-fit">Vai al profilo</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <p>Vuoi smettere di ricevere i promemoria di studio?</p>
      {state === "error" && <p role="alert" className="font-semibold text-accent">{message}</p>}
      <button
        type="button"
        disabled={state === "busy"}
        className="btn btn-primary w-fit"
        onClick={async () => {
          setState("busy");
          const r = await unsubscribeReminders(token);
          if (r.ok) setState("done");
          else {
            setMessage(r.error);
            setState("error");
          }
        }}
      >
        Sì, disattiva i promemoria
      </button>
    </div>
  );
}
