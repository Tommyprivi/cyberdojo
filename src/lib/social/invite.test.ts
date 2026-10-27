import { describe, expect, it } from "vitest";
import { inviteCodeFromParam, inviteUrl, whatsappInviteText, whatsappShareUrl } from "./invite";

describe("inviteCodeFromParam", () => {
  it("normalizza il codice del link", () => {
    expect(inviteCodeFromParam("abcd-2345")).toBe("ABCD-2345");
    expect(inviteCodeFromParam("abcd2345")).toBe("ABCD-2345");
    expect(inviteCodeFromParam("ABCD%2D2345")).toBe("ABCD-2345");
  });
  it("rifiuta codici sbagliati, lunghi o con caratteri strani", () => {
    expect(inviteCodeFromParam("ABC")).toBeNull();
    expect(inviteCodeFromParam("ABCD-23450")).toBeNull();
    expect(inviteCodeFromParam("ABCD-0O1I")).toBeNull();
    expect(inviteCodeFromParam("../../etc")).toBeNull();
    expect(inviteCodeFromParam("%E0%A4%A")).toBeNull();
    expect(inviteCodeFromParam("")).toBeNull();
  });
});

describe("inviteUrl", () => {
  it("compone origine e codice", () => {
    expect(inviteUrl("https://cyberdojo.it", "ABCD-2345")).toBe("https://cyberdojo.it/invito/ABCD-2345");
  });
  it("toglie la barra finale dell'origine", () => {
    expect(inviteUrl("https://cyberdojo.it/", "abcd2345")).toBe("https://cyberdojo.it/invito/ABCD-2345");
  });
  it("rifiuta un codice non valido", () => {
    expect(() => inviteUrl("https://cyberdojo.it", "xx")).toThrow();
  });
});

describe("whatsappInviteText", () => {
  const link = "https://cyberdojo.it/invito/ABCD-2345";
  it("contiene il link e, se consentito, il soprannome", () => {
    const t = whatsappInviteText(link, "NinjaRiso");
    expect(t).toContain(link);
    expect(t).toContain("NinjaRiso");
  });
  it("senza soprannome non mette nessun nome", () => {
    const t = whatsappInviteText(link, null);
    expect(t).toContain(link);
    expect(t).not.toMatch(/sono /i);
  });
  it("ignora un soprannome non valido (niente nomi veri o testo strano)", () => {
    const t = whatsappInviteText(link, "Marco Rossi <b>");
    expect(t).not.toContain("Marco");
    expect(t).not.toContain("<b>");
  });
});

describe("whatsappShareUrl", () => {
  it("codifica il testo per wa.me", () => {
    const text = "Ciao & benvenuto! https://cyberdojo.it/invito/ABCD-2345?x=1";
    const url = whatsappShareUrl(text);
    expect(url.startsWith("https://wa.me/?text=")).toBe(true);
    expect(url).not.toContain(" ");
    expect(url).not.toContain("&b");
    expect(decodeURIComponent(url.slice("https://wa.me/?text=".length))).toBe(text);
  });
});
