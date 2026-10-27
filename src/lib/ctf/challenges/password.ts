import { int, md5, mkFlag, pick, sample, sha1, sha256, shuffled, WORDS } from "../gen";
import type { Challenge } from "../types";

const WEAK = ["123456", "password", "qwerty", "ciao123", "iloveyou", "calcio2020", "abc123", "letmein", "admin123", "juventus", "sole1234", "dragon"];
const NAMES = ["marco", "giulia", "luca", "sara", "paolo", "elena", "andrea", "chiara"];

export const PASSWORD: Challenge[] = [
  {
    id: "hash-riconosci-md5",
    title: "Quale hash è il più vecchio?",
    category: "password",
    level: "facile",
    story: "Un sito di prova ha conservato la stessa parola con tre algoritmi diversi: MD5, SHA-1 e SHA-256, in ordine sparso. Uno di questi è considerato rotto da anni.",
    goal: "Riconosci quale riga è l'MD5. Bandiera: CYBERDOJO{md5_lettera}, con la lettera della riga in minuscolo (es. CYBERDOJO{md5_x}, dove x è la lettera).",
    hints: [
      "Un hash esadecimale ha lunghezze tipiche diverse a seconda dell'algoritmo.",
      "MD5 = 32 caratteri, SHA-1 = 40 caratteri, SHA-256 = 64 caratteri.",
      "Conta i caratteri di ogni riga (o usa lo strumento «Lunghezza» della cassetta degli attrezzi) e cerca quella da 32.",
    ],
    explanation: "Dalla lunghezza dell'hash si riconosce spesso l'algoritmo. MD5 e SHA-1 sono considerati deboli perché si possono generare collisioni e calcolare miliardi di tentativi al secondo.",
    defense: "Per le password non usare hash veloci come MD5, SHA-1 o SHA-256 semplice: usa funzioni lente pensate per le password (Argon2, bcrypt, scrypt) con un sale diverso per ogni utente.",
    build: (r) => {
      const w = pick(r, WORDS);
      const algos = shuffled(r, [md5(w), sha1(w), sha256(w)]);
      const letters = ["a", "b", "c"];
      return {
        flag: mkFlag(`md5_${letters[algos.findIndex((h) => h.length === 32)]}`),
        artifact: { kind: "table", title: "Tre hash della stessa parola", columns: ["Riga", "Hash"], rows: algos.map((h, i) => [letters[i].toUpperCase(), h]) },
      };
    },
  },
  {
    id: "hash-tabella-md5",
    title: "La tabella degli hash noti",
    category: "password",
    level: "medio",
    story: "Un database di prova inventato è stato «rubato» e contiene un hash MD5 senza sale. Il tuo laboratorio ha una tabella con gli hash delle password più usate (una tabella arcobaleno in miniatura).",
    goal: "Trova a quale password corrisponde l'hash rubato. Bandiera: CYBERDOJO{password}.",
    hints: [
      "Un hash non si «inverte», ma si può calcolare l'hash delle password probabili e confrontarlo.",
      "Confronta l'hash rubato (scritto nel titolo della tabella) con la colonna MD5, carattere per carattere.",
      "Controlla le prime e le ultime lettere: basta una riga che combacia.",
    ],
    explanation: "Senza sale, la stessa password dà sempre lo stesso hash: chi ha una tabella di password comuni le scopre in un attimo.",
    defense: "Aggiungi un sale casuale per ogni utente e usa funzioni lente (Argon2, bcrypt). Scegli password lunghe e uniche: non sono nelle tabelle.",
    build: (r) => {
      const pw = pick(r, WEAK);
      const rows = shuffled(r, WEAK).map((p) => [p, md5(p)]);
      return { flag: mkFlag(pw), artifact: { kind: "table", title: `Hash rubato: ${md5(pw)}`, columns: ["Password", "MD5"], rows } };
    },
  },
  {
    id: "hash-stessa-password",
    title: "Due utenti, una password",
    category: "password",
    level: "medio",
    story: "In una tabella inventata di utenti, le password sono salvate con MD5 senza sale. Due utenti hanno scelto la stessa password.",
    goal: "Trova i due utenti con lo stesso hash. Bandiera: CYBERDOJO{utente1_utente2} in ordine alfabetico (es. CYBERDOJO{elena_marco}).",
    hints: [
      "Stessa password e stesso algoritmo senza sale danno lo stesso hash.",
      "Cerca due righe con un hash identico: guarda l'inizio dell'hash per confrontarli in fretta.",
      "Scrivi i due nomi in ordine alfabetico, separati da un trattino basso.",
    ],
    explanation: "Gli hash uguali tradiscono password uguali: se una viene scoperta, lo sono tutte quelle identiche. Il sale evita proprio questo.",
    defense: "Un sale casuale diverso per utente rende diversi gli hash anche con password uguali, e impedisce di attaccare tutti insieme.",
    build: (r) => {
      const users = sample(r, NAMES, 6);
      const pws = sample(r, WEAK, 5);
      const hashes = [pws[0], pws[0], pws[1], pws[2], pws[3], pws[4]].map(md5);
      const order = shuffled(r, [0, 1, 2, 3, 4, 5]);
      const rows = order.map((i) => [users[i], hashes[i]]);
      const twins = [users[0], users[1]].sort();
      return { flag: mkFlag(`${twins[0]}_${twins[1]}`), artifact: { kind: "table", title: "Tabella utenti", columns: ["Utente", "MD5 della password"], rows } };
    },
  },
  {
    id: "hash-con-sale",
    title: "Hash con il sale",
    category: "password",
    level: "difficile",
    story: "Questa volta la password è salvata come SHA-256 di «sale + password». Il sale è noto, ma non c'è una tabella già pronta. Hai una lista corta di candidati.",
    goal: "Trova il candidato giusto. Bandiera: CYBERDOJO{password}.",
    hints: [
      "Per ogni candidato calcola l'hash di sale e candidato attaccati, in quest'ordine: sale+password.",
      "Nella cassetta degli attrezzi usa lo strumento SHA-256: incolla il sale seguito dal candidato, senza spazi.",
      "Confronta il risultato con l'hash salvato: quando combacia hai trovato la password.",
    ],
    explanation: "Il sale costringe l'attaccante a ricalcolare gli hash utente per utente: niente tabelle già pronte. Con una lista corta si prova comunque a mano.",
    defense: "Il sale non basta se l'hash è veloce: usa funzioni lente (Argon2, bcrypt), password lunghe e blocchi dopo troppi tentativi.",
    build: (r) => {
      const cands = sample(r, WORDS, 8);
      const pw = pick(r, cands);
      const salt = Array.from({ length: 6 }, () => "abcdef0123456789"[int(r, 0, 15)]).join("");
      return {
        flag: mkFlag(pw),
        artifact: { kind: "text", title: "Dati rubati", body: `Sale: ${salt}\nHash salvato: ${sha256(salt + pw)}\nCandidati: ${cands.join(", ")}` },
      };
    },
  },
];
