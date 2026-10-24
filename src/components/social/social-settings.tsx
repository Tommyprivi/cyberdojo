"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSocialToggles, unblockEveryone } from "@/app/actions/social";
import type { Toggles } from "@/lib/social/service";

const OPTIONS: { key: keyof Toggles; title: string; sees: string }[] = [
  {
    key: "joinLeaderboard",
    title: "Partecipo alla classifica",
    sees: "Gli altri partecipanti della tua fascia d'età (14-17 oppure 18 e più) vedono il tuo soprannome, il tuo avatar e i punti XP guadagnati nella settimana. Nient'altro.",
  },
  {
    key: "showToFriends",
    title: "Mostro il soprannome agli amici",
    sees: "I tuoi amici vedono soprannome, avatar, serie di giorni, cintura e XP della settimana. Serve anche per poter mandare richieste di amicizia.",
  },
  {
    key: "acceptRequests",
    title: "Accetto richieste di amicizia",
    sees: "Ti viene dato un codice invito da condividere tu, fuori dal sito, con chi vuoi. Chi lo inserisce ti manda una richiesta e decidi tu se accettarla. Puoi rinnovare o spegnere il codice quando vuoi.",
  },
];

/** Interruttori del Social: tutti spenti di default, ognuno salva subito la scelta. */
export function SocialSettings({ initial, canToggle, blocked }: { initial: Toggles; canToggle: boolean; blocked: number }) {
  const router = useRouter();
  const [values, setValues] = useState<Toggles>(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const change = async (key: keyof Toggles, on: boolean) => {
    const next = { ...values, [key]: on };
    setValues(next);
    setBusy(true);
    setMessage(null);
    const r = await saveSocialToggles(next);
    if (!r.ok) {
      setValues(values);
      setMessage({ kind: "error", text: r.error });
    } else {
      setMessage({ kind: "ok", text: on ? "Scelta salvata: attivato." : "Scelta salvata: disattivato." });
      router.refresh();
    }
    setBusy(false);
  };

  return (
    <div className="grid gap-3">
      {!canToggle && (
        <p className="rounded-lg border border-border bg-surface-muted p-3 text-sm" role="note">
          Per attivare gli interruttori scegli prima un soprannome e un avatar (qui sopra).
        </p>
      )}
      {OPTIONS.map((o) => (
        <label key={o.key} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-3">
          <input
            type="checkbox"
            role="switch"
            className="mt-1 size-5 shrink-0 accent-[var(--primary)]"
            checked={values[o.key]}
            disabled={busy || !canToggle}
            onChange={(e) => void change(o.key, e.target.checked)}
          />
          <span>
            <strong>{o.title}</strong>
            <span className="mt-0.5 block text-sm text-muted">{o.sees}</span>
          </span>
        </label>
      ))}
      <p className="text-sm text-muted">
        Nessuno vede mai il tuo nome vero, la tua email, la tua età precisa né i tuoi risultati nelle verifiche. Tutto è spento finché non lo accendi tu, e
        spegnendo un interruttore smetti subito di essere visibile in quella parte.
      </p>
      {blocked > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-3">
          <p className="text-sm">
            Hai bloccato <strong>{blocked}</strong> {blocked === 1 ? "elemento" : "elementi"} (persone o gruppi segnalati).
          </p>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={async () => {
              setBusy(true);
              await unblockEveryone();
              setBusy(false);
              setMessage({ kind: "ok", text: "Blocchi tolti." });
              router.refresh();
            }}
            disabled={busy}
          >
            Togli tutti i blocchi
          </button>
        </div>
      )}
      {message && (
        <p role={message.kind === "error" ? "alert" : "status"} className={`font-semibold ${message.kind === "error" ? "text-accent" : "text-success"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
