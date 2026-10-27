import type { PianoCorso } from "./tipi";

const BELTS = ["bianca", "gialla", "arancione", "verde", "blu"] as const;

export const beltOfModule = (n: number) => BELTS[Math.floor((n - 1) / 4)];
export const titoliLezioni = (lezioni: string) => lezioni.split("|").map((t) => t.trim());

/** Controlla la forma del piano: 5 blocchi x 4 moduli x 10 lezioni, titoli distinti. */
export function validaPiano(piano: PianoCorso[]): string[] {
  const err: string[] = [];
  const lettere = new Set<string>();
  const cartelle = new Set<string>();
  for (const c of piano) {
    if (!/^[A-Z]$/.test(c.id)) err.push(`${c.id}: la lettera del corso deve essere una sola maiuscola`);
    if (lettere.has(c.id)) err.push(`lettera ripetuta: ${c.id}`);
    if (cartelle.has(c.cartella)) err.push(`cartella ripetuta: ${c.cartella}`);
    lettere.add(c.id);
    cartelle.add(c.cartella);
    if (c.blocchi.length !== 5) err.push(`${c.id}: servono 5 blocchi, ce ne sono ${c.blocchi.length}`);
    const visti = new Set<string>();
    c.blocchi.forEach((b, bi) => {
      if (b.moduli.length !== 4) err.push(`${c.id} blocco ${bi + 1}: servono 4 moduli, ce ne sono ${b.moduli.length}`);
      b.moduli.forEach((m, mi) => {
        const n = bi * 4 + mi + 1;
        const t = titoliLezioni(m.lezioni);
        if (t.length !== 10) err.push(`${c.id}${n} (${m.titolo}): servono 10 lezioni, ce ne sono ${t.length}`);
        for (const x of t) {
          if (x.length < 5) err.push(`${c.id}${n}: titolo troppo corto «${x}»`);
          if (visti.has(x.toLowerCase())) err.push(`${c.id}${n}: titolo ripetuto nel corso «${x}»`);
          visti.add(x.toLowerCase());
        }
      });
    });
  }
  return err;
}

