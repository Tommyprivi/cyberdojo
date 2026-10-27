"use client";

import dynamic from "next/dynamic";

/**
 * Il quiz porta con sé tutte le banche di domande (migliaia di righe): si scarica solo quando la pagina
 * lo mostra, così il resto del Laboratorio si apre subito.
 */
export const QuizLazy = dynamic(() => import("./quiz").then((m) => m.Quiz), {
  ssr: false,
  loading: () => <div className="h-64 rounded-lg bg-surface-muted" aria-busy="true" aria-label="Carico il quiz" />,
});
