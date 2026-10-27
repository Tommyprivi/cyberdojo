"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPushPublicKey, subscribePush } from "@/app/actions/push";
import { currentSubscription, pushSupported, requestAndSubscribe } from "@/lib/push/client";

const DISMISS_KEY = "cd-push-dismissed";

type State = "nascosto" | "invito" | "fatto" | "negato";

/**
 * Invito gentile da mostrare DOPO una lezione completata: «vuoi un promemoria?».
 * Il permesso del browser si chiede solo quando premi il bottone, mai da solo.
 * Non compare se le notifiche sono spente sul sito, se il browser non le supporta,
 * se hai già detto di sì o di no, o se hai chiuso l'invito.
 */
export function AskPush() {
  const [state, setState] = useState<State>("nascosto");
  const [key, setKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!pushSupported() || Notification.permission === "denied") return;
        if (localStorage.getItem(DISMISS_KEY)) return;
        const k = await getPushPublicKey();
        if (!k || !alive) return;
        if (await currentSubscription()) return;
        setKey(k);
        setState("invito");
      } catch {
        /* nessun invito: il resto della pagina funziona uguale */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (state === "nascosto") return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ok */
    }
    setState("nascosto");
  };

  if (state === "fatto" || state === "negato") {
    return (
      <p className="rounded-lg border border-border bg-surface-muted p-3 text-sm" role="status">
        {state === "fatto" ? (
          <>
            Fatto: ti scriveremo ogni tanto, con calma. Scegli ora e tipi in{" "}
            <Link href="/profilo/notifiche" className="font-semibold underline">
              Notifiche
            </Link>
            .
          </>
        ) : (
          "Va bene, niente notifiche. Se cambi idea puoi attivarle dal profilo."
        )}
      </p>
    );
  }

  return (
    <section className="grid gap-3 rounded-lg border border-border bg-surface p-4" aria-label="Notifiche">
      <div>
        <p className="font-display text-lg font-bold">Vuoi un promemoria gentile?</p>
        <p className="text-sm text-muted">
          Una notifica al giorno, all&apos;ora che scegli tu, solo se non hai ancora studiato. Nessuna pressione, e la spegni quando vuoi.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-primary"
          disabled={busy}
          onClick={async () => {
            if (!key) return;
            setBusy(true);
            const r = await requestAndSubscribe(key);
            if (!r.ok) {
              setState(r.reason === "negato" ? "negato" : "nascosto");
              setBusy(false);
              return;
            }
            const saved = await subscribePush(r.subscription);
            setState(saved.ok ? "fatto" : "nascosto");
            setBusy(false);
          }}
        >
          {busy ? "Un attimo…" : "Sì, attiva"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={dismiss}>
          No, grazie
        </button>
      </div>
    </section>
  );
}
