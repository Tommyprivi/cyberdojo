/**
 * XP: regole della sezione 7 della spec. Lezione 10, verifica pratica +10, primo tentativo perfetto +5.
 * (Esami di modulo e di cintura arrivano con l'epic E7.)
 * Il valore mostrato nelle lezioni (<Recap xp>) è solo informativo: i punti veri si calcolano qui.
 */

export const XP = { lesson: 10, verification: 10, firstTry: 5 } as const;

export type XpEvent = { kind: "lesson" | "verification" | "first_try"; amount: number };

/** Eventi XP da assegnare quando si supera la verifica di una lezione. */
export function xpForPass({ firstTryPerfect }: { firstTryPerfect: boolean }): XpEvent[] {
  const events: XpEvent[] = [
    { kind: "lesson", amount: XP.lesson },
    { kind: "verification", amount: XP.verification },
  ];
  if (firstTryPerfect) events.push({ kind: "first_try", amount: XP.firstTry });
  return events;
}
