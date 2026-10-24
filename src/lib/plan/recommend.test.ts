import { describe, expect, it } from "vitest";
import { buildPlan, studyTips, type PlanLesson } from "./recommend";

const lesson = (id: string, course: string, module: number, minutes = 8): PlanLesson => ({ id, course, module, minutes });
const LESSONS: PlanLesson[] = [
  lesson("F.01.001", "fondamenta", 1),
  lesson("F.01.002", "fondamenta", 1),
  lesson("F.02.001", "fondamenta", 2),
  lesson("C.01.001", "cybersecurity", 1),
  lesson("C.01.002", "cybersecurity", 1),
  lesson("C.08.001", "cybersecurity", 8),
];

describe("buildPlan", () => {
  it("per chi vuole fare il pentester parte dai fondamenti e arriva all'attacco etico", () => {
    const plan = buildPlan({ goal: "pentester", dailyMinutes: 20 }, LESSONS, new Set());
    expect(plan.stages[0].course).toBe("F");
    expect(plan.stages.some((s) => s.course === "C" && s.modules.includes(8))).toBe(true);
  });

  it("per chi vuole proteggere se stesso non parte dai fondamenti completi", () => {
    const plan = buildPlan({ goal: "sicurezza-personale", dailyMinutes: 20 }, LESSONS, new Set());
    expect(plan.stages[0].course).toBe("C");
  });

  it("conta le lezioni fatte e stima i giorni dai minuti al giorno", () => {
    const plan = buildPlan({ goal: "curiosita", dailyMinutes: 10 }, LESSONS, new Set(["C.01.001"]));
    const first = plan.stages[0];
    expect(first.total).toBe(2);
    expect(first.done).toBe(1);
    expect(first.minutesLeft).toBe(8);
    expect(first.daysLeft).toBe(1);
  });

  it("salta le tappe senza lezioni e indica la prima non finita come prossima", () => {
    const plan = buildPlan({ goal: "curiosita", dailyMinutes: 30 }, LESSONS, new Set(["C.01.001", "C.01.002"]));
    expect(plan.stages.every((s) => s.total > 0)).toBe(true);
    expect(plan.next).toBe(plan.stages.findIndex((s) => s.done < s.total));
  });

  it("senza obiettivo noto usa il percorso generale", () => {
    const plan = buildPlan({ goal: null, dailyMinutes: null }, LESSONS, new Set());
    expect(plan.stages.length).toBeGreaterThan(0);
    expect(plan.minutesPerDay).toBe(20);
  });

  it("totali: giorni e settimane per finire il piano", () => {
    const plan = buildPlan({ goal: "scuola", dailyMinutes: 10 }, LESSONS, new Set());
    expect(plan.totalDaysLeft).toBe(Math.ceil(plan.totalMinutesLeft / 10));
    expect(plan.totalWeeksLeft).toBe(Math.ceil(plan.totalDaysLeft / 7));
  });
});

describe("studyTips", () => {
  it("dà sempre i consigli generali e quelli per i minuti scelti", () => {
    const tips = studyTips({ goal: "curiosita", dailyMinutes: 10, ageBand: "26-40" });
    expect(tips.length).toBeGreaterThanOrEqual(5);
    expect(tips.some((t) => /10 minuti/.test(`${t.title} ${t.text}`))).toBe(true);
  });

  it("ai minorenni ricorda di fare il laboratorio solo sul proprio computer", () => {
    const tips = studyTips({ goal: "pentester", dailyMinutes: 30, ageBand: "14-17" });
    expect(tips.some((t) => /adulto|genitor/i.test(t.text))).toBe(true);
    const adult = studyTips({ goal: "pentester", dailyMinutes: 30, ageBand: "26-40" });
    expect(adult.some((t) => /adulto|genitor/i.test(t.text))).toBe(false);
  });

  it("per i corsi di finanza non c'è niente: i consigli restano sulla cybersecurity", () => {
    const tips = studyTips({ goal: "lavoro-soc", dailyMinutes: 60, ageBand: "18-25" });
    expect(tips.every((t) => t.title.length > 0 && t.text.length > 0)).toBe(true);
  });
});
