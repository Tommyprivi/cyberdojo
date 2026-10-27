/**
 * Mette l'APK appena costruito sul sito: lo copia in public/downloads/cyberdojo.apk e aggiorna
 * content/app-release.json (impronta SHA-256, dimensione, data, versione, impronta del certificato).
 *
 *   npx tsx scripts/aggiorna-release-apk.mts android/app-release-signed.apk 1.0.0 [IMPRONTA-CERTIFICATO-SHA256]
 *
 * L'impronta del certificato si legge con: keytool -list -v -keystore android/cyberdojo.keystore
 * (riga «SHA256:»). Dopo, ripubblicare il sito.
 */
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";

const [apkPath, version, cert = ""] = process.argv.slice(2);
if (!apkPath || !version) {
  console.error("Uso: npx tsx scripts/aggiorna-release-apk.mts <file.apk> <versione> [impronta-certificato]");
  process.exit(1);
}
if (cert && !/^([0-9A-F]{2}:){31}[0-9A-F]{2}$/.test(cert)) {
  console.error("L'impronta del certificato deve avere 32 coppie esadecimali maiuscole separate da due punti.");
  process.exit(1);
}

const bytes = readFileSync(apkPath);
const sha256 = createHash("sha256").update(bytes).digest("hex");
mkdirSync("public/downloads", { recursive: true });
copyFileSync(apkPath, "public/downloads/cyberdojo.apk");

const date = new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Rome" }).format(new Date());
const release = {
  available: true,
  version,
  file: "/downloads/cyberdojo.apk",
  sha256,
  certSha256: cert,
  sizeBytes: statSync(apkPath).size,
  date,
};
writeFileSync("content/app-release.json", `${JSON.stringify(release, null, 2)}\n`);
console.log(`Pubblicato: versione ${version}, ${release.sizeBytes} byte\nSHA-256: ${sha256}`);
