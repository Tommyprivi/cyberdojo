import { describe, expect, it } from "vitest";
import {
  backupCodesFile,
  classifyCode,
  formatManualKey,
  isValidBackupCode,
  isValidTotpCode,
  normalizeBackupCode,
  normalizeTotpCode,
  secretFromOtpauthUri,
} from "./two-factor";

describe("codice dell'app", () => {
  it("ignora spazi e trattini", () => {
    expect(normalizeTotpCode(" 123 456 ")).toBe("123456");
    expect(normalizeTotpCode("123-456")).toBe("123456");
  });
  it("accetta solo 6 cifre", () => {
    expect(isValidTotpCode("123456")).toBe(true);
    expect(isValidTotpCode("12345")).toBe(false);
    expect(isValidTotpCode("1234567")).toBe(false);
    expect(isValidTotpCode("12345a")).toBe(false);
    expect(isValidTotpCode("")).toBe(false);
  });
});

describe("codici di recupero", () => {
  it("rimette il trattino e conserva maiuscole e minuscole", () => {
    expect(normalizeBackupCode("aB3dE9xYz1")).toBe("aB3dE-9xYz1");
    expect(normalizeBackupCode("  aB3dE-9xYz1 ")).toBe("aB3dE-9xYz1");
  });
  it("riconosce il formato", () => {
    expect(isValidBackupCode("aB3dE-9xYz1")).toBe(true);
    expect(isValidBackupCode("aB3dE9xYz1")).toBe(true);
    expect(isValidBackupCode("aB3dE-9xYz")).toBe(false);
    expect(isValidBackupCode("aB3d!-9xYz1")).toBe(false);
  });
  it("distingue codice dell'app da codice di recupero", () => {
    expect(classifyCode("123456")).toBe("totp");
    expect(classifyCode("aB3dE-9xYz1")).toBe("backup");
    expect(classifyCode("ciao")).toBe("invalid");
  });
});

describe("chiave manuale", () => {
  const uri = "otpauth://totp/CyberDojo:a%40example.com?secret=jbswy3dpehpk3pxp&issuer=CyberDojo&digits=6&period=30";
  it("estrae la chiave dall'indirizzo", () => {
    expect(secretFromOtpauthUri(uri)).toBe("JBSWY3DPEHPK3PXP");
  });
  it("rifiuta indirizzi di altro tipo o chiavi strane", () => {
    expect(secretFromOtpauthUri("https://x.example/?secret=ABCD")).toBeNull();
    expect(secretFromOtpauthUri("otpauth://totp/x?secret=abc!def")).toBeNull();
    expect(secretFromOtpauthUri("otpauth://totp/x")).toBeNull();
    expect(secretFromOtpauthUri("non un indirizzo")).toBeNull();
  });
  it("formatta a gruppi di 4", () => {
    expect(formatManualKey("JBSWY3DPEHPK3PXP")).toBe("JBSW Y3DP EHPK 3PXP");
  });
});

describe("file dei codici di recupero", () => {
  it("elenca i codici numerati con data e account", () => {
    const f = backupCodesFile(["aaaaa-bbbbb", "ccccc-ddddd"], "a@example.com", new Date("2026-10-24T10:00:00Z"));
    expect(f).toContain("Account: a@example.com");
    expect(f).toContain("Creati il: 2026-10-24");
    expect(f).toContain(" 1. aaaaa-bbbbb");
    expect(f).toContain(" 2. ccccc-ddddd");
  });
});
