"use client";

import { useEffect, useState } from "react";

const UNITS = [
  { label: "giorni", size: 86_400_000, mod: Infinity },
  { label: "ore", size: 3_600_000, mod: 24 },
  { label: "minuti", size: 60_000, mod: 60 },
  { label: "secondi", size: 1000, mod: 60 },
] as const;

/**
 * Il grande conto alla rovescia della pagina di manutenzione. Prima del montaggio non si conosce l'ora
 * del browser: mostra trattini, per non avere differenze tra server e browser. Allo zero invita a entrare.
 */
export function MaintenanceClock({ endsAt }: { endsAt: number }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const left = now === null ? null : Math.max(0, endsAt - now);

  if (left === 0) {
    return (
      <div role="status" className="grid justify-items-center gap-3">
        <p className="font-display text-3xl font-bold sm:text-4xl">Siamo di nuovo online!</p>
        {/* Link normale e non <Link>: serve una ricarica completa, perché questa pagina arriva da una risposta 503. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="btn btn-primary min-h-14 px-8 text-lg">
          Entra
        </a>
      </div>
    );
  }

  return (
    <div role="timer" aria-live="off" aria-label="Tempo alla riapertura" className="grid grid-cols-4 gap-2 sm:gap-4">
      {UNITS.map(({ label, size, mod }) => {
        const value = left === null ? null : Math.floor(left / size) % mod;
        return (
          <div key={label} className="grid justify-items-center gap-1 rounded-2xl border-2 border-[#1c3d6e]/25 bg-white/60 px-1 py-3 sm:px-4 sm:py-5">
            <span className="font-mono text-3xl font-extrabold tabular-nums sm:text-6xl">{value === null ? "--" : String(value).padStart(2, "0")}</span>
            <span className="text-[0.6875rem] font-bold uppercase tracking-widest opacity-70 sm:text-sm">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
