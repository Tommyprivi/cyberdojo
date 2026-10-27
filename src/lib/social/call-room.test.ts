import { describe, expect, it } from "vitest";
import { callRoomName, isCallAllowed, jitsiBaseUrl, jitsiCallUrl } from "./call-room";

const SECRET = "segreto-di-prova";

describe("callRoomName", () => {
  it("ha il prefisso e 24 caratteri esadecimali", () => {
    expect(callRoomName(SECRET, "amicizia-1")).toMatch(/^cyberdojo-[0-9a-f]{24}$/);
  });
  it("è stabile nel tempo e uguale per i due amici (dipende solo dall'amicizia)", () => {
    const a = callRoomName(SECRET, "9f1c-amicizia");
    const b = callRoomName(SECRET, "9f1c-amicizia");
    expect(a).toBe(b);
  });
  it("amicizie diverse danno stanze diverse", () => {
    expect(callRoomName(SECRET, "uno")).not.toBe(callRoomName(SECRET, "due"));
  });
  it("segreti diversi danno stanze diverse", () => {
    expect(callRoomName("segreto-a", "uno")).not.toBe(callRoomName("segreto-b", "uno"));
  });
  it("non contiene l'id dell'amicizia né il segreto", () => {
    const room = callRoomName(SECRET, "id-amicizia-visibile");
    expect(room).not.toContain("id-amicizia");
    expect(room).not.toContain(SECRET);
  });
  it("rifiuta segreto o id vuoti", () => {
    expect(() => callRoomName("", "uno")).toThrow();
    expect(() => callRoomName(SECRET, "")).toThrow();
  });
});

describe("isCallAllowed", () => {
  const base = { status: "accepted", myGroup: "adulti", theirGroup: "adulti", blocked: false } as const;
  it("adulti con adulti: sì", () => {
    expect(isCallAllowed(base)).toBe(true);
  });
  it("minori con minori: no", () => {
    expect(isCallAllowed({ ...base, myGroup: "minori", theirGroup: "minori" })).toBe(false);
  });
  it("fasce miste: no, in entrambi i versi", () => {
    expect(isCallAllowed({ ...base, myGroup: "minori" })).toBe(false);
    expect(isCallAllowed({ ...base, theirGroup: "minori" })).toBe(false);
  });
  it("amicizia non accettata: no", () => {
    expect(isCallAllowed({ ...base, status: "pending" })).toBe(false);
  });
  it("blocco: no", () => {
    expect(isCallAllowed({ ...base, blocked: true })).toBe(false);
  });
  it("fascia sconosciuta: no", () => {
    expect(isCallAllowed({ ...base, myGroup: null })).toBe(false);
    expect(isCallAllowed({ ...base, theirGroup: null })).toBe(false);
  });
});

describe("jitsiBaseUrl", () => {
  it("usa meet.jit.si se manca", () => {
    expect(jitsiBaseUrl(undefined)).toBe("https://meet.jit.si");
    expect(jitsiBaseUrl("")).toBe("https://meet.jit.si");
  });
  it("accetta un indirizzo https e toglie la barra finale", () => {
    expect(jitsiBaseUrl("https://meet.example.org/")).toBe("https://meet.example.org");
  });
  it("rifiuta http e indirizzi strani", () => {
    expect(jitsiBaseUrl("http://meet.example.org")).toBe("https://meet.jit.si");
    expect(jitsiBaseUrl("javascript:alert(1)")).toBe("https://meet.jit.si");
    expect(jitsiBaseUrl("non un indirizzo")).toBe("https://meet.jit.si");
  });
});

describe("jitsiCallUrl", () => {
  it("costruisce l'indirizzo con le impostazioni di privacy", () => {
    const url = jitsiCallUrl("https://meet.jit.si", "cyberdojo-abc", "NinjaRiso");
    expect(url.startsWith("https://meet.jit.si/cyberdojo-abc#")).toBe(true);
    expect(url).toContain("config.prejoinPageEnabled=true");
    expect(url).toContain("config.startWithVideoMuted=true");
    expect(url).toContain("config.disableDeepLinking=true");
    expect(url).toContain(`userInfo.displayName=${encodeURIComponent('"NinjaRiso"')}`);
  });
  it("omette il nome se non è un soprannome valido", () => {
    expect(jitsiCallUrl("https://meet.jit.si", "cyberdojo-abc", "Marco Rossi <x>")).not.toContain("displayName");
    expect(jitsiCallUrl("https://meet.jit.si", "cyberdojo-abc", null)).not.toContain("displayName");
  });
});
