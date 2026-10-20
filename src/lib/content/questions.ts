import { ARP_BANK, ENCAPSULATION_BANK, OSI_BANK, PACKET_BASICS } from "@/lib/practice/banks";
import { CYBER_BANK_ITEMS } from "@/lib/practice/banks-cyber";
import { readRawLessons } from "./load";

/** Una domanda di una banca, con tutto ciò che serve per rivederla. */
export type QuestionRow = {
  /** Identificativo stabile: "<banca>#<numero>" (il numero segue l'ordine nel file della banca). */
  id: string;
  bank: string;
  q: string;
  ok: string;
  no: string[];
  /** Codice modulo, es. C8, F5. */
  moduleCode: string;
  /** Lezione che usa la banca (se c'è). */
  lessonId?: string;
};

/** Tutte le domande di tutte le banche, in ordine di modulo e banca. */
export function loadQuestions(): QuestionRow[] {
  const lessonByBank = new Map<string, string>();
  for (const l of readRawLessons()) {
    const gen = (l.data.verification as { generator?: string } | undefined)?.generator;
    if (gen && typeof l.data.id === "string") lessonByBank.set(gen, l.data.id);
  }
  const all: Record<string, readonly { q: string; ok: string; no: readonly string[] }[]> = {
    "packet-basics": PACKET_BASICS,
    "arp-concepts": ARP_BANK,
    "osi-layers": OSI_BANK,
    encapsulation: ENCAPSULATION_BANK,
    ...CYBER_BANK_ITEMS,
  };
  const moduleOf = (bank: string) => {
    const m = /^c(\d{2})-/.exec(bank);
    if (m) return `C${Number(m[1])}`;
    const lesson = lessonByBank.get(bank);
    const f = lesson && /^F\.(\d{2})\./.exec(lesson);
    return f ? `F${Number(f[1])}` : "F5";
  };
  return Object.entries(all)
    .flatMap(([bank, items]) =>
      items.map((it, i) => ({
        id: `${bank}#${i + 1}`,
        bank,
        q: it.q,
        ok: it.ok,
        no: [...it.no],
        moduleCode: moduleOf(bank),
        lessonId: lessonByBank.get(bank),
      })),
    )
    .sort((a, b) => a.moduleCode.localeCompare(b.moduleCode, "it", { numeric: true }) || a.bank.localeCompare(b.bank) || a.id.localeCompare(b.id, "it", { numeric: true }));
}
