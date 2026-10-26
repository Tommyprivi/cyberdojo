"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Mascot } from "./mascot";

const COLORS = ["var(--primary)", "var(--sun)", "var(--sky)", "var(--accent)", "var(--belt-orange)"];
const PIECES = 44;
const PIECES_BIG = 90;

/** Chiave condivisa: la novità (id dell'ultimo annuncio) che questo browser ha già festeggiato. */
export const NEWS_SEEN_KEY = "news-seen";

/**
 * La festa dell'aggiornamento, mentre si sta usando l'app: coriandoli che cadono e una scheda con le novità.
 * Non blocca niente: i coriandoli non si possono toccare, la scheda sta in alto e sparisce da sola.
 * Chi ha scelto «riduci movimento» vede solo la scheda. Il suono lo avvia chi la mostra.
 */
export function NewsCelebration({ onClose, big = false }: { onClose: () => void; big?: boolean }) {
  useEffect(() => {
    const id = window.setTimeout(onClose, big ? 18_000 : 14_000);
    return () => window.clearTimeout(id);
  }, [onClose, big]);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden motion-reduce:hidden">
        {Array.from({ length: big ? PIECES_BIG : PIECES }, (_, i) => (
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
        <div
          className={`rise pointer-events-auto grid w-full gap-2 rounded-2xl border-2 border-primary bg-surface shadow-2xl ${
            big ? "max-w-lg gap-3 p-5 sm:p-6" : "max-w-md p-4"
          }`}
        >
          <div className="flex items-center gap-3">
            <Mascot size={big ? 88 : 56} animate />
            <div className="min-w-0">
              <p className={`font-display font-bold leading-tight ${big ? "text-2xl sm:text-3xl" : "text-xl"}`}>
                {big ? "Sta arrivando il più grande aggiornamento!" : "Novità arrivate!"}
              </p>
              <p className="text-sm text-muted">{big ? "Sabato 31 ottobre alle 15:00. Fino ad allora studia come sempre." : "Puoi continuare la lezione: non cambia niente."}</p>
            </div>
          </div>
          <ul className="grid gap-0.5 text-sm">
            <li>🧭 Percorso a livelli e test d&apos;ingresso</li>
            <li>📱 App Android con notifiche e calcolatrice</li>
            <li>💬 Community più grande e nuovi corsi</li>
          </ul>
          {big && <p className="text-sm text-muted">Durante la manutenzione potrai continuare solo i corsi che hai già iniziato.</p>}
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
