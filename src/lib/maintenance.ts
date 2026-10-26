/**
 * Manutenzione del sito: quando scade il conto alla rovescia (content/countdown.json) e c'è
 * "maintenance": true, le pagine mostrano /manutenzione. Restano aperti solo l'accesso e le lezioni
 * dei corsi che l'utente ha già iniziato (per non perdere la serie). Per riaprire basta mettere
 * "maintenance": false (o toglierlo) e pubblicare. Funzioni pure, senza accesso ai file né al
 * database: le usano il proxy e le pagine delle lezioni.
 */

export type MaintenanceConfig = { endsAt?: unknown; maintenance?: unknown };

export const MAINTENANCE_COOKIE = "dojo-accesso";
/** Il proxy lo aggiunge alla richiesta delle lezioni: la pagina deve controllare il corso. */
export const MAINTENANCE_HEADER = "x-dojo-manutenzione";

export function maintenanceActive(cfg: MaintenanceConfig, now: number): boolean {
  if (cfg.maintenance !== true) return false;
  const at = typeof cfg.endsAt === "string" ? Date.parse(cfg.endsAt) : NaN;
  return Number.isFinite(at) && now >= at;
}

const isPath = (pathname: string, base: string) => pathname === base || pathname.startsWith(`${base}/`);

/**
 * pass: si prosegue; page: pagina di manutenzione; api: risposta 503;
 * lessons: si prosegue, ma la pagina deve far entrare solo chi ha iniziato quel corso.
 */
export function decideMaintenance(
  pathname: string,
  cfg: MaintenanceConfig,
  now: number,
  hasAccess: boolean,
): "pass" | "page" | "api" | "lessons" {
  if (hasAccess || !maintenanceActive(cfg, now)) return "pass";
  const open = ["/manutenzione", "/accedi", "/api/auth", "/api/cron"];
  if (open.some((base) => isPath(pathname, base))) return "pass";
  if (isPath(pathname, "/lezione")) return "lessons";
  return isPath(pathname, "/api") ? "api" : "page";
}

type CatalogEntry = { id: string; course: string };

/** I corsi in cui hai completato almeno una lezione. */
export function startedCourses(completed: ReadonlySet<string>, catalog: readonly CatalogEntry[]): Set<string> {
  const out = new Set<string>();
  for (const l of catalog) if (completed.has(l.id)) out.add(l.course);
  return out;
}

/** Durante la manutenzione si può aprire solo una lezione di un corso già iniziato. */
export function allowedDuringMaintenance(lessonId: string, completed: ReadonlySet<string>, catalog: readonly CatalogEntry[]): boolean {
  const lesson = catalog.find((l) => l.id === lessonId);
  return lesson ? startedCourses(completed, catalog).has(lesson.course) : false;
}
