"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { changeAgeBand } from "@/app/actions/profile";
import { AGE_BANDS } from "@/lib/age-bands";
import { ageGroupOf } from "@/lib/social/rules";

const LABEL: Record<string, string> = { "14-17": "14-17 anni", "18-25": "18-25 anni", "26-40": "26-40 anni", "41+": "41 anni o più" };

/** Cambio della fascia d'età: serve per correggere un errore o quando si compie un'età nuova. */
export function AgeSettings({ current }: { current: string | null }) {
  const router = useRouter();
  const [band, setBand] = useState(current ?? "");
  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const changesGroup = band !== "" && band !== current && ageGroupOf(current) !== ageGroupOf(band);
  const canSave = band !== "" && band !== current && confirmed && !pending;

  return (
    <details className="rounded-md border border-border bg-background p-3">
      <summary className="min-h-11 cursor-pointer py-2 font-semibold">Cambia la fascia d&apos;età</summary>
      <div className="mt-2 grid gap-3">
        <p className="text-sm text-muted">
          Usala per correggere un errore o quando compi un&apos;età nuova. La fascia deve essere quella vera: tiene i ragazzi 14-17 separati dagli adulti.
        </p>
        <label className="grid gap-1">
          <span className="text-sm font-semibold">La tua fascia</span>
          <select className="field" value={band} onChange={(e) => { setBand(e.target.value); setMessage(null); }}>
            <option value="" disabled>Scegli…</option>
            {AGE_BANDS.map((b) => (
              <option key={b} value={b}>{LABEL[b]}</option>
            ))}
          </select>
        </label>
        {changesGroup ? (
          <p role="note" className="rounded-md border border-accent bg-surface p-3 text-sm">
            <strong>Attenzione:</strong> passando tra ragazzi e adulti il social si azzera: soprannome, amici, gruppi e classifica. Non si portano da una fascia all&apos;altra.
          </p>
        ) : null}
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" className="mt-1 size-5" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
          <span>Confermo che questa è la mia fascia d&apos;età vera.</span>
        </label>
        <button
          type="button"
          className="btn btn-primary min-h-12"
          disabled={!canSave}
          onClick={() =>
            start(async () => {
              const r = await changeAgeBand({ band, confirmed });
              if (r.ok) {
                setMessage({ ok: true, text: r.reset ? "Fascia cambiata. Il social è stato azzerato: scegli di nuovo soprannome e avatar." : "Fascia aggiornata." });
                setConfirmed(false);
                router.refresh();
              } else setMessage({ ok: false, text: r.error });
            })
          }
        >
          {pending ? "Salvo…" : "Salva la fascia"}
        </button>
        {message ? (
          <p role="status" className={`text-sm font-semibold ${message.ok ? "text-success" : "text-accent"}`}>{message.text}</p>
        ) : null}
      </div>
    </details>
  );
}
