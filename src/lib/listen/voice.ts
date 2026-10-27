/** Logica pura per «Sensei a voce»: pulizia del testo da leggere e dettatura nel campo. */

const MAX_SPOKEN = 1500;

/** Testo adatto alla lettura ad alta voce (senza markdown, codice e simboli). */
export function speakable(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\/lezione\/([A-Z]\.\d{2}\.\d{3})/g, "la lezione $1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}(?:[-*+]|\d+[.)])\s+/gm, "")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/[*_`~#>]+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_SPOKEN);
}

/** Aggiunge il testo dettato a quello già scritto, rispettando il massimo di caratteri. */
export function appendDictation(current: string, dictated: string, max = 1000): string {
  const d = dictated.replace(/\s+/g, " ").trim();
  const c = current.trimEnd();
  return (c && d ? `${c} ${d}` : c || d).slice(0, max);
}
