import { describe, expect, it } from "vitest";
import {
  MAX_SUBSCRIPTIONS_PER_USER,
  buildMessage,
  isNewsPushDue,
  isStudyPushDue,
  isSubscriptionGone,
  parsePrefs,
  safeInternalUrl,
  validateSubscription,
  type PushCandidate,
} from "./rules";

const base: PushCandidate = {
  kinds: ["studio", "novita", "sfide"],
  hour: 18,
  timezone: "Europe/Rome",
  lastStudyDay: null,
  lastNewsId: null,
  streakLastDay: null,
};
// 2026-10-27 17:30 UTC = 18:30 a Roma (ora solare dal 25/10: UTC+1)
const evening = new Date("2026-10-27T17:30:00Z");

describe("isStudyPushDue", () => {
  it("e dovuta nell'ora scelta, nel fuso del profilo", () => {
    expect(isStudyPushDue(base, evening)).toBe(true);
  });
  it("non e dovuta prima dell'ora scelta", () => {
    expect(isStudyPushDue(base, new Date("2026-10-27T15:00:00Z"))).toBe(false);
  });
  it("rispetta il fuso: stesso istante, ora diversa a New York", () => {
    expect(isStudyPushDue({ ...base, timezone: "America/New_York" }, evening)).toBe(false);
  });
  it("non e piu dovuta dopo la finestra di invio", () => {
    expect(isStudyPushDue(base, new Date("2026-10-27T21:30:00Z"))).toBe(false);
  });
  it("non si manda due volte nello stesso giorno", () => {
    expect(isStudyPushDue({ ...base, lastStudyDay: "2026-10-27" }, evening)).toBe(false);
    expect(isStudyPushDue({ ...base, lastStudyDay: "2026-10-26" }, evening)).toBe(true);
  });
  it("non si manda se oggi ha gia studiato", () => {
    expect(isStudyPushDue({ ...base, streakLastDay: "2026-10-27" }, evening)).toBe(false);
  });
  it("non si manda se il tipo e spento", () => {
    expect(isStudyPushDue({ ...base, kinds: ["novita"] }, evening)).toBe(false);
  });
  it("fuso non valido: non manda e non esplode", () => {
    expect(isStudyPushDue({ ...base, timezone: "Marte/Olympus" }, evening)).toBe(false);
  });
});

describe("isNewsPushDue", () => {
  it("manda un annuncio nuovo", () => {
    expect(isNewsPushDue(base, "a2")).toBe(true);
  });
  it("non rimanda lo stesso annuncio", () => {
    expect(isNewsPushDue({ ...base, lastNewsId: "a2" }, "a2")).toBe(false);
  });
  it("non manda se spento o se non ci sono annunci", () => {
    expect(isNewsPushDue({ ...base, kinds: ["studio"] }, "a2")).toBe(false);
    expect(isNewsPushDue(base, null)).toBe(false);
  });
});

describe("buildMessage", () => {
  it("studio: gentile, senza pressione, con link al percorso", () => {
    const m = buildMessage("studio", { streak: 0, nextLessonTitle: "Cos'e un IP" });
    expect(m.url).toBe("/percorso");
    expect(m.body).toContain("Cos'e un IP");
    expect(m.body.toLowerCase()).not.toMatch(/perdi|non perdere|ultima occasione|subito/);
  });
  it("studio: cita la serie solo se c'e", () => {
    expect(buildMessage("studio", { streak: 5, nextLessonTitle: null }).body).toContain("5");
    expect(buildMessage("studio", { streak: 0, nextLessonTitle: null }).body).not.toMatch(/\b0\b/);
  });
  it("novita: usa il titolo e punta agli annunci", () => {
    const m = buildMessage("novita", { title: "Nuovo corso" });
    expect(m.body).toContain("Nuovo corso");
    expect(m.url).toBe("/annunci");
  });
  it("tronca i titoli lunghi", () => {
    const m = buildMessage("novita", { title: "x".repeat(500) });
    expect(m.body.length).toBeLessThan(200);
  });
  it("sfide: messaggio di invito", () => {
    expect(buildMessage("sfide", {}).url).toBe("/social");
  });
});

describe("safeInternalUrl", () => {
  it("accetta percorsi interni", () => {
    expect(safeInternalUrl("/percorso")).toBe("/percorso");
  });
  it("rifiuta esterni e trucchi", () => {
    for (const u of ["https://evil.com", "//evil.com", "/\\evil.com", "javascript:alert(1)", "", null, 5]) {
      expect(safeInternalUrl(u)).toBe("/percorso");
    }
  });
});

describe("validateSubscription", () => {
  const ok = { endpoint: "https://fcm.googleapis.com/fcm/send/abc123", keys: { p256dh: "BNc_-AbC123", auth: "xYz_-123" } };
  it("accetta una iscrizione valida", () => {
    const r = validateSubscription(ok, 0);
    expect(r.ok).toBe(true);
  });
  it("rifiuta endpoint non https", () => {
    expect(validateSubscription({ ...ok, endpoint: "http://x.com/a" }, 0).ok).toBe(false);
    expect(validateSubscription({ ...ok, endpoint: "ftp://x.com/a" }, 0).ok).toBe(false);
    expect(validateSubscription({ ...ok, endpoint: "non un url" }, 0).ok).toBe(false);
  });
  it("rifiuta endpoint locali o con credenziali", () => {
    expect(validateSubscription({ ...ok, endpoint: "https://localhost/a" }, 0).ok).toBe(false);
    expect(validateSubscription({ ...ok, endpoint: "https://user:pw@x.com/a" }, 0).ok).toBe(false);
    expect(validateSubscription({ ...ok, endpoint: "https://127.0.0.1/a" }, 0).ok).toBe(false);
  });
  it("rifiuta chiavi mancanti o strane", () => {
    expect(validateSubscription({ endpoint: ok.endpoint }, 0).ok).toBe(false);
    expect(validateSubscription({ ...ok, keys: { p256dh: "", auth: "a" } }, 0).ok).toBe(false);
    expect(validateSubscription({ ...ok, keys: { p256dh: "a b", auth: "a" } }, 0).ok).toBe(false);
  });
  it("rifiuta endpoint enormi", () => {
    expect(validateSubscription({ ...ok, endpoint: "https://x.com/" + "a".repeat(3000) }, 0).ok).toBe(false);
  });
  it("limita le iscrizioni per utente", () => {
    expect(validateSubscription(ok, MAX_SUBSCRIPTIONS_PER_USER).ok).toBe(false);
    expect(validateSubscription(ok, MAX_SUBSCRIPTIONS_PER_USER - 1).ok).toBe(true);
  });
  it("rifiuta input che non e un oggetto", () => {
    expect(validateSubscription(null, 0).ok).toBe(false);
    expect(validateSubscription("x", 0).ok).toBe(false);
  });
});

describe("parsePrefs", () => {
  it("accetta ora e tipi validi", () => {
    expect(parsePrefs({ hour: 9, kinds: ["studio"] })).toEqual({ ok: true, value: { hour: 9, kinds: ["studio"] } });
  });
  it("toglie doppioni e rifiuta tipi o ore sbagliate", () => {
    const r = parsePrefs({ hour: 9, kinds: ["studio", "studio"] });
    expect(r.ok && r.value.kinds).toEqual(["studio"]);
    expect(parsePrefs({ hour: 24, kinds: [] }).ok).toBe(false);
    expect(parsePrefs({ hour: 1.5, kinds: [] }).ok).toBe(false);
    expect(parsePrefs({ hour: 9, kinds: ["spam"] }).ok).toBe(false);
  });
});

describe("isSubscriptionGone", () => {
  it("404 e 410 vogliono dire iscrizione scaduta", () => {
    expect(isSubscriptionGone({ statusCode: 410 })).toBe(true);
    expect(isSubscriptionGone({ statusCode: 404 })).toBe(true);
    expect(isSubscriptionGone({ statusCode: 500 })).toBe(false);
    expect(isSubscriptionGone(new Error("x"))).toBe(false);
  });
});
