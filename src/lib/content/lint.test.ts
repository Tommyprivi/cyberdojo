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

  const VIDEO = { provider: "youtube", id: "abcdefghijk", start: 10, end: 190, channel: "Canale di prova", reviewed: true };

  it("pubblica anche un video non ancora guardato dal titolare (decisione del 2026-10-20)", () => {
    const v = { ...VIDEO, reviewed: false };
    expect(
      messages([lesson({ status: "published", approved: true, video: v }, body().replace("<Say", "<Video />\n<Say"))]).some((m) =>
        m.includes("video.reviewed"),
      ),
    ).toBe(false);
  });
  const withVideo = (b = body()) => b.replace("<Say", "<Video />\n<Say");

  it("richiede approvazione e video per pubblicare", () => {
    expect(messages([lesson({ status: "published" })]).some((m) => m.includes("approved: true"))).toBe(true);
    expect(messages([lesson({ status: "published", approved: true })])).toContain("una lezione pubblicata deve avere un video");
    expect(lintLessons([lesson({ status: "published", approved: true, video: VIDEO }, withVideo())])).toEqual([]);
  });

  it("controlla che video nel frontmatter e <Video /> nel corpo coincidano", () => {
    expect(messages([lesson({ video: VIDEO })]).some((m) => m.includes("<Video /> manca"))).toBe(true);
    expect(messages([lesson({}, withVideo())]).some((m) => m.includes("manca video"))).toBe(true);
  });

  it("rifiuta spezzoni troppo lunghi o senza canale", () => {
    expect(messages([lesson({ video: { ...VIDEO, end: 900 } }, withVideo())]).some((m) => m.includes("supera"))).toBe(true);
    expect(lintLessons([lesson({ video: { ...VIDEO, channel: "" } }, withVideo())]).length).toBeGreaterThan(0);
  });

  it("richiede revisione umana per i moduli di attacco C8", () => {
    const c8 = (over: Record<string, unknown>) =>
      lesson(
        { id: "C.08.001", course: "cybersecurity", module: 8, status: "published", approved: true, video: VIDEO, ...over },
        withVideo(),
        "cybersecurity/c8/C.08.001.mdx",
      );
    // Dal 2026-10-20 la revisione umana di C8 non è più obbligatoria (DECISIONS.md).
    expect(messages([c8({})]).some((m) => m.includes("human_reviewed"))).toBe(false);
    expect(lintLessons([c8({ human_reviewed: true })])).toEqual([]);
  });

  it("rifiuta campi sconosciuti e voci non valide", () => {
    expect(lintLessons([lesson({ extra: 1 })]).length).toBeGreaterThan(0);
    expect(messages([lesson({}, body().replace('who="sensei"', 'who="boh"'))]).some((m) => m.includes("non valido"))).toBe(true);
  });
});
