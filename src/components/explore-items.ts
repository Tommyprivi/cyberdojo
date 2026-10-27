/**
 * Tutte le funzioni dell'area riservata, per la pagina «Esplora» (grandi tasti da telefono).
 * Un solo elenco: aggiungere una funzione qui la fa comparire in Esplora.
 * `img` (disegno in public/img) ha la precedenza sull'emoji, che resta come ripiego.
 */
export type ExploreItem = { href: string; emoji: string; img?: string; label: string; text: string };
export type ExploreGroup = { title: string; items: ExploreItem[] };

export const EXPLORE_GROUPS: ExploreGroup[] = [
  {
    title: "Studia",
    items: [
      { href: "/percorso", emoji: "🧭", label: "Il tuo percorso", text: "Continua da dove eri rimasto" },
      { href: "/piano", emoji: "🗓️", label: "Piano di studio", text: "Tappe e consigli per i tuoi obiettivi" },
      { href: "/padronanza", emoji: "🥋", img: "/img/funzioni/prova-padronanza.png", label: "Prove di padronanza", text: "Dimostra un modulo e sblocca le lezioni" },
      { href: "/ripasso", emoji: "🔁", img: "/img/funzioni/ripasso.png", label: "Ripasso", text: "Rivedi ciò che stavi dimenticando" },
      { href: "/mappa", emoji: "🗺️", img: "/img/funzioni/mappa-sapere.png", label: "Mappa del sapere", text: "Cosa sai e cosa ti manca" },
      { href: "/segnalibri", emoji: "🔖", img: "/img/funzioni/segnalibro.png", label: "Segnalibri", text: "Le schermate che vuoi ritrovare" },
    ],
  },
  {
    title: "Cerca e allenati",
    items: [
      { href: "/cerca", emoji: "🔎", img: "/img/funzioni/cerca.png", label: "Cerca", text: "Trova una parola in tutte le lezioni" },
      { href: "/glossario", emoji: "📖", img: "/img/funzioni/glossario.png", label: "Glossario", text: "I termini spiegati in breve" },
      { href: "/sfida", emoji: "⚡", label: "Sfida del giorno", text: "Una domanda al giorno per tutti" },
      { href: "/pratica", emoji: "🧪", label: "Laboratorio", text: "Python, SQL, terminale e altro" },
      { href: "/pratica/calcolatrice", emoji: "🧮", label: "Calcolatrice", text: "Per i conti delle lezioni" },
    ],
  },
  {
    title: "Gioca",
    items: [
      { href: "/ctf", emoji: "🚩", img: "/img/funzioni/ctf-web.png", label: "Laboratori di hacking", text: "Trova la bandiera, con indizi" },
      { href: "/duelli", emoji: "⚔️", img: "/img/funzioni/duello.png", label: "Duelli", text: "Sfida un amico, a turni" },
      { href: "/leghe", emoji: "🏅", img: "/img/premi/lega-oro.png", label: "Leghe settimanali", text: "Sali di divisione con gli XP" },
      { href: "/eventi", emoji: "🎪", img: "/img/funzioni/eventi-dal-vivo.png", label: "Eventi dal vivo", text: "Appuntamenti a data fissa" },
      { href: "/negozio", emoji: "🛍️", img: "/img/negozio/moneta.png", label: "Negozio del Sensei", text: "Cappelli e colori con le monete" },
    ],
  },
  {
    title: "Il Sensei",
    items: [{ href: "/dojo", emoji: "🧠", img: "/img/mascotte/sensei-studia.png", label: "Chiedi al Sensei", text: "Il tutor risponde alle tue domande" }],
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
      { href: "/profilo/portfolio", emoji: "🗂️", img: "/img/funzioni/portfolio.png", label: "Portfolio", text: "Una pagina da mostrare (solo adulti)" },
      { href: "/app", emoji: "📱", img: "/img/funzioni/installa-app.png", label: "App Android", text: "Scarica l'app e verifica il file" },
      { href: "/profilo/notifiche", emoji: "🔔", img: "/img/funzioni/notifiche.png", label: "Notifiche", text: "Promemoria e novità, quando vuoi tu" },
      { href: "/certificato/F", emoji: "🎓", img: "/img/premi/certificato-pergamena.png", label: "Certificati", text: "Quando finisci un corso" },
    ],
  },
];
