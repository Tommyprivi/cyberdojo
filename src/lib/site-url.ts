/** Indirizzo pubblico del sito, senza barra finale. Serve per i link nelle email. */
export function siteUrl(): string {
  return (process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/+$/, "");
}
