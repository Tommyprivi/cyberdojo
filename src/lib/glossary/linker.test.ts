import { describe, expect, it } from "vitest";
import { findTermHits, splitByHits, type LinkTerm } from "./linker";

const T = (term: string, def = "definizione di prova abbastanza lunga"): LinkTerm => ({ term, def });
const terms = [T("RAM"), T("CPU"), T("Pacchetto"), T("Pacchetto software"), T("Vulnerabilità"), T("IPv4"), T("Man-in-the-middle"), T("Root"), T("Red team")];

const hit = (text: string, used = new Set<string>()) => findTermHits(text, used, terms).map((h) => text.slice(h.start, h.end));

describe("findTermHits", () => {
  it("trova un termine intero", () => {
    expect(hit("La RAM è veloce.")).toEqual(["RAM"]);
  });
  it("non spezza le parole", () => {
    expect(hit("PRAMATICA e GRAMMI e RAMO")).toEqual([]);
    expect(hit("CPUs")).toEqual([]);
  });
  it("sigle e nomi tecnici: serve la stessa maiuscola", () => {
    expect(hit("la ram e la cpu")).toEqual([]);
    expect(hit("scrivi IPv4 qui")).toEqual(["IPv4"]);
    expect(hit("scrivi ipv4 qui")).toEqual([]);
  });
  it("parole normali: maiuscola o minuscola indifferente", () => {
    expect(hit("Un pacchetto arriva")).toEqual(["pacchetto"]);
    expect(hit("Pacchetto in arrivo")).toEqual(["Pacchetto"]);
    expect(hit("il red team attacca")).toEqual(["red team"]);
  });
  it("gestisce gli accenti", () => {
    expect(hit("una vulnerabilità grave")).toEqual(["vulnerabilità"]);
    expect(hit("vulnerabilitàX")).toEqual([]);
  });
  it("preferisce il termine più lungo", () => {
    const h = findTermHits("Installa un pacchetto software ora", new Set(), terms);
    expect(h).toHaveLength(1);
    expect(h[0].term).toBe("Pacchetto software");
  });
  it("solo la prima occorrenza, e ricorda i termini già usati", () => {
    const used = new Set<string>();
    expect(hit("RAM e ancora RAM", used)).toEqual(["RAM"]);
    expect(hit("di nuovo RAM", used)).toEqual([]);
    expect(used.has("RAM")).toBe(true);
  });
  it("evita percorsi, indirizzi e nomi di file", () => {
    expect(hit("apri /root/file")).toEqual([]);
    expect(hit("vai a utente.RAM.txt")).toEqual([]);
    expect(hit("scrivi sudo-root")).toEqual([]);
    expect(hit("il Root.")).toEqual(["Root"]);
  });
  it("trova termini con trattini e dopo un apostrofo", () => {
    expect(hit("un attacco Man-in-the-middle")).toEqual(["Man-in-the-middle"]);
    expect(hit("l'RAM")).toEqual(["RAM"]);
  });
  it("più termini nello stesso testo, in ordine", () => {
    const h = findTermHits("La CPU usa la RAM", new Set(), terms);
    expect(h.map((x) => x.term)).toEqual(["CPU", "RAM"]);
  });
});

describe("splitByHits", () => {
  it("ricompone il testo senza perdere nulla", () => {
    const text = "La CPU usa la RAM.";
    const parts = splitByHits(text, findTermHits(text, new Set(), terms));
    expect(parts.map((p) => (typeof p === "string" ? p : p.text)).join("")).toBe(text);
    expect(parts.filter((p) => typeof p !== "string")).toHaveLength(2);
  });
  it("senza trovati restituisce il testo intero", () => {
    expect(splitByHits("niente", [])).toEqual(["niente"]);
  });
});
