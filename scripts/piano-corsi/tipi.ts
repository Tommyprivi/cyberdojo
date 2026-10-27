/**
 * Piano dei 10 nuovi corsi (fonte unica). Da qui `scripts/genera-nuovi-corsi.ts` produce:
 *  - src/lib/content/courses-new.ts  (corsi e moduli, senza i titoli delle lezioni)
 *  - docs/nuovi-corsi.md             (briefing con tutti i titoli di lezione)
 *  - src/lib/practice/banks-nuovi/   (file vuoti delle domande, uno per modulo)
 * Struttura fissa: 5 blocchi x 4 moduli x 10 lezioni = 200 lezioni per corso.
 */
export type PianoModulo = {
  titolo: string;
  riassunto: string;
  /** Esattamente 10 titoli di lezione, separati da " | ", in ordine di studio. */
  lezioni: string;
  /** Se l'argomento è già coperto dai corsi esistenti: dove rimandare invece di ripetere. */
  rinvio?: string;
};

export type PianoBlocco = {
  titolo: string;
  descrizione: string;
  /** Esattamente 4 moduli. */
  moduli: PianoModulo[];
};

export type PianoCorso = {
  /** Lettera del corso: la prima parte dell'ID lezione (W.03.007). */
  id: string;
  /** Cartella in content/ e valore di `course:` nel frontmatter. */
  cartella: string;
  titolo: string;
  /** Presentazione per la pagina Corsi. */
  presentazione: string;
  perChi: string;
  /** Cosa conviene aver fatto prima (consiglio, non blocco: tutti i corsi nuovi si aprono da subito). */
  consigliato: string;
  /** Blocchi: sempre 5, dal facile al difficile. */
  blocchi: PianoBlocco[];
};
