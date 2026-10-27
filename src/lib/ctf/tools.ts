/* Attrezzi della «cassetta» (puri, usabili nel browser). Servono a provare, non a risolvere al posto tuo. */

export function caesar(text: string, shift: number): string {
  return text.replace(/[a-z]/gi, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((((c.charCodeAt(0) - base + shift) % 26) + 26) % 26) + base);
  });
}

export function vigenere(text: string, key: string, decrypt = false): string {
  const k = key.toLowerCase().replace(/[^a-z]/g, "");
  if (!k) return text;
  let i = 0;
  return text.replace(/[a-z]/gi, (c) => {
    const base = c <= "Z" ? 65 : 97;
    const s = k.charCodeAt(i++ % k.length) - 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + (decrypt ? 26 - s : s)) % 26) + base);
  });
}

export function hexToBytes(hex: string): number[] | null {
  const clean = hex.replace(/0x/gi, "").replace(/[\s,:-]/g, "");
  if (clean.length === 0 || clean.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(clean)) return null;
  return (clean.match(/../g) ?? []).map((h) => parseInt(h, 16));
}

export const bytesToText = (bytes: readonly number[]): string => bytes.map((b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : "·")).join("");

export function hexToText(hex: string): string | null {
  const b = hexToBytes(hex);
  return b ? bytesToText(b) : null;
}

export function base64ToText(s: string): string | null {
  const clean = s.trim();
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean) || clean.length % 4 === 1) return null;
  try {
    return bytesToText([...atob(clean)].map((c) => c.charCodeAt(0)));
  } catch {
    return null;
  }
}

export function xorHex(hex: string, key: number): string | null {
  const b = hexToBytes(hex);
  if (!b || !Number.isInteger(key) || key < 0 || key > 255) return null;
  return bytesToText(b.map((x) => x ^ key));
}

export async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
