import { describe, expect, it } from "vitest";
import {
  SHOP_ITEMS,
  SLOT_ORDER,
  equipGroup,
  getItem,
  previewLayers,
} from "./items";
import {
  checkEquip,
  checkPurchase,
  coinBalance,
  coinsEarned,
  coinsSpent,
} from "./rules";

describe("catalogo", () => {
  it("ha 18 oggetti e 4 sfondi, id unici e prezzi interi positivi", () => {
    expect(SHOP_ITEMS.filter((i) => i.slot !== "background")).toHaveLength(14);
    expect(SHOP_ITEMS.filter((i) => i.slot === "background")).toHaveLength(4);
    expect(new Set(SHOP_ITEMS.map((i) => i.id)).size).toBe(SHOP_ITEMS.length);
    for (const i of SHOP_ITEMS)
      expect(Number.isInteger(i.price) && i.price > 0).toBe(true);
  });
  it("l'id è il nome del disegno", () => {
    for (const i of SHOP_ITEMS)
      expect(i.img.src).toBe(`/img/negozio/${i.id}.png`);
  });
  it("le sezioni sono nell'ordine Fasce, Cappelli, Accessori, Sfondi e i prezzi crescono dentro ogni sezione", () => {
    const slots = SHOP_ITEMS.map((i) => i.slot);
    expect([...new Set(slots)]).toEqual([...SLOT_ORDER]);
    for (const slot of SLOT_ORDER) {
      const p = SHOP_ITEMS.filter((i) => i.slot === slot).map((i) => i.price);
      expect(p).toEqual([...p].sort((a, b) => a - b));
    }
  });
  it("ogni accessorio ha un posto (viso o mano) e ogni oggetto indossabile ha la sua posizione", () => {
    for (const i of SHOP_ITEMS) {
      if (i.slot === "accessory") expect(["face", "hand"]).toContain(i.spot);
      if (i.slot !== "background") expect(i.fit).toBeDefined();
    }
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
    expect(coinsSpent(["fascia-blu", "fascia-blu", "boh"])).toBe(10);
    expect(coinBalance(100, ["fascia-blu"])).toBe(0);
    expect(coinBalance(50, ["corona"])).toBe(0);
  });
});

describe("acquisto", () => {
  it("riesce con monete sufficienti", () => {
    expect(checkPurchase(200, [], "fascia-verde")).toEqual({
      ok: true,
      price: 20,
      balanceAfter: 0,
    });
  });
  it("rifiuta se mancano monete", () => {
    expect(checkPurchase(190, [], "fascia-verde")).toEqual({
      ok: false,
      error: "Ti manca 1 moneta.",
    });
    expect(checkPurchase(100, [], "fascia-verde")).toEqual({
      ok: false,
      error: "Ti mancano 10 monete.",
    });
  });
  it("rifiuta il doppio acquisto e gli oggetti inesistenti", () => {
    expect(checkPurchase(5000, ["fascia-verde"], "fascia-verde").ok).toBe(
      false,
    );
    expect(checkPurchase(5000, [], "regalo-gratis").ok).toBe(false);
  });
  it("non porta mai il saldo sotto zero", () => {
    expect(checkPurchase(0, [], "fascia-blu").ok).toBe(false);
    expect(checkPurchase(100, ["sfondo-dojo"], "fascia-blu").ok).toBe(false);
    expect(checkPurchase(100, ["sfondo-dojo"], "fascia-blu")).toEqual({
      ok: false,
      error: "Ti mancano 10 monete.",
    });
  });
});

describe("equipaggiamento", () => {
  it("serve averlo comprato", () => {
    expect(checkEquip([], [], "fascia-verde").ok).toBe(false);
  });
  it("uno solo per tipo: il nuovo sostituisce il vecchio", () => {
    const r = checkEquip(
      ["fascia-verde", "fascia-oro", "sfondo-dojo"],
      ["fascia-verde", "sfondo-dojo"],
      "fascia-oro",
    );
    expect(r).toEqual({
      ok: true,
      equipped: ["sfondo-dojo", "fascia-oro"],
      changed: "on",
    });
  });
  it("un cappello sostituisce solo un altro cappello", () => {
    const owned = ["corona", "cappello-mago", "fascia-blu"];
    const r = checkEquip(owned, ["corona", "fascia-blu"], "cappello-mago");
    expect(r).toEqual({
      ok: true,
      equipped: ["fascia-blu", "cappello-mago"],
      changed: "on",
    });
  });
  it("rimette giù se era già equipaggiato", () => {
    expect(
      checkEquip(["fascia-verde"], ["fascia-verde"], "fascia-verde"),
    ).toEqual({ ok: true, equipped: [], changed: "off" });
  });
  it("un accessorio da viso e uno da mano si indossano insieme", () => {
    const owned = ["cuffie", "ventaglio"];
    const r = checkEquip(owned, ["cuffie"], "ventaglio");
    expect(r).toEqual({
      ok: true,
      equipped: ["cuffie", "ventaglio"],
      changed: "on",
    });
  });
  it("due accessori da viso non stanno insieme: il nuovo sostituisce il vecchio", () => {
    const r = checkEquip(
      ["cuffie", "occhiali-tondi", "katana-di-carta"],
      ["cuffie", "katana-di-carta"],
      "occhiali-tondi",
    );
    expect(r).toEqual({
      ok: true,
      equipped: ["katana-di-carta", "occhiali-tondi"],
      changed: "on",
    });
  });
  it("due accessori da mano non stanno insieme", () => {
    const r = checkEquip(
      ["ventaglio", "katana-di-carta"],
      ["ventaglio"],
      "katana-di-carta",
    );
    expect(r).toEqual({
      ok: true,
      equipped: ["katana-di-carta"],
      changed: "on",
    });
  });
  it("i gruppi sono quelli attesi", () => {
    expect(equipGroup(getItem("cuffie")!)).toBe("accessory:face");
    expect(equipGroup(getItem("ventaglio")!)).toBe("accessory:hand");
    expect(equipGroup(getItem("corona")!)).toBe("hat");
  });
});

describe("anteprima", () => {
  it("separa lo sfondo dagli oggetti indossati e li ordina dal fondo alla cima, ignorando gli id sconosciuti", () => {
    const l = previewLayers([
      "katana-di-carta",
      "corona",
      "xx",
      "sfondo-dojo",
      "cuffie",
      "fascia-oro",
    ]);
    expect(l.background?.id).toBe("sfondo-dojo");
    expect(l.worn.map((i) => i.id)).toEqual([
      "fascia-oro",
      "cuffie",
      "corona",
      "katana-di-carta",
    ]);
  });
  it("senza nulla addosso non c'è niente da disegnare", () => {
    expect(previewLayers([])).toEqual({ background: undefined, worn: [] });
  });
});
