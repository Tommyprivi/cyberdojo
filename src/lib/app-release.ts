import { z } from "zod";
import raw from "../../content/app-release.json";

/**
 * Dati dell'ultima versione dell'app Android (APK) scaricabile dal sito.
 * Si aggiornano con `scripts/aggiorna-release-apk.mts` dopo ogni costruzione dell'APK.
 */
const schema = z.object({
  available: z.boolean(),
  version: z.string().min(1),
  file: z.string().startsWith("/downloads/"),
  sha256: z.string().regex(/^([0-9a-f]{64})?$/),
  certSha256: z.string().regex(/^([0-9A-F]{2}(:[0-9A-F]{2}){31})?$/),
  sizeBytes: z.number().int().nonnegative(),
  date: z.string(),
});

export type AppRelease = z.infer<typeof schema>;

export function readAppRelease(): AppRelease {
  return schema.parse(raw);
}

/** «2,4 MB»: dimensione leggibile, in megabyte con la virgola. */
export function formatSize(bytes: number): string {
  return `${(bytes / 1_000_000).toFixed(1).replace(".", ",")} MB`;
}
