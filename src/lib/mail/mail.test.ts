import { beforeAll, describe, expect, it } from "vitest";
import { esc } from "./layout";
import { isReminderDue, localHour, type ReminderCandidate } from "./reminders";
import { magicLinkEmail, reminderEmail, welcomeEmail } from "./templates";
import { makeUnsubscribeToken, verifyUnsubscribeToken } from "./token";

beforeAll(() => {
  process.env.BETTER_AUTH_SECRET = "segreto-di-prova-solo-per-i-test";
  process.env.BETTER_AUTH_URL = "https://cyberdojo.example";
});

describe("esc", () => {
  it("neutralizza i caratteri che romperebbero l'HTML", () => {
    expect(esc(`<script>alert("x")</script> & 'y'`)).toBe("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;y&#39;");
  });
});

describe("modelli di email", () => {
  it("il link di accesso compare nell'HTML e nel testo", () => {
    const url = "https://cyberdojo.example/api/auth/magic-link/verify?token=abc&callbackURL=%2Fpercorso";
    const m = magicLinkEmail({ url });
    expect(m.html).toContain("token=abc&amp;callbackURL=%2Fpercorso"); // nell'HTML l'& è scritto come entità
    expect(m.text).toContain(url);
    expect(m.subject).toMatch(/accesso/i);
  });

  it("il benvenuto saluta per nome e porta al percorso", () => {
    const m = welcomeEmail({ name: "Giulia Rossi", email: "g@example.com" });
    expect(m.subject).toBe("Benvenuto nel dojo, Giulia");
    expect(m.html).toContain("https://cyberdojo.example/percorso");
    expect(m.text).toContain("https://cyberdojo.example/percorso");
  });

  it("senza nome usa la parte dell'email, senza lasciare buchi", () => {
    const m = welcomeEmail({ name: "", email: "mario.bianchi@example.com" });
    expect(m.subject).toBe("Benvenuto nel dojo, mario.bianchi");
  });

  it("un nome malevolo non entra nell'HTML come codice", () => {
    const m = welcomeEmail({ name: `<img src=x onerror=alert(1)>`, email: "x@example.com" });
    expect(m.html).not.toContain("<img src=x");
    expect(m.html).toContain("&lt;img");
  });

  it("il promemoria porta sempre il modo di disattivarlo, in HTML e in testo", () => {
    const url = "https://cyberdojo.example/disiscrizione?token=u1.firma";
    const m = reminderEmail({ name: "Ada", email: "a@example.com", streak: 4, nextLessonTitle: "Il turno di notte", unsubscribeUrl: url });
    expect(m.html).toContain(url);
    expect(m.text).toContain(url);
    expect(m.text).toMatch(/lo hai attivato tu/);
  });

  it("il testo cambia con la serie: in gioco oppure ricominciare", () => {
    const base = { name: "Ada", email: "a@example.com", nextLessonTitle: null, unsubscribeUrl: "https://x.example/u" };
    expect(reminderEmail({ ...base, streak: 1 }).subject).toBe("La tua serie di 1 giorno ti aspetta");
    expect(reminderEmail({ ...base, streak: 7 }).subject).toBe("La tua serie di 7 giorni ti aspetta");
    expect(reminderEmail({ ...base, streak: 0 }).subject).toBe("Il Sensei ti aspetta: un caso oggi?");
    expect(reminderEmail({ ...base, streak: 0 }).text).not.toMatch(/serie di 0/);
  });

  it("ogni email ha HTML valido a grandi linee e un testo non vuoto", () => {
    for (const m of [
      magicLinkEmail({ url: "https://x.example/a" }),
      welcomeEmail({ name: "A", email: "a@example.com" }),
      reminderEmail({ name: "A", email: "a@example.com", streak: 2, nextLessonTitle: "T", unsubscribeUrl: "https://x.example/u" }),
    ]) {
      expect(m.html.startsWith("<!doctype html>")).toBe(true);
      expect(m.html).toContain('lang="it"');
      expect(m.html.match(/<table/g)?.length).toBe(m.html.match(/<\/table>/g)?.length);
      expect(m.text.trim().length).toBeGreaterThan(50);
      // Solo la testata illustrata, dal sito stesso, con alt vuoto: se è bloccata l'email resta leggibile.
      const imgs = m.html.match(/<img[^>]*>/g) ?? [];
      expect(imgs.length).toBeLessThanOrEqual(1);
      for (const img of imgs) expect(img).toMatch(/src="https?:\/\/[^"]+\/email\/[a-z]+\.jpg"[^>]*alt=""/);
    }
  });
});

describe("token di disiscrizione", () => {
  it("andata e ritorno", () => {
    const t = makeUnsubscribeToken("utente-123");
    expect(verifyUnsubscribeToken(t)).toBe("utente-123");
  });

  it("rifiuta firme sbagliate, utenti scambiati e testi strani", () => {
    const t = makeUnsubscribeToken("utente-123");
    const [, sig] = [t.slice(0, t.lastIndexOf(".")), t.slice(t.lastIndexOf(".") + 1)];
    expect(verifyUnsubscribeToken(`altro-utente.${sig}`)).toBeNull(); // la firma di uno non vale per un altro
    expect(verifyUnsubscribeToken(`utente-123.${sig}x`)).toBeNull();
    expect(verifyUnsubscribeToken(`utente-123.${"A".repeat(sig.length)}`)).toBeNull();
    for (const bad of ["", "senza-punto", ".firma", "utente-123.", "a".repeat(400) + ".b"]) expect(verifyUnsubscribeToken(bad), bad).toBeNull();
  });

  it("cambiando il segreto i vecchi link smettono di valere", () => {
    const t = makeUnsubscribeToken("utente-123");
    const old = process.env.BETTER_AUTH_SECRET;
    process.env.BETTER_AUTH_SECRET = "un-altro-segreto";
    expect(verifyUnsubscribeToken(t)).toBeNull();
    process.env.BETTER_AUTH_SECRET = old;
  });
});

describe("isReminderDue", () => {
  const base: ReminderCandidate = {
    userId: "u", email: "u@example.com", name: "U", timezone: "Europe/Rome", reminderHour: 18,
    lastReminderDay: null, streak: { current: 3, best: 3, lastDay: "2026-10-14", freezes: 0 },
  };
  const at = (iso: string) => new Date(iso);

  it("l'ora si calcola nel fuso dell'utente", () => {
    expect(localHour(at("2026-10-15T16:30:00Z"), "Europe/Rome")).toBe(18); // ora legale: UTC+2
    expect(localHour(at("2026-10-15T16:30:00Z"), "UTC")).toBe(16);
    expect(localHour(at("2026-10-15T22:30:00Z"), "Europe/Rome")).toBe(0); // mezzanotte e mezza, non «24»
  });

  it("parte all'ora scelta e nella finestra dopo, non prima né molto dopo", () => {
    expect(isReminderDue(base, at("2026-10-15T15:59:00Z"))).toBe(false); // 17:59
    expect(isReminderDue(base, at("2026-10-15T16:00:00Z"))).toBe(true); // 18:00
    expect(isReminderDue(base, at("2026-10-15T18:59:00Z"))).toBe(true); // 20:59
    expect(isReminderDue(base, at("2026-10-15T19:00:00Z"))).toBe(false); // 21:00: finestra chiusa
  });

  it("una sola volta al giorno", () => {
    const sent = { ...base, lastReminderDay: "2026-10-15" };
    expect(isReminderDue(sent, at("2026-10-15T16:10:00Z"))).toBe(false);
    expect(isReminderDue(sent, at("2026-10-16T16:10:00Z"))).toBe(true); // il giorno dopo si riparte
  });

  it("non disturba chi oggi ha già studiato", () => {
    const studied = { ...base, streak: { ...base.streak, lastDay: "2026-10-15" } };
    expect(isReminderDue(studied, at("2026-10-15T16:10:00Z"))).toBe(false);
  });

  it("rispetta la data locale, non quella del server", () => {
    // A Tokyo sono già le 01:10 del 16: il «giorno» dell'ultima verifica (15) non è oggi.
    const tokyo = { ...base, timezone: "Asia/Tokyo", reminderHour: 1, streak: { ...base.streak, lastDay: "2026-10-15" } };
    expect(isReminderDue(tokyo, at("2026-10-15T16:10:00Z"))).toBe(true);
  });

  it("orario serale: la finestra non scavalca la mezzanotte", () => {
    const late = { ...base, reminderHour: 22 };
    expect(isReminderDue(late, at("2026-10-15T20:30:00Z"))).toBe(true); // 22:30
    expect(isReminderDue(late, at("2026-10-15T21:59:00Z"))).toBe(true); // 23:59
    expect(isReminderDue(late, at("2026-10-15T22:10:00Z"))).toBe(false); // 00:10 del giorno dopo: non è ancora l'ora
  });
});
