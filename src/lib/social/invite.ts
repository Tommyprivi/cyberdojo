import { normalizeCode } from "./codes";
import { NICKNAME_MAX, NICKNAME_MIN } from "./nickname";

/** Invito per WhatsApp: un solo codice, un solo link. Funzioni pure (niente dati personali nel testo). */

/** Codice preso dall'indirizzo `/invito/<codice>`: ripulito e controllato, altrimenti null. */
export function inviteCodeFromParam(param: string): string | null {
  if (param.length > 40) return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(param);
  } catch {
    return null;
  }
  // Solo lettere, numeri e trattino: niente altro è un codice (normalizeCode scarta già il resto, qui si rifiuta).
  if (!/^[A-Za-z0-9-]+$/.test(decoded)) return null;
  return normalizeCode(decoded);
}

/** Link da condividere: `${origine}/invito/<CODICE>`. */
export function inviteUrl(origin: string, code: string): string {
  const normalized = normalizeCode(code);
  if (!normalized) throw new Error("Codice non valido.");
  return `${origin.replace(/\/+$/, "")}/invito/${normalized}`;
}

const SAFE_NAME = new RegExp(`^[A-Za-z][A-Za-z0-9_-]{${NICKNAME_MIN - 1},${NICKNAME_MAX - 1}}$`);

/** Messaggio simpatico. Compare solo il soprannome, e solo se l'utente lo ha scelto di mostrare agli amici (chi chiama passa null altrimenti). */
export function whatsappInviteText(link: string, nickname: string | null | undefined): string {
  const who = nickname && SAFE_NAME.test(nickname) ? `Sono ${nickname} su CyberDojo` : "Studio su CyberDojo";
  return `Ciao! ${who}: si impara la sicurezza informatica a piccoli passi, come in un dojo. Vieni a studiare con me, è gratis. Accetta il mio invito qui: ${link}`;
}

/** Indirizzo wa.me con il testo codificato. */
export function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
