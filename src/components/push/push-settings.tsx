"use client";

import { useEffect, useState } from "react";
import { getPushPublicKey, savePushPrefs, subscribePush, unsubscribePush } from "@/app/actions/push";
import { browserUnsubscribe, currentSubscription, pushSupported, requestAndSubscribe } from "@/lib/push/client";
import type { PushKind } from "@/lib/push/rules";

const HOURS = Array.from({ length: 24 }, (_, h) => h);
const KINDS: { key: PushKind; title: string; text: string }[] = [
  { key: "studio", title: "Promemoria di studio", text: "Una volta al giorno, solo se oggi non hai ancora studiato." },
  { key: "novita", title: "Novità", text: "Quando esce un nuovo annuncio del dojo." },
  { key: "sfide", title: "Sfide", text: "Inviti alle sfide della community." },
];

/** Impostazioni notifiche. Il permesso del browser si chiede solo premendo «Attiva su questo dispositivo». */
export function PushSettings({ initialHour, initialKinds }: { initialHour: number; initialKinds: PushKind[]; }) {
  const [supported, setSupported] = useState(true);
  const [on, setOn] = useState(false);
  const [denied, setDenied] = useState(false);
  const [hour, setHour] = useState(initialHour);
  const [kinds, setKinds] = useState<PushKind[]>(initialKinds);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setSupported(pushSupported());
      if (!pushSupported()) return;
      setDenied(Notification.permission === "denied");
      setOn(!!(await currentSubscription()));
    })();
  }, []);

  useEffect(() => {
    getPushPublicKey().then(setPublicKey).catch(() => {});
  }, []);

  const report = (ok: boolean, good: string, bad = "Qualcosa non ha funzionato. Riprova.") => setMsg({ kind: ok ? "ok" : "error", text: ok ? good : bad });

  const enable = async () => {
    if (!publicKey) return;
    setBusy(true);
    setMsg(null);
    const r = await requestAndSubscribe(publicKey);
    if (!r.ok) {
      setDenied(r.reason === "negato");
      report(false, "", r.reason === "negato" ? "Il browser ha bloccato le notifiche: puoi sbloccarle dalle impostazioni del sito." : "Non è stato possibile attivare le notifiche su questo dispositivo.");
    } else {
      const s = await subscribePush(r.subscription, { hour, kinds });
      setOn(s.ok);
      report(s.ok, "Fatto: notifiche attive su questo dispositivo.", s.ok ? undefined : s.error);
    }
    setBusy(false);
  };

  const disable = async () => {
    setBusy(true);
    const endpoint = await browserUnsubscribe();
    const r = await unsubscribePush(endpoint ?? undefined);
    setOn(false);
    report(r.ok, "Notifiche disattivate su questo dispositivo.", r.ok ? undefined : r.error);
    setBusy(false);
  };

  const save = async () => {
    setBusy(true);
    const r = await savePushPrefs({ hour, kinds });
    report(r.ok, "Scelte salvate.", r.ok ? undefined : r.error);
    setBusy(false);
  };

  const toggle = (k: PushKind) => setKinds((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));

  if (!supported) {
    return <p className="rounded-lg border border-border bg-surface-muted p-3">Questo browser non supporta le notifiche. Su Android e PC prova con Chrome, Edge o Firefox.</p>;
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2 rounded-lg border border-border bg-surface p-3">
        <p>
          Stato su questo dispositivo: <strong>{on ? "attive" : "spente"}</strong>
        </p>
        {denied && !on && <p className="text-sm text-muted">Hai bloccato le notifiche nel browser: per attivarle sbloccale dalle impostazioni del sito (icona del lucchetto).</p>}
        {on ? (
          <button type="button" className="btn btn-ghost w-fit" disabled={busy} onClick={disable}>
            Disattiva su questo dispositivo
          </button>
        ) : (
          <button type="button" className="btn btn-primary w-fit" disabled={busy || !publicKey || denied} onClick={enable}>
            Attiva su questo dispositivo
          </button>
        )}
      </div>

      <fieldset className="grid gap-2">
        <legend className="mb-1 font-semibold">Cosa vuoi ricevere</legend>
        {KINDS.map((k) => (
          <label key={k.key} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-3">
            <input type="checkbox" className="mt-1 size-5" checked={kinds.includes(k.key)} onChange={() => toggle(k.key)} />
            <span>
              <span className="block font-semibold">{k.title}</span>
              <span className="block text-sm text-muted">{k.text}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <label className="grid gap-1">
        <span className="font-semibold">A che ora, per il promemoria di studio</span>
        <select className="min-h-11 w-fit rounded-md border border-border bg-surface px-3" value={hour} onChange={(e) => setHour(Number(e.target.value))}>
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {String(h).padStart(2, "0")}:00
            </option>
          ))}
        </select>
        <span className="text-sm text-muted">L&apos;ora è quella del tuo fuso orario, non quella del server.</span>
      </label>

      <button type="button" className="btn btn-primary w-fit" disabled={busy} onClick={save}>
        Salva le scelte
      </button>
      {msg && (
        <p role="status" className={msg.kind === "ok" ? "text-success" : "text-danger"}>
          {msg.text}
        </p>
      )}
    </div>
  );
}
