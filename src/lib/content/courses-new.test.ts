import { describe, expect, it } from "vitest";
import { PIANO } from "../../../scripts/piano-corsi/indice";
import { titoliLezioni, validaPiano } from "../../../scripts/piano-corsi/valida";
import { COURSE_COVER } from "./covers";
import { COURSES, getCourseByFolder, getCourseById } from "./courses";
import { NEW_COURSES } from "./courses-new";
import { LESSON_ID } from "./schema";

describe("i 10 nuovi corsi", () => {
  it("il piano ha la forma giusta: 5 blocchi x 4 moduli x 10 lezioni, senza titoli ripetuti", () => {
    expect(validaPiano(PIANO)).toEqual([]);
  });

  it("sono 10 corsi da 200 lezioni, con lettere e cartelle diverse da quelle storiche", () => {
    expect(NEW_COURSES).toHaveLength(10);
    for (const c of PIANO) {
      expect(c.blocchi.flatMap((b) => b.moduli.flatMap((m) => titoliLezioni(m.lezioni)))).toHaveLength(200);
    }
    const ids = COURSES.map((c) => c.id);
    const folders = COURSES.map((c) => c.folder);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(folders).size).toBe(folders.length);
    expect(ids.slice(0, 5)).toEqual(["F", "C", "D", "T", "H"]);
  });

  it("il catalogo coincide con il piano e ogni corso ha una copertina", () => {
    for (const c of PIANO) {
      const def = getCourseById(c.id)!;
      expect(def.folder).toBe(c.cartella);
      expect(def.modules.map((m) => m.n)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
      expect(def.blocks).toHaveLength(5);
      expect(def.blocks!.map((b) => [b.from, b.to])).toEqual([[1, 4], [5, 8], [9, 12], [13, 16], [17, 20]]);
      expect(def.blurb?.lead.length).toBeGreaterThan(40);
      expect(getCourseByFolder(c.cartella)?.id).toBe(c.id);
      expect(COURSE_COVER[def.id]).toMatch(/^\/img\/corsi\/.+\.(svg|png)$/);
    }
  });

  it("gli ID delle lezioni dei nuovi corsi sono accettati dallo schema", () => {
    for (const c of PIANO) {
      expect(LESSON_ID.test(`${c.id}.01.001`)).toBe(true);
      expect(LESSON_ID.test(`${c.id}.20.010`)).toBe(true);
    }
  });
});
