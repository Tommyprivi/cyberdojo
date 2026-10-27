/**
 * Modalità app: il sito aperto dall'icona sulla schermata home (PWA) o dentro l'app Android (TWA).
 * Funzioni pure, così si provano senza browser.
 */

type MatchMedia = (query: string) => { matches: boolean };

const APP_QUERIES = ["(display-mode: standalone)", "(display-mode: fullscreen)", "(display-mode: minimal-ui)"];

/** Vero se la pagina gira come app. `navigatorStandalone` è il segnale vecchio di Safari su iPhone. */
export function isAppMode(matchMedia: MatchMedia, navigatorStandalone?: boolean): boolean {
  return navigatorStandalone === true || APP_QUERIES.some((q) => matchMedia(q).matches);
}

export type Theme = "light" | "dark" | "system";

/** Colori della barra di stato: gli stessi dello sfondo, così l'intestazione sembra parte dello schermo. */
export const THEME_COLORS = { light: "#f4f7fb", dark: "#101826" } as const;

export function themeColorFor(theme: Theme, systemPrefersDark: boolean): string {
  const dark = theme === "dark" || (theme === "system" && systemPrefersDark);
  return dark ? THEME_COLORS.dark : THEME_COLORS.light;
}
