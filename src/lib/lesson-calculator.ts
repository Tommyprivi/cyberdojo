/**
 * Quando mostrare la calcolatrice dentro una lezione. Funzione pura (nessun accesso ai file).
 * - nei corsi di numeri (Trading T, Hedge fund H, Dati D, Database B) c'è sempre;
 * - altrove compare se il testo parla di calcoli: servono almeno due segnali diversi, così una parola isolata non basta.
 */
const ALWAYS = new Set(["T", "H", "D", "B"]);

/** Argomenti che si risolvono con i numeri: bastano da soli. */
const STRONG = [/subnet|netmask|maschera di rete/, /binari|esadecimal/];

/** Segnali deboli: ne servono due diversi. */
const SIGNALS = [
  /percentual|%/,
  /formula/,
  /rendiment|margine|interess[ei]|\broi\b|ricavi|costo/,
  /probabilit|media|mediana|deviazione|varianza/,
  /calcol/,
  /entropia|combinazion|permutazion|potenza/,
];

export function lessonWantsCalculator(lessonId: string, body: string): boolean {
  if (ALWAYS.has(lessonId[0] ?? "")) return true;
  const text = body
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  if (STRONG.some((re) => re.test(text))) return true;
  return SIGNALS.filter((re) => re.test(text)).length >= 2;
}
