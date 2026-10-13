"use client";

import { createContext, useContext } from "react";

export type LessonVideo = {
  id: string;
  start: number;
  end: number;
  channel: string;
  title?: string;
};

type PlayerCtx = {
  lessonId: string;
  /** Video dal frontmatter, se c'è. */
  video?: LessonVideo;
  /** Chiamato dalla verifica pratica quando l'utente la supera: sblocca "Avanti". */
  markVerified: () => void;
};

export const PlayerContext = createContext<PlayerCtx | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("Componente usato fuori dal player di lezione");
  return ctx;
}
