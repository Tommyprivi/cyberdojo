/** Tipi di messaggio del modulo di contatto. Sta fuori dal file delle server action, che può esportare solo funzioni. */
export const CONTACT_KINDS = [
  { id: "domanda", label: "Ho una domanda" },
  { id: "bug", label: "Segnala un bug" },
  { id: "accessibilita", label: "Problema di accessibilità" },
  { id: "privacy", label: "Richiesta sui miei dati" },
  { id: "altro", label: "Altro" },
] as const;

export type ContactKind = (typeof CONTACT_KINDS)[number]["id"];