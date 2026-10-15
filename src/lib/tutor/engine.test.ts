import { describe, expect, it } from "vitest";
import { classifyAddress, describeNetwork, formatIpv4, parseIpv4 } from "../netcalc";
import { checkAnswer, ipIs, ipNudge, scoreReport, stepProgress, type CalcState, type Question } from "./engine";
import { calcolatore66 } from "./scenarios/calcolatore-66";

const S = (ip: string, prefix = 24): CalcState => ({ ip, prefix });

describe("checkAnswer", () => {
  const choice: Question = { type: "choice", prompt: "?", options: ["a", "b"], correct: "a", whyWrong: "" };
  const num: Question = { type: "number", prompt: "?", correct: 16777214, whyWrong: "" };

  it("scelta: serve esattamente l'opzione giusta", () => {
    expect(checkAnswer(choice, "a")).toBe(true);
    expect(checkAnswer(choice, "b")).toBe(false);
    expect(checkAnswer(choice, "")).toBe(false);
    expect(checkAnswer(choice, undefined)).toBe(false);
  });

  it("numero: accetta i separatori e rifiuta il resto", () => {
    for (const ok of ["16777214", "16.777.214", "16 777 214", " 16777214 "]) expect(checkAnswer(num, ok), ok).toBe(true);
    for (const bad of ["16777215", "abc", "16777214x", "-16777214", "1e7", "", "0"]) expect(checkAnswer(num, bad), bad).toBe(false);
  });
});

describe("stepProgress", () => {
  const step = calcolatore66.steps[0]; // inserire 192.168.1.66 poi rispondere

  it("prima dell'azione la domanda non si apre", () => {
    const p = stepProgress(step, S(""), undefined);
    expect(p).toMatchObject({ actionDone: false, askNow: false, done: false });
  });

  it("dopo l'azione si apre la domanda; il passo finisce solo con la risposta giusta", () => {
    const right = step.question!.type === "choice" ? step.question!.correct : "";
    expect(stepProgress(step, S("192.168.1.66"), undefined)).toMatchObject({ actionDone: true, askNow: true, done: false });
    expect(stepProgress(step, S("192.168.1.66"), "11111111")).toMatchObject({ askNow: true, done: false });
    expect(stepProgress(step, S("192.168.1.66"), right)).toMatchObject({ askNow: false, done: true });
  });

  it("rispondere giusto senza aver fatto l'azione non basta", () => {
    const right = step.question!.type === "choice" ? step.question!.correct : "";
    expect(stepProgress(step, S("10.0.0.1"), right).done).toBe(false);
  });

  it("dà un suggerimento mirato mentre l'azione non è giusta", () => {
    expect(stepProgress(step, S("192.168.1"), undefined).nudge).toContain("Non è ancora un indirizzo valido");
    expect(stepProgress(step, S("192.168.1.67"), undefined).nudge).toContain("192.168.1.66");
    expect(stepProgress(step, S(""), undefined).nudge).toBeNull();
    expect(stepProgress(step, S("192.168.1.66"), undefined).nudge).toBeNull();
  });
});

describe("helper", () => {
  it("ipIs confronta l'indirizzo, non il testo", () => {
    expect(ipIs("10.0.0.1")(S(" 10.0.0.1 "))).toBe(true);
    expect(ipIs("10.0.0.1")(S("10.0.0.01"))).toBe(false);
    expect(ipNudge("10.0.0.1")(S("10.0.0.2"))).toContain("10.0.0.1");
  });
});

describe("missione calcolatore-66: coerenza con il calcolatore", () => {
  const { steps, report } = calcolatore66;

  it("ogni passo ha testo, perché, aiuto e «ricordati»", () => {
    for (const s of steps) {
      for (const k of ["title", "instruction", "why", "hint", "remember"] as const) {
        expect(s[k].trim().length, `${s.id}.${k}`).toBeGreaterThan(10);
      }
    }
    expect(new Set(steps.map((s) => s.id)).size).toBe(steps.length);
  });

  it("all'inizio nessuna azione è già fatta (non si completa da soli)", () => {
    for (const s of steps) expect(s.action?.(S("")), s.id).toBe(false);
  });

  it("le domande: la risposta giusta è tra le opzioni e le altre sono sbagliate", () => {
    for (const s of steps) {
      const q = s.question;
      if (q?.type === "choice") {
        expect(q.options.filter((o) => o === q.correct)).toHaveLength(1);
        expect(new Set(q.options).size).toBe(q.options.length);
      }
    }
  });

  it("passo 1: l'ultimo ottetto in binario è quello che mostra il calcolatore", () => {
    const q = steps[0].question!;
    expect(q.type === "choice" && q.correct).toBe(describeNetwork(parseIpv4("192.168.1.66")!, 24).bits[3]);
    expect(q.type === "choice" && q.correct).toBe("01000010");
  });

  it("passi 2 e 3: privato e pubblico come dice la classificazione", () => {
    const a = steps[1].question!, b = steps[2].question!;
    expect(classifyAddress(parseIpv4("192.168.1.66")!).scope).toBe("privato");
    expect(a.type === "choice" && a.correct).toMatch(/dentro/i);
    expect(classifyAddress(parseIpv4("172.40.12.9")!).scope).toBe("pubblico");
    expect(b.type === "choice" && b.correct).toMatch(/Internet/);
  });

  it("passo 4: 254 dispositivi, come dice il calcolatore", () => {
    const q = steps[3].question!;
    expect(q.type === "number" && q.correct).toBe(describeNetwork(parseIpv4("192.168.1.66")!, 24).hosts);
    expect(steps[3].action!(S("192.168.1.66", 24))).toBe(true);
    expect(steps[3].action!(S("192.168.1.66", 25))).toBe(false);
    expect(steps[3].nudge!(S("192.168.1.66", 16))).toContain("16");
  });

  it("passo 5: l'indirizzo non assegnabile è quello di rete", () => {
    const q = steps[4].question!;
    const n = describeNetwork(parseIpv4("192.168.1.66")!, 24);
    expect(q.type === "choice" && q.correct).toBe(formatIpv4(n.network));
    if (q.type === "choice") {
      expect(q.options).toContain(formatIpv4(n.firstHost));
      expect(q.options).toContain(formatIpv4(n.lastHost));
    }
  });

  it("rapporto finale: solo la combinazione giusta lo supera", () => {
    const ok: Record<string, string> = {};
    for (const r of report) ok[r.id] = r.type === "choice" ? r.correct : String(r.correct);
    expect(scoreReport(calcolatore66, ok)).toEqual({ correct: 3, total: 3, passed: true });
    expect(scoreReport(calcolatore66, { ...ok, r3: "256" })).toMatchObject({ correct: 2, passed: false });
    expect(scoreReport(calcolatore66, {})).toMatchObject({ correct: 0, passed: false });
  });

  it("il rapporto e i passi concordano sulle risposte", () => {
    const [r1, r2, r3] = report;
    expect(r1.type === "choice" && r1.correct).toBe(steps[1].question!.type === "choice" ? (steps[1].question as { correct: string }).correct : "");
    expect(r2.type === "choice" && r2.correct).toBe((steps[2].question as { correct: string }).correct);
    expect(r3.type === "number" && r3.correct).toBe((steps[3].question as { correct: number }).correct);
  });
});
