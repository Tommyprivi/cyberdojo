"use client";

import { useMemo, type ReactNode } from "react";
import { PlayerContext, type LessonVideo } from "@/components/lesson/player-context";

/**
 * Contesto finto per la revisione: il video della lezione si vede, ma non c'è nessun progresso da
 * scrivere (markVerified non fa nulla). Nessun accesso, nessun database.
 */
export function ReviewPlayerProvider({ lessonId, video, children }: { lessonId: string; video?: LessonVideo; children: ReactNode }) {
  const value = useMemo(() => ({ lessonId, video, markVerified: () => {} }), [lessonId, video]);
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
