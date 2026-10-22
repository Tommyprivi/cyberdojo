/**
 * I documenti legali del sito, in un posto solo.
 *
 * - `LEGAL_DOCS`: i documenti che l'utente ACCETTA. La versione finisce nella tabella
 *   `legal_consents`: se un testo cambia, cambia la versione e l'utente viene invitato
 *   ad accettare di nuovo.
 * - `LEGAL_PAGES`: le pagine che servono solo da leggere (crediti, accessibilità, contatti).
 */
export const LEGAL_DOCS = {
  privacy: {
    slug: "privacy",
    title: "Informativa privacy",
    summary: "Chi tratta i tuoi dati, perché e come puoi farli smettere.",
    version: "1.0",
    updated: "21 ottobre 2026",
  },
  termini: {
    slug: "termini",
    title: "Termini e condizioni",
    summary: "Le regole del dojo: cosa offriamo e cosa chiediamo in cambio.",
    version: "1.0",
    updated: "21 ottobre 2026",
  },
  cookie: {
    slug: "cookie",
    title: "Cookie policy",
    summary: "I cookie che usiamo sono pochi e servono solo a farti restare collegato.",
    version: "1.0",
    updated: "21 ottobre 2026",
  },
  minori: {
    slug: "minori",
    title: "Per i minori e le famiglie",
    summary: "Come funziona per chi ha fra 14 e 17 anni.",
    version: "1.0",
    updated: "21 ottobre 2026",
  },
  laboratorio: {
    slug: "laboratorio",
    title: "Disclaimer dei laboratori",
    summary: "Dove puoi provare e dove non devi mai provare.",
    version: "1.0",
    updated: "21 ottobre 2026",
  },
} as const;

export type LegalDocId = keyof typeof LEGAL_DOCS;

/** Elenco compatto, nell'ordine in cui compaiono nel footer. */
export const LEGAL_DOC_LIST = Object.entries(LEGAL_DOCS).map(([id, d]) => ({ id: id as LegalDocId, ...d }));

/** Pagine che si leggono e basta: non c'è nulla da accettare. */
export const LEGAL_PAGES = [
  { slug: "crediti", title: "Crediti, fonti e licenze" },
  { slug: "accessibilita", title: "Dichiarazione di accessibilità" },
  { slug: "contatti", title: "Contatti" },
] as const;

/** Versione corrente di un documento: serve quando si registra un'accettazione. */
export function legalVersion(id: LegalDocId): string {
  return LEGAL_DOCS[id].version;
}
