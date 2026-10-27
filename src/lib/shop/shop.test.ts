import { describe, expect, it } from "vitest";
import { SHOP_ITEMS, lookFromEquipped } from "./items";
import { checkEquip, checkPurchase, coinBalance, coinsEarned, coinsSpent } from "./rules";

describe("catalogo", () => {
  it("ha almeno 12 oggetti, id unici e prezzi interi positivi", () => {
    expect(SHOP_ITEMS.length).toBeGreaterThanOrEqual(12);
    expect(new Set(SHOP_ITEMS.map((i) => i.id)).size).toBe(SHOP_ITEMS.length);
    for (const i of SHOP_ITEMS) expect(Number.isInteger(i.price) && i.price > 0).toBe(true);
  });
  it("i prezzi sono in ordine crescente", () => {
    const p = SHOP_ITEMS.map((i) => i.price);
    expect(p).toEqual([...p].sort((a, b) => a - b));
  });
});

describe("saldo", () => {
  it("10 XP = 1 moneta, per difetto", () => {
    expect(coinsEarned(0)).toBe(0);
    expect(coinsEarned(9)).toBe(0);
    expect(coinsEarned(99)).toBe(9);
    expect(coinsEarned(-50)).toBe(0);
  });
  it("sottrae il costo degli oggetti posseduti, senza doppioni né id sconosciuti", () => {
    expect(coinsSpent(["fascia-indaco", "fascia-indaco", "boh"])).toBe(10);
    expect(coinBalance(100, ["fascia-indaco"])).toBe(0);
    expect(coinBalance(50, ["cappello-corona"])).toBe(0);
  });
});

describe("acquisto", () => {
  it("riesce con monete sufficienti", () => {
    expect(checkPurchase(200, [], "fascia-verde")).toEqual({ ok: true, price: 20, balanceAfter: 0 });
  });
  it("rifiuta se mancano monete", () => {
    expect(checkPurchase(190, [], "fascia-verde")).toEqual({ ok: false, error: "Ti manca 1 moneta." });
    expect(checkPurchase(100, [], "fascia-verde")).toEqual({ ok: false, error: "Ti mancano 10 monete." });
  });
  it("rifiuta il doppio acquisto e gli oggetti inesistenti", () => {
    expect(checkPurchase(5000, ["fascia-verde"], "fascia-verde").ok).toBe(false);
    expect(checkPurchase(5000, [], "regalo-gratis").ok).toBe(false);
  });
});

describe("equipaggiamento", () => {
  it("serve averlo comprato", () => {
    expect(checkEquip([], [], "fascia-verde").ok).toBe(false);
  });
  it("uno solo per tipo: il nuovo sostituisce il vecchio", () => {
    const r = checkEquip(["fascia-verde", "fascia-oro", "sfondo-alba"], ["fascia-verde", "sfondo-alba"], "fascia-oro");
    expect(r).toEqual({ ok: true, equipped: ["sfondo-alba", "fascia-oro"], changed: "on" });
  });
  it("rimette giù se era già equipaggiato", () => {
    expect(checkEquip(["fascia-verde"], ["fascia-verde"], "fascia-verde")).toEqual({ ok: true, equipped: [], changed: "off" });
  });
  it("l'aspetto si ricava dagli equipaggiati", () => {
    expect(lookFromEquipped(["fascia-oro", "cappello-corona", "xx"])).toEqual({ band: "#c9971c", hat: "corona" });
  });
});
