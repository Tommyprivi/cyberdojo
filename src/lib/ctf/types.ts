import type { Level } from "./core";

export type Category = "crittografia" | "log" | "web" | "password" | "reti" | "osint";
export const CATEGORY_LABEL: Record<Category, string> = {
  crittografia: "Crittografia",
  log: "Log e forensics",
  web: "Web simulato",
  password: "Password e hash",
  reti: "Reti",
  osint: "OSINT",
};
export const CATEGORIES = Object.keys(CATEGORY_LABEL) as Category[];

/** Materiale mostrato al giocatore. Mai contiene la bandiera in chiaro. */
export type Artifact =
  | { kind: "text"; title: string; body: string }
  | { kind: "log"; title: string; lines: string[] }
  | { kind: "hex"; title: string; hex: string }
  | { kind: "table"; title: string; columns: string[]; rows: string[][] }
  | { kind: "posts"; title: string; items: { who: string; when: string; text: string }[] }
  | { kind: "sqlform"; title: string; variant: "login" | "search"; schema: string };

/** Righe del database finto (solo sul server). Il campo `note` contiene la bandiera. */
export type SqlRow = Record<string, string | number>;

export type Built = { flag: string; artifact: Artifact; sql?: { rows: SqlRow[] } };

export type Challenge = {
  id: string;
  title: string;
  category: Category;
  level: Level;
  /** Il caso, in due righe (tutto inventato). */
  story: string;
  /** Cosa devi trovare e in che forma scrivere la bandiera. */
  goal: string;
  hints: readonly [string, string, string];
  explanation: string;
  defense: string;
  /** Genera i dati della sfida da un generatore casuale con seme (solo server). */
  build: (r: () => number) => Built;
};

/** Ciò che arriva al browser. */
export type PublicChallenge = Pick<Challenge, "id" | "title" | "category" | "level" | "story" | "goal" | "hints"> & { artifact: Artifact };
