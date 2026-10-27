import { describe, expect, it } from "vitest";
import { buildQueue, chooseSource, clampRate, extractSayTexts, formatPoint, parsePoint, pointKey, splitSentences, stepIndex, screenStart } from "./listen";

describe("extractSayTexts", () => {
  it("prende il testo dei <Say> e toglie markdown e tag", () => {
    const src = `<Scene title="A">\n<Say who="sensei">Il **computer** è una \`scatola\`. Vedi [guida](/x).</Say>\n<Say who="assistente">\n  Seconda\n  riga.\n</Say>\n</Scene>`;
    expect(extractSayTexts(src)).toEqual(["Il computer è una scatola. Vedi guida.", "Seconda riga."]);
  });
  it("ignora Say vuoti e schermate senza Say", () => {
    expect(extractSayTexts("<Say who=\"sensei\">  </Say>")).toEqual([]);
    expect(extractSayTexts("niente")).toEqual([]);
  });
});

describe("splitSentences", () => {
  it("divide alle frasi", () => {
    expect(splitSentences("Ciao. Come stai? Bene!")).toEqual(["Ciao.", "Come stai?", "Bene!"]);
  });
  it("non rompe i decimali", () => {
    expect(splitSentences("Vale 3.14 circa. Ok.")).toEqual(["Vale 3.14 circa.", "Ok."]);
  });
  it("spezza le frasi troppo lunghe sugli spazi", () => {
    const parts = splitSentences("parola ".repeat(50).trim(), 40);
    expect(parts.length).toBeGreaterThan(1);
    expect(parts.every((p) => p.length <= 40)).toBe(true);
  });
  it("testo vuoto", () => expect(splitSentences("  ")).toEqual([]));
});

describe("buildQueue", () => {
  const screens = [["Uno. Due."], [], ["Tre."]];
  it("una voce per frase, con numero schermata", () => {
    const q = buildQueue(screens);
    expect(q.map((i) => [i.screen, i.text])).toEqual([[0, "Uno."], [0, "Due."], [2, "Tre."]]);
    expect(q.every((i) => i.audioUrl === undefined)).toBe(true);
  });
  it("con audio esistente la schermata diventa una voce sola", () => {
    const q = buildQueue(screens, { 0: "https://x/a.mp3" });
    expect(q.map((i) => [i.screen, i.audioUrl])).toEqual([[0, "https://x/a.mp3"], [2, undefined]]);
    expect(q[0].text).toBe("Uno. Due.");
  });
  it("ignora audio non http(s)", () => {
    expect(buildQueue(screens, { 0: "javascript:alert(1)" })[0].audioUrl).toBeUndefined();
  });
  it("stepIndex e screenStart", () => {
    const q = buildQueue(screens);
    expect(stepIndex(q, 0, 1)).toBe(1);
    expect(stepIndex(q, 2, 1)).toBe(2);
    expect(stepIndex(q, 0, -1)).toBe(0);
    expect(screenStart(q, 2)).toBe(2);
    expect(screenStart(q, 1)).toBe(2); // schermata muta: salta alla prossima con testo
    expect(screenStart(q, 9)).toBe(-1);
  });
});

describe("punto salvato", () => {
  it("chiave per lezione", () => expect(pointKey("F.01.001")).toBe("cyberdojo:ascolta:F.01.001"));
  it("andata e ritorno", () => {
    const s = formatPoint({ index: 3, rate: 1.2 });
    expect(parsePoint(s)).toEqual({ index: 3, rate: 1.2 });
  });
  it("valori rovinati danno null o valori sicuri", () => {
    expect(parsePoint(null)).toBeNull();
    expect(parsePoint("{{")).toBeNull();
    expect(parsePoint('{"v":1,"index":-4,"rate":9}')).toEqual({ index: 0, rate: 1.5 });
    expect(parsePoint('{"v":2,"index":1}')).toBeNull();
  });
  it("clampRate", () => {
    expect(clampRate(0.1)).toBe(0.8);
    expect(clampRate(NaN)).toBe(1);
  });
});

describe("chooseSource", () => {
  it("audio esistente vince", () => expect(chooseSource({ audioUrl: "https://a/b.mp3" }, true)).toBe("audio"));
  it("altrimenti sintesi", () => expect(chooseSource({}, true)).toBe("speech"));
  it("niente di niente", () => expect(chooseSource({}, false)).toBe("none"));
});
