import { describe, expect, it } from "vitest";
import {
  applyPatch,
  emailReviewInput,
  exportNotes,
  gfxReviewInput,
  isReadyToPublish,
  lessonReviewInput,
  mergeReviewIntoData,
  nextStep,
  parseReviews,
  summarize,
  uxReviewInput,
  type LessonRow,
} from "./reviews";

const row = (over: Partial<LessonRow> = {}): LessonRow => ({
  id: "F.01.001", title: "Prova", module: 1, course: "fondamenta",
  approved: false, hasVideo: true, videoReviewed: false, isAttack: false, humanReviewed: false, ...over,
});

describe("mergeReviewIntoData", () => {
  const data = { id: "C.08.001", approved: false, human_reviewed: false, video: { id: "x", reviewed: false } };
  it("non cambia nulla senza revisione", () => expect(mergeReviewIntoData(data, undefined)).toBe(data));
  it("fonde approved, human_reviewed e video.reviewed senza toccare l'originale", () => {
    const out = mergeReviewIntoData(data, { approved: true, humanReviewed: true, videoReviewed: true });
    expect(out).toMatchObject({ approved: true, human_reviewed: true, video: { id: "x", reviewed: true } });
    expect(data.approved).toBe(false);
  });
  it("la revisione ha la precedenza anche quando è false", () => {
    expect(mergeReviewIntoData({ approved: true }, { approved: false })).toMatchObject({ approved: false });
  });
  it("ignora videoReviewed se la lezione non ha video", () => {
    expect(mergeReviewIntoData({ id: "a" }, { videoReviewed: true })).not.toHaveProperty("video");
  });
});

describe("applyPatch", () => {
  const now = new Date("2026-10-20T10:00:00Z");
  it("unisce i campi e scrive la data", () => {
    const e = applyPatch({ approved: true }, { note: "ok" }, now);
    expect(e).toEqual({ approved: true, note: "ok", data: now.toISOString() });
  });
  it("una nota vuota la cancella; null toglie il voto", () => {
    expect(applyPatch({ note: "x", verdict: "like" }, { note: "  ", verdict: null }, now)).toEqual({ data: now.toISOString() });
  });
  it("unisce i voti UX", () => {
    expect(applyPatch({ ratings: { clarity: 3 } }, { ratings: { speed: 5 } }, now).ratings).toEqual({ clarity: 3, speed: 5 });
  });
});

describe("parseReviews", () => {
  it("scarta voci non valide e file strani", () => {
    expect(parseReviews(null)).toEqual({});
    expect(parseReviews([])).toEqual({});
    expect(parseReviews({ a: { approved: true }, b: { approved: "si" }, c: { note: "x".repeat(2001) } })).toEqual({ a: { approved: true } });
  });
});

describe("validazione input", () => {
  it("lezione: id e note", () => {
    expect(lessonReviewInput.safeParse({ id: "C.08.001", approved: true }).success).toBe(true);
    expect(lessonReviewInput.safeParse({ id: "../etc" }).success).toBe(false);
    expect(lessonReviewInput.safeParse({ id: "C.08.001", note: "x".repeat(2000) }).success).toBe(true);
    expect(lessonReviewInput.safeParse({ id: "C.08.001", note: "x".repeat(2001) }).success).toBe(false);
    expect(lessonReviewInput.safeParse({ id: "C.08.001", extra: 1 }).success).toBe(false);
  });
  it("email: solo id conosciuti", () => {
    expect(emailReviewInput.safeParse({ id: "welcome", seen: true }).success).toBe(true);
    expect(emailReviewInput.safeParse({ id: "boh" }).success).toBe(false);
  });
  it("ux: percorso noto, voti da 1 a 5", () => {
    expect(uxReviewInput.safeParse({ path: "/corsi", verdict: "like", ratings: { clarity: 5 } }).success).toBe(true);
    expect(uxReviewInput.safeParse({ path: "/nope" }).success).toBe(false);
    expect(uxReviewInput.safeParse({ path: "/corsi", ratings: { clarity: 6 } }).success).toBe(false);
    expect(uxReviewInput.safeParse({ path: "/corsi", ratings: { sconosciuto: 3 } }).success).toBe(false);
  });
});

describe("pronta per la pubblicazione", () => {
  const ok = { approved: true, hasVideo: true, videoReviewed: true, isAttack: false, humanReviewed: false };
  it("serve approvazione e video guardato", () => {
    expect(isReadyToPublish(ok)).toBe(true);
    expect(isReadyToPublish({ ...ok, approved: false })).toBe(false);
    expect(isReadyToPublish({ ...ok, videoReviewed: false })).toBe(false);
    expect(isReadyToPublish({ ...ok, hasVideo: false })).toBe(false);
  });
  it("per C8 serve anche la rilettura umana", () => {
    expect(isReadyToPublish({ ...ok, isAttack: true })).toBe(false);
    expect(isReadyToPublish({ ...ok, isAttack: true, humanReviewed: true })).toBe(true);
  });
});

describe("riepilogo e prossimo passo", () => {
  it("conta e calcola la percentuale", () => {
    const rows = [row({ approved: true, videoReviewed: true }), row({ id: "F.01.002", hasVideo: false }), row({ id: "C.08.001", isAttack: true })];
    const s = summarize(rows, { "email:welcome": { approved: true }, "ux:/corsi": { verdict: "like" } });
    expect(s).toMatchObject({ lessons: 3, approved: 1, videoReviewed: 1, videoToWatch: 1, noVideo: 1, attackToReview: 1, emailsSeen: 1, uxSeen: 1, uxApproved: 1 });
    expect(s.percent).toBeGreaterThan(0);
    expect(s.percent).toBeLessThan(100);
  });
  it("prima la lezione da approvare", () => {
    expect(nextStep([row({ id: "F.01.002" }), row()], {}).href).toBe("/revisione/lezioni/F.01.001");
  });
  it("poi video, C8, email, schermate", () => {
    expect(nextStep([row({ approved: true })], {}).href).toContain("#video");
    expect(nextStep([row({ approved: true, videoReviewed: true, isAttack: true })], {}).text).toContain("attacco etico");
    expect(nextStep([row({ approved: true, videoReviewed: true })], {}).href).toBe("/revisione/email");
  });
});

describe("exportNotes", () => {
  it("raccoglie le note di lezioni, email e UX", () => {
    const t = exportNotes([row({ title: "Il pacchetto" })], {
      "F.01.001": { note: "Troppo lunga\nla schermata 3" },
      "email:welcome": { approved: true, note: "Bella" },
      "ux:/corsi": { verdict: "change", ratings: { mobile: 2 }, note: "Titoli piccoli" },
    });
    expect(t).toContain("F.01.001 Il pacchetto: Troppo lunga / la schermata 3");
    expect(t).toContain("Bella");
    expect(t).toContain("[da cambiare]");
    expect(t).toContain("Facilità sul telefono 2/5");
    expect(t).toContain("Titoli piccoli");
  });
  it("senza note lo dice", () => expect(exportNotes([], {})).toMatch(/Nessuna nota/));
});

describe("sicurezza delle chiavi", () => {
  it("accetta gli id grafici del catalogo e rifiuta caratteri strani", () => {
    expect(gfxReviewInput.safeParse({ id: "colore:primary-fg" }).success).toBe(true);
    expect(gfxReviewInput.safeParse({ id: "immagine:/img/home.jpg" }).success).toBe(true);
    expect(gfxReviewInput.safeParse({ id: "x\n<script>" }).success).toBe(false);
  });
  it("parseReviews ignora __proto__ nel file", () => {
    const out = parseReviews(JSON.parse('{"__proto__":{"approved":true},"F.01.001":{"approved":true}}'));
    expect(Object.getPrototypeOf(out)).toBe(Object.prototype);
    expect(Object.keys(out)).toEqual(["F.01.001"]);
  });
});
