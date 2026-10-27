import { describe, expect, it } from "vitest";
import { base64ToText, bytesToText, caesar, hexToBytes, hexToText, sha256Hex, vigenere, xorHex } from "./tools";

describe("attrezzi", () => {
  it("cesare va e torna, conserva maiuscole e simboli", () => {
    expect(caesar("Ciao, Mondo!", 3)).toBe("Fldr, Prqgr!");
    expect(caesar(caesar("Ciao", 5), -5)).toBe("Ciao");
  });
  it("vigenere", () => {
    expect(vigenere("attacco", "luna")).toBe("lnganwb");
    expect(vigenere(vigenere("la parola", "sole"), "sole", true)).toBe("la parola");
  });
  it("esadecimale", () => {
    expect(hexToText("63 69 61 6F")).toBe("ciao");
    expect(hexToBytes("zz")).toBeNull();
    expect(hexToBytes("abc")).toBeNull();
    expect(bytesToText([0, 65])).toBe("·A");
  });
  it("base64", () => {
    expect(base64ToText("Y2lhbw==")).toBe("ciao");
    expect(base64ToText("###")).toBeNull();
  });
  it("xor", () => {
    expect(xorHex("0A 03", 0x69)).toBe("cj");
    expect(xorHex("0A", 300)).toBeNull();
  });
  it("sha256", async () => {
    expect(await sha256Hex("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });
});
