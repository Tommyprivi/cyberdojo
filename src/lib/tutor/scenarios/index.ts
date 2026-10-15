import type { Scenario } from "../engine";
import { calcolatore66 } from "./calcolatore-66";

/** Tutte le missioni del laboratorio. Una nuova missione si aggiunge qui. */
export const SCENARIOS: Record<string, Scenario> = {
  [calcolatore66.id]: calcolatore66,
};

export const SCENARIO_IDS = Object.keys(SCENARIOS);
