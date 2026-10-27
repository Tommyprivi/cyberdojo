/** Appunti: solo testo semplice, con un limite di lunghezza. */

export const NOTE_MAX = 2000;

export function cleanNote(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return (
    raw
      .replace(/\r\n?/g, "\n")
      .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "")
      .trim()
      .slice(0, NOTE_MAX)
  );
}
