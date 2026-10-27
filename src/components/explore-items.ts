/**
 * Tutte le funzioni dell'area riservata, per la pagina «Esplora» (grandi tasti da telefono).
 * Un solo elenco: aggiungere una funzione qui la fa comparire in Esplora.
 */
export type ExploreGroup = { title: string; items: { href: string; emoji: string; label: string; text: string }[] };

export const EXPLORE_GROUPS: ExploreGroup[] = [
  {
    title: "Studia",
    items: [
      { href: "/percorso", emoji: "🧭", label: "Il tuo percorso", text: "Continua da dove eri rimasto" },
      { href: "/piano", emoji: "🗓️", label: "Piano di studio", text: "Tappe e consigli per i tuoi obiettivi" },
      { href: "/padronanza", emoji: "🥋", label: "Prove di padronanza", text: "Dimostra un modulo e sblocca le lezioni" },
      { href: "/ripasso", emoji: "🔁", label: "Ripasso", text: "Rivedi ciò che stavi dimenticando" },
      { href: "/mappa", emoji: "🗺️", label: "Mappa del sapere", text: "Cosa sai e cosa ti manca" },
    ],
  },
  {
    title: "Cerca e allenati",
    items: [
      { href: "/cerca", emoji: "🔎", label: "Cerca", text: "Trova una parola in tutte le lezioni" },
      { href: "/glossario", emoji: "📖", label: "Glossario", text: "I termini spiegati in breve" },
      { href: "/sfida", emoji: "⚡", label: "Sfida del giorno", text: "Una domanda al giorno per tutti" },
      { href: "/pratica", emoji: "🧪", label: "Laboratorio", text: "Python, SQL, terminale e altro" },
      { href: "/pratica/calcolatrice", emoji: "🧮", label: "Calcolatrice", text: "Per i conti delle lezioni" },
    ],
  },
  {
    title: "Il Sensei",
    items: [{ href: "/dojo", emoji: "🧠", label: "Chiedi al Sensei", text: "Il tutor risponde alle tue domande" }],
  },
  {
    title: "Community",
    items: [
      { href: "/annunci", emoji: "📣", label: "Annunci", text: "Le novità, con reazioni" },
      { href: "/social", emoji: "💬", label: "Amici e classifiche", text: "Sfide, squadre e classifica per corso" },
    ],
  },
  {
    title: "Il tuo account",
    items: [
      { href: "/profilo", emoji: "🥷", label: "Profilo", text: "Cintura, serie e impostazioni" },
      { href: "/profilo/notifiche", emoji: "🔔", label: "Notifiche", text: "Promemoria e novità, quando vuoi tu" },
      { href: "/certificato/F", emoji: "🎓", label: "Certificati", text: "Quando finisci un corso" },
    ],
  },
];
