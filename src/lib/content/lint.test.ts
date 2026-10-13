import { describe, expect, it } from "vitest";
import { lintLessons } from "./lint";
import type { RawLesson } from "./load";

const SCREEN = '<Say who="sensei">ok</Say>';
const body = (n = 6) =>
  Array.from({ length: n }, (_, i) =>
    i === 4 ? `<Practice generator="binary-to-decimal" />${SCREEN}` : i === n - 1 ? `<Recap xp={20}>x</Recap>${SCREEN}` : SCREEN,
  ).join("\n\n{/* screen */}\n\n");

const lesson = (over: Record<string, unknown> = {}, b = body(), file = "fondamenta/f5/F.05.001.mdx"): RawLesson => ({
  file,
  body: b,
  data: {
    id: "F.05.001",
    course: "fondamenta",
    module: 5,
    title: "Titolo di prova",
    belt: "bianca",
    duration_min: 6,
    prerequisites: [],
    objectives: ["Capire qualcosa"],
    verification: { type: "generated-numeric", generator: "binary-to-decimal", pass: "5/5", retries: 3 },
    audio: true,
    status: "draft",
    ...over,
  },
});

const messages = (l: RawLesson[]) => lintLessons(l).map((i) => i.message);

describe("lintLessons", () => {
  it("accetta una lezione valida", () => {
    expect(lintLessons([lesson()])).toEqual([]);
  });

  it("segnala ID duplicati", () => {
    const a = lesson();
    const b = lesson({}, body(), "fondamenta/f5/F.05.001.mdx");
    expect(messages([a, b]).some((m) => m.includes("duplicato"))).toBe(true);
  });

  it("segnala prerequisiti inesistenti", () => {
    expect(messages([lesson({ prerequisites: ["F.05.099"] })])).toContain("prerequisito inesistente: F.05.099");
  });

  it("segnala cicli nei prerequisiti", () => {
    const a = lesson({ prerequisites: ["F.05.002"] });
    const b = lesson({ id: "F.05.002", prerequisites: ["F.05.001"] }, body(), "fondamenta/f5/F.05.002.mdx");
    expect(messages([a, b]).some((m) => m.includes("ciclo"))).toBe(true);
  });

  it("segnala ID, nome file e cartella incoerenti", () => {
    const m = messages([lesson({ id: "F.06.001" }, body(), "fondamenta/f5/F.05.001.mdx")]);
    expect(m.some((x) => x.includes("nome file"))).toBe(true);
    expect(m.some((x) => x.includes("modulo nell'ID"))).toBe(true);
  });

  it("richiede 6-8 schermate, la verifica pratica e il riepilogo", () => {
    expect(messages([lesson({}, body(3))]).some((m) => m.includes("schermate"))).toBe(true);
    expect(messages([lesson({}, body().replace("<Practice", "<Altro"))])).toContain("manca la verifica pratica (<Practice>)");
    expect(messages([lesson({}, body().replace("<Recap", "<Altro"))])).toContain("l'ultima schermata deve contenere <Recap>");
  });

  it("richiede approvazione per pubblicare", () => {
    expect(messages([lesson({ status: "published" })]).some((m) => m.includes("approved: true"))).toBe(true);
    expect(lintLessons([lesson({ status: "published", approved: true })])).toEqual([]);
  });

  it("richiede revisione umana per i moduli di attacco C8", () => {
    const c8 = (over: Record<string, unknown>) =>
      lesson(
        { id: "C.08.001", course: "cybersecurity", module: 8, status: "published", approved: true, ...over },
        body(),
        "cybersecurity/c8/C.08.001.mdx",
      );
    expect(messages([c8({})]).some((m) => m.includes("human_reviewed"))).toBe(true);
    expect(lintLessons([c8({ human_reviewed: true })])).toEqual([]);
  });

  it("rifiuta campi sconosciuti e voci non valide", () => {
    expect(lintLessons([lesson({ extra: 1 })]).length).toBeGreaterThan(0);
    expect(messages([lesson({}, body().replace('who="sensei"', 'who="boh"'))]).some((m) => m.includes("non valido"))).toBe(true);
  });
});
