/**
 * Validazione del soprannome pubblico. È l'UNICO testo libero che altri utenti possono vedere,
 * quindi è stretto: poche lettere, niente spazi né simboli, parole vietate (lista di base in
 * italiano e inglese, con trucchi tipo «c4zz0»), mai email o nome reale.
 * La lista è una base: va ampliata guardando le segnalazioni (vedi docs/social.md).
 */

export const NICKNAME_MIN = 3;
export const NICKNAME_MAX = 16;

const LEET: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", $: "s", "!": "i" };

/** Forma «piatta» per i confronti: minuscole, senza accenti, trucchi sostituiti, lettere ripetute unite. */
export function fold(input: string): string {
  const s = input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[013457@$!]/g, (c) => LEET[c] ?? "")
    .replace(/[^a-z]/g, "");
  return s.replace(/(.)\1+/g, "$1");
}

/** Chiave di unicità: «Ninja_01», «ninja-01» e «NINJA01» sono lo stesso soprannome. */
export function nicknameKey(nick: string): string {
  return nick.toLowerCase().replace(/[_-]/g, "");
}

/** Parole che bastano da sole (anche dentro un'altra parola): abbastanza lunghe da non dare falsi positivi. */
const CONTAINS = [
  // italiano
  "cazzo", "minchia", "merda", "stronz", "puttana", "troia", "vaffanc", "fanculo", "frocio", "finocchio", "ricchione", "coglion",
  "bastard", "pompin", "sborra", "scopare", "mignotta", "zoccola", "negrone", "mongoloid", "handicappat", "spastico",
  "pedofil", "stupro", "stupra", "violentat", "ammazzat", "uccidi", "suicid", "terrorist", "jihad", "hitler", "mussolini",
  "bestemm", "porco", "porca",
  // inglese
  "fuck", "shit", "bitch", "cunt", "pussy", "whore", "slut", "nigger", "nigga", "faggot", "retard", "porn", "penis", "vagina",
  "asshole", "bastard", "molest", "paedo", "rapist", "kidnap", "genocide", "suicide", "terror", "masturb", "blowjob", "jerkoff",
  "dildo", "hentai", "cumshot", "tits", "boobs",
];

/** Parole che vietano solo se sono un pezzo a sé (altrimenti «significa» o «torpedo» sarebbero vietati). */
const EXACT = [
  "culo", "figa", "fica", "sesso", "sex", "sexy", "nude", "nudo", "nuda", "anal", "cum", "dick", "cock", "kill", "pedo",
  "nazi", "isis", "kkk", "rape", "negro", "droga", "cocaina",
  "eroina", "fascio", "fascista", "duce", "morte", "morto", "kys", "ucciditi", "zoccola", "bocchino", "pene", "tette",
  "sega", "segone", "gnocca", "troie",
];

/** Nomi che sembrano ufficiali: servono a non far credere che un utente sia del dojo. */
const RESERVED = ["admin", "administrator", "moderatore", "moderator", "staff", "support", "supporto", "cyberdojo", "sensei", "onigiri", "root", "system", "sistema", "ufficiale", "official", "owner", "titolare"];

const containsFolded = [...new Set(CONTAINS.map(fold))];
const exactFolded = new Set(EXACT.map(fold));
const reservedFolded = RESERVED.map(fold);

export function hasBannedWord(nick: string): boolean {
  const whole = fold(nick);
  if (containsFolded.some((w) => w.length >= 4 && whole.includes(w))) return true;
  if (exactFolded.has(whole)) return true;
  // pezzi separati da _ o -, anche senza le cifre finali (nazi123, xX_nazi_Xx)
  const tokens = nick.split(/[_-]+/).flatMap((t) => [t, t.replace(/\d+$/, "")]);
  return tokens.some((t) => {
    const f = fold(t);
    return f.length > 0 && exactFolded.has(f);
  });
}

export function isReserved(nick: string): boolean {
  const whole = fold(nick);
  return reservedFolded.some((r) => whole === r || whole.startsWith(r));
}

export type NicknameContext = { name?: string | null; email: string };

/** Il soprannome non deve rivelare chi sei: né l'email, né il tuo nome. */
export function revealsIdentity(nick: string, ctx: NicknameContext): boolean {
  const f = fold(nick);
  const local = fold(ctx.email.split("@")[0] ?? "");
  if (local.length >= 3 && f.includes(local)) return true;
  const nameFolded = fold(ctx.name ?? "");
  if (nameFolded.length >= 3 && f.includes(nameFolded)) return true;
  const parts = (ctx.name ?? "").split(/[\s._-]+/).map(fold).filter((p) => p.length >= 3);
  return parts.some((p) => f.includes(p));
}

export type NicknameResult = { ok: true; nickname: string; key: string } | { ok: false; error: string };

export function validateNickname(raw: string, ctx: NicknameContext): NicknameResult {
  const nick = raw.normalize("NFKC").trim();
  if (nick.length < NICKNAME_MIN || nick.length > NICKNAME_MAX) {
    return { ok: false, error: `Il soprannome deve avere da ${NICKNAME_MIN} a ${NICKNAME_MAX} caratteri.` };
  }
  if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(nick)) {
    return { ok: false, error: "Usa solo lettere, numeri, trattino e trattino basso, e inizia con una lettera. Niente spazi né accenti." };
  }
  if (/\d{4,}/.test(nick)) {
    return { ok: false, error: "Non mettere lunghe serie di numeri: potrebbero sembrare un telefono o una data." };
  }
  if (revealsIdentity(nick, ctx)) {
    return { ok: false, error: "Il soprannome non deve contenere il tuo nome o la tua email: scegline uno di fantasia." };
  }
  if (isReserved(nick)) return { ok: false, error: "Questo soprannome è riservato: scegline un altro." };
  if (hasBannedWord(nick)) return { ok: false, error: "Questo soprannome non è permesso: scegline un altro." };
  return { ok: true, nickname: nick, key: nicknameKey(nick) };
}

/** True se è passato abbastanza tempo dall'ultimo cambio (il primo cambio è sempre libero). */
export function canChangeNickname(lastChange: Date | null, now: Date, cooldownDays: number): boolean {
  if (!lastChange) return true;
  return now.getTime() - lastChange.getTime() >= cooldownDays * 86_400_000;
}

export function nextChangeAt(lastChange: Date, cooldownDays: number): Date {
  return new Date(lastChange.getTime() + cooldownDays * 86_400_000);
}
