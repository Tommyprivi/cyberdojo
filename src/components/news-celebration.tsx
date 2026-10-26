"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Mascot } from "./mascot";

const COLORS = ["var(--primary)", "var(--sun)", "var(--sky)", "var(--accent)", "var(--belt-orange)"];
const PIECES = 44;

/**
 * La festa dell'aggiornamento, mentre si sta usando l'app: coriandoli che cadono e una scheda con le novità.
 * Non blocca niente: i coriandoli non si possono toccare, la scheda sta in alto e sparisce da sola.
 * Chi ha scelto «riduci movimento» vede solo la scheda. Il suono lo avvia chi la mostra.
 */
export function NewsCelebration({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const id = window.setTimeout(onClose, 14_000);
    return () => window.clearTimeout(id);
  }, [onClose]);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden motion-reduce:hidden">
        {Array.from({ length: PIECES }, (_, i) => (
          <span
            key={i}
            className="confetti"
            style={
              {
                left: `${(i * 37 + 11) % 100}%`,
                background: COLORS[i % COLORS.length],
                "--dur": `${2.6 + (i % 6) * 0.45}s`,
                "--delay": `${(i % 11) * 0.14}s`,
                transform: `rotate(${(i * 53) % 360}deg)`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div role="status" className="pointer-events-none fixed inset-x-0 top-3 z-[61] flex justify-center px-3">
        <div className="rise pointer-events-auto grid w-full max-w-md gap-2 rounded-2xl border-2 border-primary bg-surface p-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <Mascot size={56} animate />
            <div className="min-w-0">
              <p className="font-display text-xl font-bold leading-tight">Novità arrivate!</p>
              <p className="text-sm text-muted">Puoi continuare la lezione: non cambia niente.</p>
            </div>
          </div>
          <ul className="grid gap-0.5 text-sm">
            <li>🎨 Nuova grafica, più semplice da telefono</li>
            <li>🧭 Il tuo piano di studio consigliato</li>
            <li>💬 Community con feedback e sfide</li>
          </ul>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/aggiornamenti" data-sound="open" className="btn btn-primary min-h-11 px-4 text-sm">
              Scopri di più
            </Link>
            <button type="button" onClick={onClose} className="btn btn-ghost min-h-11 px-4 text-sm">
              Dopo
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
