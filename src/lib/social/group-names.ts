/**
 * I gruppi NON hanno un nome libero: il nome si compone scegliendo da elenchi chiusi.
 * Così nessuno può scrivere testo libero visibile ad altri (insulti, contatti, link).
 */
export const GROUP_KINDS = ["Classe", "Gruppo", "Squadra", "Dojo", "Club"] as const;
export const GROUP_THEMES = [
  "Firewall", "Phishing", "Password", "Crittografia", "Rete", "Log", "Pacchetti", "Sicurezza",
  "Bersaglio", "Fulmine", "Sensei", "Onigiri", "Cintura", "Tatami", "Katana", "Hanko",
] as const;

export type GroupKind = (typeof GROUP_KINDS)[number];
export type GroupTheme = (typeof GROUP_THEMES)[number];

export function composeGroupName(kind: string, theme: string, num: number): string | null {
  if (!(GROUP_KINDS as readonly string[]).includes(kind)) return null;
  if (!(GROUP_THEMES as readonly string[]).includes(theme)) return null;
  if (!Number.isInteger(num) || num < 1 || num > 99) return null;
  return `${kind} ${theme} ${num}`;
}

/** Un nome già composto è valido solo se si può ricostruire da tipo, tema e numero. */
export function isValidGroupName(name: string): boolean {
  const m = /^(\S+) (\S+) (\d{1,2})$/.exec(name);
  return !!m && composeGroupName(m[1], m[2], Number(m[3])) === name;
}
