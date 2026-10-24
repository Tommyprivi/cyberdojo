import { describe, expect, it } from "vitest";
import { isAvatarId } from "./avatars";
import { CHALLENGES, countWins, entryProgress, type ProgressData } from "./challenges";
import { generateCode, generatePublicId, normalizeCode } from "./codes";
import { composeGroupName, isValidGroupName } from "./group-names";
import { canChangeNickname, hasBannedWord, nicknameKey, validateNickname } from "./nickname";
import { ageGroupOf, canBeFriends, canCreateGroup, canJoinGroup, MAX_FRIENDS, MAX_GROUP_SIZE } from "./rules";
import { weekBounds, weekBoundsFromKey } from "./week";

const ctx = { name: "Marco Rossi", email: "marco.rossi92@example.com" };

describe("validateNickname", () => {
  it("accetta un soprannome di fantasia", () => {
    expect(validateNickname("NinjaRiso", ctx)).toMatchObject({ ok: true, nickname: "NinjaRiso", key: "ninjariso" });
    expect(validateNickname("gatto_fan-7", ctx).ok).toBe(true);
  });
  it("rifiuta lunghezza e caratteri sbagliati", () => {
    expect(validateNickname("ab", ctx).ok).toBe(false);
    expect(validateNickname("a".repeat(17), ctx).ok).toBe(false);
    expect(validateNickname("ciao amico", ctx).ok).toBe(false);
    expect(validateNickname("1ciao", ctx).ok).toBe(false);
    expect(validateNickname("zorro<script>", ctx).ok).toBe(false);
    expect(validateNickname("perché", ctx).ok).toBe(false);
  });
  it("rifiuta serie lunghe di numeri (telefono, date)", () => {
    expect(validateNickname("gatto3331234", ctx).ok).toBe(false);
    expect(validateNickname("gatto2010", ctx).ok).toBe(false);
    expect(validateNickname("gatto10", ctx).ok).toBe(true);
  });
  it("rifiuta l'email e il nome reale", () => {
    expect(validateNickname("marcorossi", ctx).ok).toBe(false);
    expect(validateNickname("Marco_Ninja", ctx).ok).toBe(false);
    expect(validateNickname("xxrossixx", ctx).ok).toBe(false);
    expect(validateNickname("marco_rossi92", { name: null, email: "marco.rossi92@example.com" }).ok).toBe(false);
  });
  it("rifiuta i nomi riservati", () => {
    expect(validateNickname("Admin", ctx).ok).toBe(false);
    expect(validateNickname("Sensei_Vero", ctx).ok).toBe(false);
    expect(validateNickname("CyberDojo", ctx).ok).toBe(false);
  });
});

describe("parole vietate", () => {
  it("prende parole in italiano e inglese, anche con trucchi", () => {
    for (const w of ["cazzone", "C4zz0", "m1nchia", "f_u_c_k", "fuuuuck", "Sh1t_man", "nazi", "xX_nazi_Xx", "nazi123", "P0rn", "str0nzo"]) {
      expect(hasBannedWord(w), w).toBe(true);
    }
  });
  it("non vieta parole innocue che contengono pezzi sospetti", () => {
    for (const w of ["significa", "torpedo", "skill", "Classico", "Hashcat", "Dixon", "crisis", "nazione", "produce"]) {
      expect(hasBannedWord(w), w).toBe(false);
    }
  });
});

describe("chiave di unicità e frequenza di cambio", () => {
  it("ignora maiuscole, trattini e trattini bassi", () => {
    expect(nicknameKey("Ninja_01")).toBe(nicknameKey("ninja-01"));
    expect(nicknameKey("Ninja_01")).toBe("ninja01");
  });
  it("il primo cambio è libero, poi serve attendere", () => {
    const now = new Date("2026-10-24T10:00:00Z");
    expect(canChangeNickname(null, now, 7)).toBe(true);
    expect(canChangeNickname(new Date("2026-10-20T10:00:00Z"), now, 7)).toBe(false);
    expect(canChangeNickname(new Date("2026-10-17T10:00:00Z"), now, 7)).toBe(true);
  });
});

describe("età", () => {
  it("14-17 sono minori, le altre fasce adulti, senza fascia nessuno", () => {
    expect(ageGroupOf("14-17")).toBe("minori");
    expect(ageGroupOf("18-25")).toBe("adulti");
    expect(ageGroupOf("26-40")).toBe("adulti");
    expect(ageGroupOf("41+")).toBe("adulti");
    expect(ageGroupOf(null)).toBeNull();
    expect(ageGroupOf("boh")).toBeNull();
  });
  it("amici solo della stessa fascia", () => {
    expect(canBeFriends("minori", "minori")).toBe(true);
    expect(canBeFriends("adulti", "adulti")).toBe(true);
    expect(canBeFriends("minori", "adulti")).toBe(false);
    expect(canBeFriends(null, null)).toBe(false);
  });
  it("i gruppi li crea solo chi è adulto; i minori entrano solo nei gruppi per minori", () => {
    expect(canCreateGroup("adulti")).toBe(true);
    expect(canCreateGroup("minori")).toBe(false);
    expect(canCreateGroup(null)).toBe(false);
    expect(canJoinGroup("minori", "minori")).toBe(true);
    expect(canJoinGroup("minori", "adulti")).toBe(false);
    expect(canJoinGroup("adulti", "minori")).toBe(false);
    expect(canJoinGroup(null, "adulti")).toBe(false);
  });
  it("i limiti sono quelli decisi", () => {
    expect(MAX_FRIENDS).toBe(30);
    expect(MAX_GROUP_SIZE).toBe(40);
  });
});

describe("codici", () => {
  it("generano XXXX-XXXX senza caratteri ambigui e si normalizzano", () => {
    for (let i = 0; i < 50; i++) {
      const c = generateCode();
      expect(c).toMatch(/^[A-Z2-9]{4}-[A-Z2-9]{4}$/);
      expect(c).not.toMatch(/[01OIL]/);
      expect(normalizeCode(c)).toBe(c);
    }
    expect(normalizeCode(" abcd efgh ")).toBe("ABCD-EFGH");
    expect(normalizeCode("abcd-efg")).toBeNull();
    expect(normalizeCode("ABCD-EFG0")).toBeNull();
    expect(generatePublicId()).toMatch(/^[a-z2-9]{12}$/);
  });
});

describe("avatar e nomi dei gruppi", () => {
  it("accetta solo avatar dell'elenco", () => {
    expect(isAvatarId("sensei")).toBe(true);
    expect(isAvatarId("https://evil.example/x.png")).toBe(false);
  });
  it("il nome del gruppo si compone solo da elenchi chiusi", () => {
    expect(composeGroupName("Classe", "Firewall", 3)).toBe("Classe Firewall 3");
    expect(composeGroupName("Classe", "Parolaccia", 3)).toBeNull();
    expect(composeGroupName("Classe", "Firewall", 100)).toBeNull();
    expect(isValidGroupName("Dojo Katana 12")).toBe(true);
    expect(isValidGroupName("Dojo Katana dodici")).toBe(false);
    expect(isValidGroupName("ciao a tutti")).toBe(false);
  });
});

describe("settimana (Europe/Rome)", () => {
  it("la settimana va da lunedì a lunedì in ora italiana (estate: UTC+2)", () => {
    const w = weekBounds(new Date("2026-07-15T12:00:00Z")); // mercoledì
    expect(w.key).toBe("2026-07-13");
    expect(w.start.toISOString()).toBe("2026-07-12T22:00:00.000Z");
    expect(w.end.toISOString()).toBe("2026-07-19T22:00:00.000Z");
  });
  it("d'inverno è UTC+1", () => {
    const w = weekBounds(new Date("2026-12-02T09:00:00Z"));
    expect(w.key).toBe("2026-11-30");
    expect(w.start.toISOString()).toBe("2026-11-29T23:00:00.000Z");
  });
  it("domenica sera tardi è ancora la settimana vecchia, lunedì dopo mezzanotte italiana è nuova", () => {
    const sun = weekBounds(new Date("2026-10-25T22:30:00Z")); // domenica 25 ott, 23:30 a Roma (ora solare dal 25/10)
    expect(sun.key).toBe("2026-10-19");
    const mon = weekBounds(new Date("2026-10-25T23:30:00Z")); // lunedì 26 ott, 00:30 a Roma
    expect(mon.key).toBe("2026-10-26");
  });
  it("regge il cambio d'ora: la settimana del 26 ottobre dura 7 giorni + 1 ora in UTC al contrario", () => {
    const w = weekBounds(new Date("2026-10-21T12:00:00Z")); // contiene il cambio dell'ora (25 ottobre)
    expect(w.key).toBe("2026-10-19");
    expect(w.start.toISOString()).toBe("2026-10-18T22:00:00.000Z");
    expect(w.end.toISOString()).toBe("2026-10-25T23:00:00.000Z");
  });
  it("legge la chiave solo se è un lunedì valido", () => {
    expect(weekBoundsFromKey("2026-10-19")?.key).toBe("2026-10-19");
    expect(weekBoundsFromKey("2026-10-20")).toBeNull();
    expect(weekBoundsFromKey("2026-02-30")).toBeNull();
    expect(weekBoundsFromKey("boh")).toBeNull();
  });
});

describe("sfide", () => {
  const week = "2026-10-19"; // lunedì
  const lessonsChallenge = CHALLENGES.find((c) => c.id === "tre-lezioni")!;
  const entry = { challengeId: lessonsChallenge.id, weekStart: week, joinedAt: new Date("2026-10-19T08:00:00Z") };
  const day = (d: number, h = 12) => new Date(Date.UTC(2026, 9, d, h));
  const data: ProgressData = { lessonDates: [day(18), day(19, 7), day(20), day(21), day(22)], xpEvents: [] };

  it("conta solo le lezioni dopo l'iscrizione e dentro la settimana", () => {
    const p = entryProgress(entry, data, day(23))!;
    expect(p.value).toBe(3); // 20, 21, 22 (non il 18 né le 07:00 del 19)
    expect(p.done).toBe(true);
    expect(p.ended).toBe(false);
  });
  it("la medaglia arriva solo a settimana finita", () => {
    expect(countWins([entry], data, day(23))).toBe(0);
    expect(countWins([entry], data, day(28))).toBe(1);
  });
  it("non vince se non raggiunge l'obiettivo", () => {
    expect(countWins([entry], { lessonDates: [day(20)], xpEvents: [] }, day(28))).toBe(0);
  });
  it("sfida a XP", () => {
    const xp = CHALLENGES.find((c) => c.metric === "xp")!;
    const e = { challengeId: xp.id, weekStart: week, joinedAt: new Date("2026-10-19T00:00:00Z") };
    const d: ProgressData = { lessonDates: [], xpEvents: [{ at: day(20), amount: 100 }, { at: day(21), amount: 25 }] };
    expect(countWins([e], d, day(30))).toBe(1);
  });
});
