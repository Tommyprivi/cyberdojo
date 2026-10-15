/**
 * Motore del tutor del laboratorio. Funzioni pure: non sanno nulla di React, del browser o del database.
 * Una missione (Scenario) è una lista di passi; ogni passo dice cosa fare sullo strumento, a cosa serve,
 * che aiuto dare e cosa ricordare. Il motore decide solo quando un passo è fatto.
 */
import { parseIpv4 } from "../netcalc";

export type Mode = "guidato" | "aiutami" | "solo";

export const MODES: { id: Mode; label: string; help: string }[] = [
  { id: "guidato", label: "Guidato", help: "Un passo alla volta. Il successivo si apre solo se hai fatto quello giusto." },
  { id: "aiutami", label: "Aiutami", help: "Lavori liberamente. Premi «Aiutami» quando sei in difficoltà." },
  { id: "solo", label: "Da solo", help: "Nessun aiuto. Alla fine consegni un rapporto." },
];

/** Stato del calcolatore di rete, come lo vede il tutor. */
export type CalcState = { ip: string; prefix: number };

export type Question =
  | { type: "choice"; prompt: string; options: string[]; correct: string; whyWrong: string }
  | { type: "number"; prompt: string; correct: number; whyWrong: string };

export type Step = {
  id: string;
  title: string;
  /** Cosa fare sullo strumento. */
  instruction: string;
  /** A cosa serve: il «perché» che il tutor deve sempre spiegare. */
  why: string;
  /** Aiuto concreto (modalità Aiutami, o dopo due errori in Guidato). */
  hint: string;
  /** Il punto da portare a casa: finisce nel taccuino. */
  remember: string;
  /** Azione richiesta sullo strumento. Se manca, il passo è solo una domanda. */
  action?: (s: CalcState) => boolean;
  /** Se l'azione non è ancora giusta, un suggerimento mirato (o null). */
  nudge?: (s: CalcState) => string | null;
  /** Domanda di controllo: si apre quando l'azione è fatta. */
  question?: Question;
};

export type ReportItem = Question & { id: string };

export type Scenario = {
  id: string;
  title: string;
  tool: "calcolatore";
  intro: string;
  /** La missione in una frase, per la modalità «Da solo». */
  goal: string;
  steps: Step[];
  /** Rapporto finale della modalità «Da solo». */
  report: ReportItem[];
  closing: string;
};

/** I numeri si accettano con o senza separatori: «16777214», «16.777.214», «16 777 214». */
function normalizeNumber(raw: string): string {
  return raw.trim().replace(/[.\s'’]/g, "");
}

export function checkAnswer(q: Question, given: string | undefined): boolean {
  if (given === undefined || given === "") return false;
  if (q.type === "choice") return given === q.correct;
  const n = normalizeNumber(given);
  return /^\d{1,12}$/.test(n) && Number(n) === q.correct;
}

export type StepProgress = {
  /** L'utente ha fatto ciò che il passo chiedeva sullo strumento. */
  actionDone: boolean;
  /** Tocca alla domanda di controllo. */
  askNow: boolean;
  answered: boolean;
  /** Passo completato. */
  done: boolean;
  /** Suggerimento mirato se l'azione non è ancora giusta. */
  nudge: string | null;
};

export function stepProgress(step: Step, state: CalcState, answer: string | undefined): StepProgress {
  const actionDone = step.action ? step.action(state) : true;
  const answered = step.question ? checkAnswer(step.question, answer) : true;
  return {
    actionDone,
    askNow: actionDone && !!step.question && !answered,
    answered,
    done: actionDone && answered,
    nudge: !actionDone && step.nudge ? step.nudge(state) : null,
  };
}

export function scoreReport(s: Scenario, answers: Record<string, string>) {
  const correct = s.report.filter((r) => checkAnswer(r, answers[r.id])).length;
  return { correct, total: s.report.length, passed: correct === s.report.length };
}

/** Suggerimento comune ai passi che chiedono un certo indirizzo. */
export function ipNudge(target: string) {
  return (s: CalcState): string | null => {
    const typed = s.ip.trim();
    if (!typed) return null;
    const parsed = parseIpv4(typed);
    if (!parsed) return "Non è ancora un indirizzo valido: servono quattro numeri da 0 a 255 separati da punti.";
    return parsed.join(".") === target ? null : `Quasi: l'indirizzo da inserire è ${target}.`;
  };
}

export const ipIs = (target: string) => (s: CalcState) => parseIpv4(s.ip)?.join(".") === target;
