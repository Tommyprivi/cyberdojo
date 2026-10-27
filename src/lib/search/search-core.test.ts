import { describe, expect, it } from "vitest";
import { cleanMdx, makeSnippet, normalize, search, tokenize, type SearchEntry } from "./search-core";

const E = (id: string, title: string, text: string, extra: Partial<SearchEntry> = {}): SearchEntry => ({
  id, kind: "lezione", title, text, course: "F", prerequisites: [], ...extra,
});

describe("normalize", () => {
  it("toglie accenti e maiuscole mantenendo la lunghezza", () => {
    const s = "Perché è già così! À";
    expect(normalize(s)).toBe("perche e gia cosi  a");
    expect(normalize(s).length).toBe(s.length);
  });
});

describe("tokenize", () => {
  it("separa le parole, toglie doppioni e parole di una sola lettera", () => {
    expect(tokenize("  Cifratura  CIFRATURA a è chiave ")).toEqual(["cifratura", "chiave"]);
  });
  it("limita il numero di parole", () => {
    expect(tokenize("aa bb cc dd ee ff gg hh ii jj").length).toBe(8);
  });
});

describe("cleanMdx", () => {
  it("toglie tag, commenti e simboli ma tiene il testo e i titoli delle schermate", () => {
    const src = '<Scene title="La RAM: la scrivania">\nLa **RAM** è la memoria.\n<Callout kind="regola">\nUsa `ls`.\n</Callout>\n</Scene>\n{/* screen */}';
    const out = cleanMdx(src);
    expect(out).toContain("La RAM: la scrivania");
    expect(out).toContain("La RAM è la memoria.");
    expect(out).toContain("Usa ls.");
    expect(out).not.toContain("<");
    expect(out).not.toContain("screen");
  });
});

describe("search", () => {
  const entries = [
    E("F.01.001", "Dentro il computer", "La CPU è il processore. La RAM è la scrivania."),
    E("C.02.001", "Hash e impronte", "Un hash è un'impronta digitale di un file. Perché è utile?"),
    E("C.02.002", "Cifratura", "La cifratura simmetrica usa una sola chiave."),
  ];
  it("trova senza badare ad accenti e maiuscole", () => {
    expect(search(entries, "PERCHE").map((r) => r.id)).toEqual(["C.02.001"]);
  });
  it("accetta parole parziali", () => {
    expect(search(entries, "cifrat").map((r) => r.id)).toEqual(["C.02.002"]);
  });
  it("richiede tutte le parole", () => {
    expect(search(entries, "cifratura chiave").length).toBe(1);
    expect(search(entries, "cifratura processore")).toEqual([]);
  });
  it("mette prima il titolo del testo", () => {
    const list = [E("A", "Altro", "parla di hash"), E("B", "Hash", "niente")];
    expect(search(list, "hash").map((r) => r.id)).toEqual(["B", "A"]);
  });
  it("query vuota o troppo corta non dà risultati", () => {
    expect(search(entries, "")).toEqual([]);
    expect(search(entries, "a")).toEqual([]);
  });
  it("rispetta il limite", () => {
    const many = Array.from({ length: 50 }, (_, i) => E(`X${i}`, "Rete", "rete"));
    expect(search(many, "rete", 10).length).toBe(10);
  });
  it("l'estratto evidenzia le parole trovate", () => {
    const [r] = search(entries, "scrivania");
    expect(r.snippet.some((p) => p.hit && normalize(p.text).trim() === "scrivania")).toBe(true);
  });
});

describe("makeSnippet", () => {
  it("taglia attorno alla prima occorrenza e aggiunge i puntini", () => {
    const text = "xxxx ".repeat(60) + "parola importante " + "yyyy ".repeat(60);
    const parts = makeSnippet(text, ["parola"], 40);
    const joined = parts.map((p) => p.text).join("");
    expect(joined.startsWith("…")).toBe(true);
    expect(joined.endsWith("…")).toBe(true);
    expect(joined.length).toBeLessThan(120);
    expect(parts.find((p) => p.hit)?.text).toBe("parola");
  });
  it("senza corrispondenze mostra l'inizio", () => {
    expect(makeSnippet("Inizio del testo", ["zzz"], 40).map((p) => p.text).join("")).toBe("Inizio del testo");
  });
});
