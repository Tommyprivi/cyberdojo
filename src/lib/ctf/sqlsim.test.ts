import { describe, expect, it } from "vitest";
import { LOGIN_SELECT, LOGIN_TEMPLATE, runQuery, SEARCH_SELECT, SEARCH_TEMPLATE } from "./sqlsim";

const users = [
  { nome: "admin", password: "x9!kq", note: "SEGRETO" },
  { nome: "mario", password: "ciao", note: "" },
];
const login = (u: string, p: string) => runQuery(LOGIN_SELECT, LOGIN_TEMPLATE, [u, p], users);

describe("login finto", () => {
  it("accesso normale", () => {
    expect(login("mario", "ciao").rows).toHaveLength(1);
    expect(login("mario", "sbagliata").rows).toHaveLength(0);
  });
  it("tautologia nella password: entra come prima riga", () => {
    expect(login("mario", "' OR '1'='1").rows).toHaveLength(2);
  });
  it("commento che taglia il controllo della password", () => {
    expect(login("admin'--", "").rows.map((r) => r.nome)).toEqual(["admin"]);
  });
  it("tautologia nel nome: AND vince su OR, quindi da sola non basta", () => {
    expect(login("' OR '1'='1", "boh").rows).toHaveLength(0);
  });
  it("sintassi rotta dà errore", () => {
    expect(login("mario'", "x").error).toMatch(/sintassi/);
  });
});

describe("ricerca finta", () => {
  const prods = [
    { nome: "Penna", prezzo: 2, note: "", visibile: 1 },
    { nome: "Prototipo", prezzo: 0, note: "SEGRETO", visibile: 0 },
  ];
  const search = (q: string) => runQuery(SEARCH_SELECT, SEARCH_TEMPLATE, [q], prods);
  it("mostra solo i prodotti visibili", () => {
    expect(search("pen").rows.map((r) => r.nome)).toEqual(["Penna"]);
    expect(search("").rows.map((r) => r.nome)).toEqual(["Penna"]);
  });
  it("senza commento la tautologia non basta (resta visibile = 1 o dà errore)", () => {
    const r = search("' OR 1=1");
    expect(r.error ?? r.rows.map((x) => x.nome).join()).not.toContain("Prototipo");
  });
  it("con la tautologia e il commento escono tutti", () => {
    expect(search("' OR 1=1 --").rows).toHaveLength(2);
  });
});
