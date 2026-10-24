import { randomInt } from "node:crypto";

/** Senza 0/O, 1/I/L e simili: si dettano a voce o si copiano da uno schermo piccolo senza errori. */
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Codice breve nel formato XXXX-XXXX (31^8 combinazioni, generato con un generatore sicuro). */
export function generateCode(): string {
  let out = "";
  for (let i = 0; i < 8; i++) {
    if (i === 4) out += "-";
    out += ALPHABET[randomInt(ALPHABET.length)];
  }
  return out;
}

/** Ripulisce quello che l'utente scrive: spazi, minuscole, trattino mancante. Null se non può essere un codice. */
export function normalizeCode(input: string): string | null {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (raw.length !== 8) return null;
  for (const ch of raw) if (!ALPHABET.includes(ch)) return null;
  return `${raw.slice(0, 4)}-${raw.slice(4)}`;
}

/** Identificatore pubblico opaco di un utente (mai l'id dell'account). */
export function generatePublicId(): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 12; i++) out += chars[randomInt(chars.length)];
  return out;
}
