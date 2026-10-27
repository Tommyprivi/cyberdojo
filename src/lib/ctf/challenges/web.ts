import { int, mkFlag, pick, sample, shuffled, WORDS } from "../gen";
import type { Challenge } from "../types";

const FIELDS = ["nome", "commento", "ricerca", "titolo", "soprannome", "messaggio"];

export const WEB: Challenge[] = [
  {
    id: "commento-dimenticato",
    title: "Il commento dimenticato",
    category: "web",
    level: "facile",
    story: "Il sito di una pizzeria inventata ha una pagina di prova. Gli sviluppatori hanno lasciato qualcosa nel codice della pagina, che ogni visitatore può leggere con «Visualizza sorgente».",
    goal: "Leggi il codice della pagina e trova il codice di servizio dimenticato. Bandiera: CYBERDOJO{codice}.",
    hints: [
      "In HTML i commenti iniziano con <!-- e finiscono con -->: il browser non li mostra, ma sono nel codice.",
      "Cerca nel sorgente una riga che comincia con «TODO».",
      "Il codice è la parte dopo «codice di servizio:», compresi trattino e numero.",
    ],
    explanation: "Tutto ciò che il server invia al browser, commenti compresi, può essere letto da chiunque. Nulla di segreto deve stare nel codice della pagina.",
    defense: "Prima di pubblicare togli commenti e dati di servizio, tieni i segreti solo sul server e usa controlli automatici che cercano chiavi dimenticate.",
    build: (r) => {
      const code = `${pick(r, WORDS)}-${int(r, 100, 999)}`;
      const body = [
        "<!doctype html>",
        "<html lang=\"it\">",
        "<head><title>Pizzeria Da Gino</title></head>",
        "<body>",
        "  <h1>Pizzeria Da Gino</h1>",
        "  <p>Aperti tutte le sere dalle 19.</p>",
        `  <!-- TODO: togliere prima di pubblicare - codice di servizio: ${code} -->`,
        "  <ul><li>Margherita</li><li>Diavola</li></ul>",
        "  <footer>Tel. 000 000 000</footer>",
        "</body>",
        "</html>",
      ].join("\n");
      return { flag: mkFlag(code), artifact: { kind: "text", title: "Sorgente della pagina", body } };
    },
  },
  {
    id: "sql-login-finto",
    title: "Il login ingenuo (SQL injection)",
    category: "web",
    level: "medio",
    story: "Un sito di prova INVENTATO, dentro questa pagina, controlla il login incollando quello che scrivi dentro la frase SQL. Non è collegato a nessun sistema vero: è un simulatore che mostra la frase che il sito costruirebbe.",
    goal: "Fai entrare il simulatore come amministratore senza conoscere la password e leggi la nota riservata. Bandiera: CYBERDOJO{...} scritta nella nota.",
    hints: [
      "Il simulatore mostra la frase SQL che costruisce. Guarda dove finisce il tuo testo: è tra apici ' '.",
      "Se nel campo nome scrivi un apice ' puoi chiudere la stringa prima del tempo. In SQL «--» trasforma in commento tutto ciò che segue.",
      "Prova nome: admin'--  (con la password vuota): il controllo della password finisce nel commento.",
    ],
    explanation: "Il programma si fida del testo dell'utente e lo mescola con il codice SQL. Chiudendo l'apice e aggiungendo un commento, chi scrive cambia la domanda fatta al database: è una SQL injection.",
    defense: "Usa query parametrizzate (prepared statement): i dati restano dati e non diventano mai codice. In più: password con hash e sale, account del database con pochi permessi, messaggi di errore generici.",
    build: (r) => {
      const flag = mkFlag(`${pick(r, WORDS)}-${int(r, 100, 999)}`);
      const rows = [
        { nome: "admin", password: `${pick(r, WORDS)}${int(r, 1000, 9999)}!`, note: `Pannello riservato. Bandiera: ${flag.replace("cyberdojo", "CYBERDOJO")}` },
        { nome: "mario", password: "ciao123", note: "" },
        { nome: "giulia", password: "qwerty", note: "" },
      ];
      return {
        flag,
        sql: { rows },
        artifact: {
          kind: "sqlform",
          variant: "login",
          title: "Login del sito di prova",
          schema: "Tabella utenti(nome, password, note). Frase usata dal sito:\nSELECT * FROM utenti WHERE nome = '…' AND password = '…'",
        },
      };
    },
  },
  {
    id: "xss-concetto",
    title: "Il campo che non si difende (XSS)",
    category: "web",
    level: "medio",
    story: "Un finto strumento di controllo ha provato a scrivere in ogni campo di un sito di prova il testo innocuo <b>ciao</b> e ha annotato se la pagina lo mostra come semplice testo oppure lo «interpreta» come codice HTML (grassetto). Non si esegue nulla: è un rapporto da leggere.",
    goal: "Trova il campo che interpreta il testo come codice. Bandiera: CYBERDOJO{xss_campo_numero-rapporto}, per esempio CYBERDOJO{xss_nomecampo_000}.",
    hints: [
      "Un sito sicuro mostra <b>ciao</b> esattamente così, come testo. Se lo mostra in grassetto, il testo è stato trattato come codice.",
      "Nella tabella leggi la colonna «Risultato»: un solo campo viene mostrato in grassetto.",
      "Il numero da usare è l'ID del rapporto scritto in alto; il campo va scritto in minuscolo.",
    ],
    explanation: "Il Cross-Site Scripting (XSS) nasce quando un sito mostra il testo di un utente senza «neutralizzarlo»: il browser lo scambia per codice del sito. Qui lo vedi solo come concetto, con un innocuo grassetto.",
    defense: "Fai l'escape dell'output (< diventa &lt;), usa framework che lo fanno da soli, imposta una Content-Security-Policy e cookie HttpOnly. Valida anche l'input, ma la difesa principale è l'escape in uscita.",
    build: (r) => {
      const fields = sample(r, FIELDS, 4);
      const bad = int(r, 0, 3);
      const id = int(r, 100, 999);
      const rows = fields.map((f, i) => [f, "<b>ciao</b>", i === bad ? "mostrato in GRASSETTO (interpretato come codice)" : "mostrato come testo: <b>ciao</b>"]);
      return {
        flag: mkFlag(`xss_${fields[bad]}_${id}`),
        artifact: { kind: "table", title: `Rapporto di controllo, ID ${id}`, columns: ["Campo", "Testo provato", "Risultato"], rows },
      };
    },
  },
  {
    id: "sql-ricerca-nascosta",
    title: "Il prodotto nascosto (SQL injection)",
    category: "web",
    level: "difficile",
    story: "Il negozio di prova INVENTATO mostra solo i prodotti con visibile = 1. Nel database finto c'è anche un prototipo segreto. La ricerca incolla il tuo testo dentro la frase SQL, tra % % e apici.",
    goal: "Fai comparire il prodotto nascosto con la ricerca e leggi la sua nota. Bandiera: CYBERDOJO{...} scritta nella nota.",
    hints: [
      "La frase termina con AND visibile = 1: è il filtro che nasconde il prototipo. Devi neutralizzarlo.",
      "Chiudi la stringa con un apice, aggiungi una condizione sempre vera come OR 1=1 e metti un commento (--) per far sparire il resto.",
      "Prova a cercare:  ' OR 1=1 --   (senza il commento il filtro o un errore di sintassi ti fermano).",
    ],
    explanation: "Senza il commento, il filtro AND visibile = 1 resta in piedi (AND pesa più di OR) oppure la frase si rompe. Il commento elimina il pezzo finale e la condizione sempre vera fa passare ogni riga.",
    defense: "Query parametrizzate e privilegi minimi: l'account che cerca prodotti non dovrebbe poter leggere dati riservati. Il filtro sui dati nascosti va applicato anche in modo indipendente dal testo scritto dall'utente.",
    build: (r) => {
      const flag = mkFlag(`${pick(r, WORDS)}-${int(r, 100, 999)}`);
      const names = shuffled(r, ["Penna", "Quaderno", "Zaino", "Righello", "Matite", "Gomma"]);
      const rows = [
        ...names.slice(0, 4).map((nome) => ({ nome, prezzo: int(r, 1, 30), note: "", visibile: 1 })),
        { nome: "Prototipo X", prezzo: 0, note: `Solo uso interno. Bandiera: ${flag.replace("cyberdojo", "CYBERDOJO")}`, visibile: 0 },
      ];
      return {
        flag,
        sql: { rows },
        artifact: {
          kind: "sqlform",
          variant: "search",
          title: "Ricerca nel negozio di prova",
          schema: "Tabella prodotti(nome, prezzo, note, visibile). Frase usata dal sito:\nSELECT nome, prezzo, note FROM prodotti WHERE nome LIKE '%…%' AND visibile = 1",
        },
      };
    },
  },
];
