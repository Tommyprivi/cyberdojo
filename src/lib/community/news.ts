/** Versione della novità vista (profiles.seen_news_version): è l'id dell'ultimo annuncio. Solo caratteri sicuri. */
export const isNewsVersion = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,79}$/.test(v);
