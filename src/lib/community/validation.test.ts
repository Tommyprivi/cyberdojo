import { describe, expect, it } from "vitest";
import { ANNOUNCEMENT_TAGS, announcementInput, makeAnnouncementId } from "./validation";

const ok = { title: "Nuovo corso", summary: "", body: "Ciao **a tutti**", tags: ["novità"], pinned: false };

describe("announcementInput", () => {
  it("accetta un annuncio valido", () => {
    expect(announcementInput.safeParse(ok).success).toBe(true);
  });
  it("rifiuta titolo troppo corto o lungo", () => {
    expect(announcementInput.safeParse({ ...ok, title: "ab" }).success).toBe(false);
    expect(announcementInput.safeParse({ ...ok, title: "x".repeat(121) }).success).toBe(false);
  });
  it("rifiuta testo vuoto o oltre il limite", () => {
    expect(announcementInput.safeParse({ ...ok, body: "  " }).success).toBe(false);
    expect(announcementInput.safeParse({ ...ok, body: "x".repeat(6001) }).success).toBe(false);
  });
  it("accetta solo etichette dell'elenco", () => {
    expect(announcementInput.safeParse({ ...ok, tags: ["hack"] }).success).toBe(false);
    expect(ANNOUNCEMENT_TAGS).toContain("importante");
  });
  it("rifiuta MDX/HTML evidenti (tag, import, export, graffe)", () => {
    for (const body of ["<script>alert(1)</script>", "ciao <b>x</b>", "import X from 'y'", "export const a = 1", "{props.x}"]) {
      expect(announcementInput.safeParse({ ...ok, body }).success, body).toBe(false);
    }
  });
  it("rifiuta titolo con HTML", () => {
    expect(announcementInput.safeParse({ ...ok, title: "<b>ciao</b>" }).success).toBe(false);
  });
});

describe("makeAnnouncementId", () => {
  it("ha sempre il prefisso db- (mai uguale a un id di file)", () => {
    const id = makeAnnouncementId("Il più grande aggiornamento!", new Date("2026-11-01T10:00:00Z"), "ab12");
    expect(id).toBe("db-2026-11-01-il-piu-grande-aggiornamento-ab12");
  });
  it("è limitato in lunghezza e sicuro per gli indirizzi", () => {
    const id = makeAnnouncementId("x".repeat(200), new Date("2026-11-01T10:00:00Z"), "zz");
    expect(id.length).toBeLessThanOrEqual(60);
    expect(id).toMatch(/^db-[a-z0-9-]+$/);
  });
});
