/**
 * Risorse della macchina virtuale integrata (emulatore v86, licenza BSD-2-Clause).
 * Niente binari nel repository: tutto si scarica da indirizzi pubblici dopo un clic esplicito,
 * e ogni file viene controllato con la sua impronta SHA-256 prima di essere usato.
 * Se un file cambia a monte, il controllo fallisce e la VM non parte (meglio che eseguire codice diverso).
 */

export interface VmAsset {
  url: string;
  /** Dimensione attesa in byte (serve alla barra di avanzamento). */
  bytes: number;
  /** SHA-256 in base64. */
  sha256: string;
}

const V86_VERSION = "0.5.472";
// Commit di copy/v86 da cui si prendono i BIOS (fissato: gli indirizzi non cambiano nel tempo).
const V86_BIOS_COMMIT = "b8a39b11dd2076870699e6cac053556271b9bfab";

export const VM_ASSETS = {
  lib: {
    url: `https://cdn.jsdelivr.net/npm/v86@${V86_VERSION}/build/libv86.js`,
    bytes: 359_839,
    sha256: "G0EHT3pWBPUo2saEK696/M151zcLl+oyQZRMJ1tnvsE=",
  },
  wasm: {
    url: `https://cdn.jsdelivr.net/npm/v86@${V86_VERSION}/build/v86.wasm`,
    bytes: 2_007_347,
    sha256: "LwxBUPJmQVt1SoSjLm+OTJdaHTq7lMeLBH+jACfbHvE=",
  },
  bios: {
    url: `https://cdn.jsdelivr.net/gh/copy/v86@${V86_BIOS_COMMIT}/bios/seabios.bin`,
    bytes: 131_072,
    sha256: "c+PzWRAuOpmCw1/OmOt80I8YMDrH8bpuv75s3BwkTZg=",
  },
  vgaBios: {
    url: `https://cdn.jsdelivr.net/gh/copy/v86@${V86_BIOS_COMMIT}/bios/vgabios.bin`,
    bytes: 36_352,
    sha256: "pLwNgMw8oCjHPa+o/uOWuNBUzofr2Kv70xsGtDdgeIA=",
  },
  kernel: {
    url: "https://i.copy.sh/buildroot-bzimage68.bin",
    bytes: 10_068_480,
    sha256: "UHp1nHCrekkKIzvkVNC1uIvGZ5VqQQtTHLTtwJHi6xw=",
  },
} satisfies Record<string, VmAsset>;

export const VM_TOTAL_BYTES = Object.values(VM_ASSETS).reduce((s, a) => s + a.bytes, 0);

export const VM_MEGABYTES = Math.ceil(VM_TOTAL_BYTES / 1_000_000);

export const VM_STARTER_COMMANDS = ["uname -a", "ls /", "ps", "cat /proc/cpuinfo", "echo ciao > /tmp/prova.txt", "cat /tmp/prova.txt", "ip addr", "ping -c 1 8.8.8.8"];

export function toBase64(buf: ArrayBuffer): string {
  let bin = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

/** Scarica un file con avanzamento e ne controlla l'impronta SHA-256. */
export async function fetchVerified(asset: VmAsset, onChunk: (bytes: number) => void, signal?: AbortSignal): Promise<ArrayBuffer> {
  const res = await fetch(asset.url, { signal, credentials: "omit", referrerPolicy: "no-referrer" });
  if (!res.ok || !res.body) throw new Error(`Download non riuscito (${res.status}) da ${new URL(asset.url).host}`);
  const reader = res.body.getReader();
  const parts: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    parts.push(value);
    received += value.length;
    if (received > asset.bytes * 1.05 + 1024) throw new Error("Il file è più grande del previsto: scaricamento interrotto");
    onChunk(value.length);
  }
  const out = new Uint8Array(received);
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.length;
  }
  const digest = await crypto.subtle.digest("SHA-256", out);
  if (toBase64(digest) !== asset.sha256) {
    throw new Error(`Controllo di integrità fallito per ${new URL(asset.url).pathname.split("/").pop()}: il file è cambiato rispetto a quello verificato.`);
  }
  return out.buffer;
}
