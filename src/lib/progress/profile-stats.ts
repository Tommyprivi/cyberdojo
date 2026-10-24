/** Numeri del profilo giocoso: livello, medaglie e calendario. Tutto calcolato dai dati esistenti. */

export const LEVEL_NAMES = ["Novizio", "Apprendista", "Studente", "Analista", "Guardiano", "Maestro"];

/** Soglia di XP per iniziare il livello n: 0, 100, 300, 600, 1000... */
const threshold = (n: number) => 50 * n * (n - 1);

export function levelOf(xp: number) {
  const safe = Math.max(0, Math.floor(xp));
  let level = 1;
  while (safe >= threshold(level + 1)) level++;
  const from = threshold(level);
  const to = threshold(level + 1);
  return {
    level,
    name: LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)],
    from,
    to,
    into: safe - from,
    span: to - from,
    pct: Math.round(((safe - from) / (to - from)) * 100),
  };
}

export type MedalIcon = "check" | "bolt" | "flame" | "belt" | "book" | "target";
export type Medal = { id: string; label: string; hint: string; icon: MedalIcon; unlocked: boolean };

export function medalsFor(i: { xp: number; lessons: number; bestStreak: number; beltDone: boolean; /** Sfide settimanali vinte (settimane concluse). */ challengesWon?: number }): Medal[] {
  const wins = i.challengesWon ?? 0;
  return [
    { id: "first", label: "Primo caso", hint: "Completa una lezione", icon: "check", unlocked: i.lessons >= 1 },
    { id: "xp100", label: "100 XP", hint: "Raggiungi 100 XP", icon: "bolt", unlocked: i.xp >= 100 },
    { id: "xp500", label: "500 XP", hint: "Raggiungi 500 XP", icon: "bolt", unlocked: i.xp >= 500 },
    { id: "ten", label: "Dieci casi", hint: "Completa 10 lezioni", icon: "book", unlocked: i.lessons >= 10 },
    { id: "s3", label: "Serie di 3", hint: "3 giorni di fila", icon: "flame", unlocked: i.bestStreak >= 3 },
    { id: "s7", label: "Serie di 7", hint: "7 giorni di fila", icon: "flame", unlocked: i.bestStreak >= 7 },
    { id: "s30", label: "Serie di 30", hint: "30 giorni di fila", icon: "flame", unlocked: i.bestStreak >= 30 },
    { id: "belt", label: "Cintura gialla", hint: "Completa il primo modulo", icon: "belt", unlocked: i.beltDone },
    { id: "challenge1", label: "Sfidante", hint: "Vinci una sfida settimanale", icon: "target", unlocked: wins >= 1 },
    { id: "challenge5", label: "Campione di sfide", hint: "Vinci 5 sfide settimanali", icon: "target", unlocked: wins >= 5 },
  ];
}

/** Gli ultimi `n` giorni di calendario fino a `today` (YYYY-MM-DD), dal più vecchio. `label` è l'iniziale del giorno. */
export function lastDays(today: string, n: number, doneDays: ReadonlySet<string>) {
  const [y, m, d] = today.split("-").map(Number);
  const base = Date.UTC(y, m - 1, d);
  return Array.from({ length: n }, (_, k) => {
    const t = new Date(base - (n - 1 - k) * 86_400_000);
    const day = t.toISOString().slice(0, 10);
    return { day, done: doneDays.has(day), isToday: k === n - 1, label: "DLMMGVS"[t.getUTCDay()], num: t.getUTCDate() };
  });
}
