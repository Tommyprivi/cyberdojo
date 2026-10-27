import { describe, expect, it } from "vitest";
import { courseCompletion, highestBelt, isValidCode, makeCode, publicHolderName, type CourseLesson } from "./certificate-core";

const L = (id: string, course: string, belt = "bianca"): CourseLesson => ({ id, course, belt });
const lessons = [L("F.01.001", "fondamenta"), L("F.01.002", "fondamenta", "gialla"), L("C.01.001", "cybersecurity")];

describe("courseCompletion", () => {
  it("non è completo se manca anche una sola lezione", () => {
    expect(courseCompletion(lessons, new Set(["F.01.001"]), "fondamenta")).toEqual({ done: 1, total: 2, complete: false });
  });
  it("è completo con tutte le lezioni del corso, e solo quelle del corso contano", () => {
    expect(courseCompletion(lessons, new Set(["F.01.001", "F.01.002"]), "fondamenta")).toEqual({ done: 2, total: 2, complete: true });
  });
  it("un corso senza lezioni non è mai completo", () => {
    expect(courseCompletion(lessons, new Set(["C.01.001"]), "trading")).toEqual({ done: 0, total: 0, complete: false });
  });
  it("ignora lezioni completate che non fanno parte del corso", () => {
    expect(courseCompletion(lessons, new Set(["C.01.001"]), "fondamenta").done).toBe(0);
  });
});

describe("highestBelt", () => {
  it("restituisce la cintura più alta tra le lezioni", () => {
    expect(highestBelt([L("a", "x", "bianca"), L("b", "x", "verde"), L("c", "x", "gialla")])).toBe("verde");
  });
  it("senza lezioni usa la cintura bianca", () => {
    expect(highestBelt([])).toBe("bianca");
  });
});

describe("codice pubblico", () => {
  it("ha un formato fisso e usa solo caratteri non ambigui", () => {
    const code = makeCode(Uint8Array.from({ length: 12 }, (_, i) => i * 21));
    expect(code).toMatch(/^CD-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/);
    expect(code).not.toMatch(/[01OIL]/);
    expect(isValidCode(code)).toBe(true);
  });
  it("byte diversi danno codici diversi", () => {
    const a = makeCode(Uint8Array.from({ length: 12 }, (_, i) => i));
    const b = makeCode(Uint8Array.from({ length: 12 }, (_, i) => i + 1));
    expect(a).not.toBe(b);
  });
  it("rifiuta codici malformati o con iniezioni", () => {
    expect(isValidCode("CD-AAAA-BBBB")).toBe(false);
    expect(isValidCode("cd-aaaa-bbbb-cccc")).toBe(false);
    expect(isValidCode("CD-AAAA-BBBB-CCC' OR 1=1")).toBe(false);
    expect(isValidCode("")).toBe(false);
  });
});

describe("publicHolderName", () => {
  it("mostra il nome e l'iniziale del cognome (privacy)", () => {
    expect(publicHolderName("Mario Rossi")).toBe("Mario R.");
    expect(publicHolderName("  Anna Maria De Luca ")).toBe("Anna L.");
    expect(publicHolderName("Luca")).toBe("Luca");
    expect(publicHolderName("")).toBe("Studente");
  });
});
