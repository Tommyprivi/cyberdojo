"use client";

import { createContext, useContext } from "react";

type PlayerCtx = {
  lessonId: string;
  /** Chiamato dalla verifica pratica quando l'utente la supera: sblocca "Avanti". */
  markVerified: () => void;
};

export const PlayerContext = createContext<PlayerCtx | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("Componente usato fuori dal player di lezione");
  return ctx;
}
