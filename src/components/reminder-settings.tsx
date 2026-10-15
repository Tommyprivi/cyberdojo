"use client";

import { useState } from "react";
import { saveReminderPrefs } from "@/app/actions/profile";
import { authClient } from "@/lib/auth-client";

const HOURS = Array.from({ length: 24 }, (_, h) => h);

/**
 * Promemoria di studio via email. Spenti di default: servono una scelta esplicita e un'email
 * confermata. L'orario è quello del tuo fuso, non quello del server.
 */
export function ReminderSettings({
  initialEnabled,
  initialHour,
  emailVerified,
  email,
}: {
  initialEnabled: boolean;
  initialHour: number;
  emailVerified: boolean;
  email: string;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [hour, setHour] = useState(initialHour);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [resent, setResent] = useState(false);

  const save = async () => {
    setBusy(true);
    setMessage(null);
    const r = await saveReminderPrefs({ enabled, hour });
    setMessage(r.ok ? { kind: "ok", text: enabled ? `Fatto: ti scriveremo verso le ${String(hour).padStart(2, "0")}:00, solo nei giorni in cui non hai ancora studiato.` : "Fatto: promemoria disattivati." } : { kind: "error", text: r.error });
    setBusy(false);
  };

  return (
    <div className="grid gap-4">
      {!emailVerified && (
        <div className="grid gap-2 rounded-lg border border-border bg-surface-muted p-3" role="status">
          <p>
            Per attivare i promemoria devi prima <strong>confermare l&apos;email</strong> ({email}). Ti abbiamo mandato un link quando ti sei registrato.
          </p>
          <button
            type="button"
            disabled={resent}
            className="btn btn-ghost w-fit"
            onClick={async () => {
              await authClient.sendVerificationEmail({ email, callbackURL: "/profilo" });
              setResent(true);
            }}
          >
            {resent ? "Link inviato: controlla la posta" : "Rimanda il link di conferma"}
          </button>
        </div>
      )}

      <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-3">
        <input
          type="checkbox"
          className="mt-1 size-5 accent-[var(--primary)]"
          checked={enabled}
          disabled={!emailVerified && !initialEnabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        <span>
          <strong>Mandami un promemoria di studio per email.</strong>
          <span className="block text-sm text-muted">Una al giorno al massimo, solo se quel giorno non hai ancora superato una verifica. Puoi disattivarlo in qualsiasi momento.</span>
        </span>
      </label>

      <label className="grid gap-1.5">
        <span className="font-semibold">A che ora</span>
        <select className="field w-40" value={hour} onChange={(e) => setHour(Number(e.target.value))} disabled={!enabled}>
          {HOURS.map((h) => (
            <option key={h} value={h}>{String(h).padStart(2, "0")}:00</option>
          ))}
        </select>
      </label>

      <button type="button" onClick={save} disabled={busy} className="btn btn-primary w-fit">
        Salva
      </button>
      {message && (
        <p role={message.kind === "error" ? "alert" : "status"} className={`font-semibold ${message.kind === "error" ? "text-accent" : "text-success"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
