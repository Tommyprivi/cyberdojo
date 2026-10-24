/**
 * Funzioni pure per la verifica in due passaggi: nessun accesso a rete o database,
 * così si possono provare con i test e usare sia nel browser sia sul server.
 */

/** Il codice dell'app ha sempre 6 cifre. Spazi e trattini (es. «123 456») si ignorano. */
export function normalizeTotpCode(input: string): string {
  return input.replace(/[\s-]/g, "");
}

export function isValidTotpCode(input: string): boolean {
  return /^\d{6}$/.test(normalizeTotpCode(input));
}

/**
 * I codici di recupero di Better Auth hanno la forma `xxxxx-xxxxx` (lettere e numeri, maiuscole e
 * minuscole contano). Si tolgono gli spazi e, se manca, si rimette il trattino.
 */
export function normalizeBackupCode(input: string): string {
  const compact = input.replace(/\s+/g, "");
  if (/^[A-Za-z0-9]{10}$/.test(compact)) return `${compact.slice(0, 5)}-${compact.slice(5)}`;
  return compact;
}

export function isValidBackupCode(input: string): boolean {
  return /^[A-Za-z0-9]{5}-[A-Za-z0-9]{5}$/.test(normalizeBackupCode(input));
}

/** Per il campo unico di disattivazione: 6 cifre = codice dell'app, altrimenti codice di recupero. */
export function classifyCode(input: string): "totp" | "backup" | "invalid" {
  if (isValidTotpCode(input)) return "totp";
  if (isValidBackupCode(input)) return "backup";
  return "invalid";
}

/** Estrae la chiave segreta (base32) dall'indirizzo `otpauth://` dato da Better Auth. */
export function secretFromOtpauthUri(uri: string): string | null {
  try {
    const url = new URL(uri);
    if (url.protocol !== "otpauth:") return null;
    const secret = url.searchParams.get("secret");
    return secret && /^[A-Z2-7]+=*$/i.test(secret) ? secret.toUpperCase() : null;
  } catch {
    return null;
  }
}

/** Chiave a gruppi di 4 caratteri, più facile da ricopiare a mano. */
export function formatManualKey(secret: string): string {
  return secret.replace(/=+$/, "").replace(/(.{4})/g, "$1 ").trim();
}

/** Contenuto del file scaricabile con i codici di recupero. */
export function backupCodesFile(codes: string[], accountEmail: string, now: Date = new Date()): string {
  const day = now.toISOString().slice(0, 10);
  return [
    "CyberDojo - codici di recupero (verifica in due passaggi)",
    `Account: ${accountEmail}`,
    `Creati il: ${day}`,
    "",
    "Ogni codice vale una sola volta. Conservali in un posto sicuro, lontano dal telefono.",
    "Se ne generi di nuovi, questi smettono di funzionare.",
    "",
    ...codes.map((c, i) => `${String(i + 1).padStart(2, " ")}. ${c}`),
    "",
  ].join("\n");
}
