/**
 * Regole pure del ruolo docente (nessun database): permessi, scelta del ruolo nello script, formattazione.
 * Il ruolo docente lo dà SOLO il proprietario del database (scripts/aggiungi-staff.mts --ruolo docente).
 */

export type AssignableRole = "staff" | "docente";

/** Legge `--ruolo staff|docente` dagli argomenti dello script. Senza opzione: staff (comportamento di sempre). */
export function parseRoleArg(argv: readonly string[]): { ok: true; role: AssignableRole } | { ok: false; error: string } {
  let value: string | undefined;
  let found = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--ruolo") {
      found = true;
      value = argv[i + 1];
    } else if (a.startsWith("--ruolo=")) {
      found = true;
      value = a.slice("--ruolo=".length);
    }
  }
  if (!found) return { ok: true, role: "staff" };
  if (value === "staff" || value === "docente") return { ok: true, role: value };
  return { ok: false, error: "Il ruolo deve essere «staff» oppure «docente»." };
}

/** Un docente (o l'admin) vede i progressi solo della classe che ha creato lui. */
export function canSeeClass(input: { role: string | null | undefined; isOwner: boolean }): boolean {
  return input.isOwner && (input.role === "docente" || input.role === "admin");
}

/** Chi può scrivere gli annunci: staff e admin. Il docente NO. */
export function isAnnouncementStaffRole(role: string | null | undefined): boolean {
  return role === "staff" || role === "admin";
}

/** «oggi», «ieri», «3 giorni fa» o la data (g/m/aaaa). Date non valide: «mai». */
export function formatLastDay(day: string | null | undefined, now: Date = new Date()): string {
  if (!day || !/^\d{4}-\d{2}-\d{2}/.test(day)) return "mai";
  const [y, m, d] = day.slice(0, 10).split("-").map(Number);
  const then = Date.UTC(y, m - 1, d);
  if (Number.isNaN(then)) return "mai";
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const diff = Math.round((today - then) / 86_400_000);
  if (diff <= 0) return "oggi";
  if (diff === 1) return "ieri";
  if (diff < 14) return `${diff} giorni fa`;
  return `${d}/${m}/${y}`;
}

export type ProgressRow = { no: number; nickname: string; lessons: number; xp: number; lastDay: string | null };

const count = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v > 0 ? Math.floor(v) : 0);

/** Dalla riga SQL ai soli campi permessi al docente: mai email, risposte o testi. */
export function toProgressRow(raw: Record<string, unknown>): ProgressRow {
  return {
    no: count(raw.member_no),
    nickname: String(raw.nickname ?? ""),
    lessons: count(raw.lessons),
    xp: count(raw.xp),
    lastDay: typeof raw.last_day === "string" ? raw.last_day : null,
  };
}

/** Testo del consenso, uguale ovunque venga mostrato. */
export const SHARE_PROGRESS_EXPLAIN =
  "Se lo accendi, il docente che ha creato questa classe vede: il tuo soprannome, quante lezioni hai completato, i tuoi XP e l'ultimo giorno in cui sei stato attivo. Non vede mai email, risposte o testi. Puoi spegnerlo quando vuoi.";
