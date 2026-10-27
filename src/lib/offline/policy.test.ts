import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

// La politica sta in public/sw-offline.js (il service worker non può importare moduli): la provo da qui.
const policy = createRequire(import.meta.url)("../../../public/sw-offline.js");

describe("isLessonPath", () => {
  it("riconosce solo /lezione/<id> con id ben formato", () => {
    expect(policy.isLessonPath("/lezione/A.01.001")).toBe(true);
    expect(policy.isLessonPath("/lezione/A.01.001/")).toBe(false);
    expect(policy.isLessonPath("/lezione/../profilo")).toBe(false);
    expect(policy.isLessonPath("/lezione/a.01.001")).toBe(false);
    expect(policy.isLessonPath("/profilo")).toBe(false);
    expect(policy.isLessonPath("/lezione/A.01.001/altro")).toBe(false);
  });
});

describe("isStaticAsset", () => {
  it("solo i file pubblici e immutabili di Next", () => {
    expect(policy.isStaticAsset("/_next/static/chunks/a.js")).toBe(true);
    expect(policy.isStaticAsset("/_next/image")).toBe(false);
    expect(policy.isStaticAsset("/api/auth/session")).toBe(false);
  });
});

describe("canStoreLesson", () => {
  const ok = { status: 200, redirected: false, type: "basic", contentType: "text/html; charset=utf-8" };
  it("salva una pagina HTML normale", () => expect(policy.canStoreLesson(ok)).toBe(true));
  it("non salva errori, reindirizzamenti (login, percorso) né cose che non sono HTML", () => {
    expect(policy.canStoreLesson({ ...ok, status: 404 })).toBe(false);
    expect(policy.canStoreLesson({ ...ok, status: 307 })).toBe(false);
    expect(policy.canStoreLesson({ ...ok, redirected: true })).toBe(false);
    expect(policy.canStoreLesson({ ...ok, type: "opaque" })).toBe(false);
    expect(policy.canStoreLesson({ ...ok, contentType: "application/json" })).toBe(false);
    expect(policy.canStoreLesson({ ...ok, contentType: "text/x-component" })).toBe(false);
  });
});

describe("lessonsToEvict", () => {
  const mk = (n: number) => Array.from({ length: n }, (_, i) => ({ url: `/lezione/A.01.${String(i).padStart(3, "0")}`, savedAt: 1000 + i }));
  it("non toglie nulla sotto il limite", () => expect(policy.lessonsToEvict(mk(30), 30)).toEqual([]));
  it("toglie le più vecchie oltre il limite", () => {
    const out = policy.lessonsToEvict(mk(33), 30);
    expect(out).toEqual(["/lezione/A.01.000", "/lezione/A.01.001", "/lezione/A.01.002"]);
  });
  it("usa 30 come limite predefinito e non dipende dall'ordine in ingresso", () => {
    expect(policy.MAX_LESSONS).toBe(30);
    const shuffled = mk(31).reverse();
    expect(policy.lessonsToEvict(shuffled)).toEqual(["/lezione/A.01.000"]);
  });
  it("una data mancante conta come la più vecchia", () => {
    const e = [...mk(30), { url: "/lezione/Z.99.999", savedAt: NaN }];
    expect(policy.lessonsToEvict(e, 30)).toEqual(["/lezione/Z.99.999"]);
  });
});

describe("staticToEvict", () => {
  it("toglie le prime (più vecchie) oltre il limite", () => {
    expect(policy.staticToEvict(["a", "b", "c", "d"], 3)).toEqual(["a"]);
    expect(policy.staticToEvict(["a"], 3)).toEqual([]);
  });
});

describe("isOwnCache", () => {
  it("riconosce le memorie di questo modulo e nessun'altra", () => {
    expect(policy.isOwnCache(policy.LESSONS_CACHE)).toBe(true);
    expect(policy.isOwnCache(policy.STATIC_CACHE)).toBe(true);
    expect(policy.isOwnCache("cyberdojo-offline-v1")).toBe(false);
    expect(policy.isOwnCache("altro")).toBe(false);
  });
});

describe("titleFromHtml", () => {
  it("legge il titolo e decodifica le entità semplici", () => {
    expect(policy.titleFromHtml("<html><head><title>Le reti &amp; i cavi</title></head>")).toBe("Le reti & i cavi");
  });
  it("senza titolo restituisce stringa vuota", () => expect(policy.titleFromHtml("<p>x</p>")).toBe(""));
});

describe("messaggi dal sito", () => {
  it("accetta solo i messaggi attesi", () => {
    expect(policy.isClearMessage({ type: "cd-clear-lessons" })).toBe(true);
    expect(policy.isClearMessage({ type: "altro" })).toBe(false);
    expect(policy.isClearMessage(null)).toBe(false);
    expect(policy.lessonIdFromMessage({ type: "cd-save-lesson", id: "B.02.003" })).toBe("B.02.003");
    expect(policy.lessonIdFromMessage({ type: "cd-save-lesson", id: "../x" })).toBe(null);
    expect(policy.lessonIdFromMessage({ type: "x", id: "B.02.003" })).toBe(null);
  });
});
