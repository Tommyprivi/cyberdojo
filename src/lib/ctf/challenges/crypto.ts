import { bytesOf, caesar, hexOf, int, mkFlag, pick, shownFlag, vigenere, WORDS } from "../gen";
import type { Challenge } from "../types";

const text = (title: string, body: string) => ({ kind: "text" as const, title, body });

export const CRYPTO: Challenge[] = [
  {
    id: "cesare-biglietto",
    title: "Il biglietto di Cesare",
    category: "crittografia",
    level: "facile",
    story: "In classe è passato un biglietto con un messaggio strano. Il tuo amico dice che ogni lettera è spostata in avanti di sempre lo stesso numero di posti nell'alfabeto.",
    goal: "Decifra il messaggio: l'ultima parola è la parola d'ordine. Scrivi la bandiera come CYBERDOJO{parola}.",
    hints: [
      "Un cifrario di Cesare sposta ogni lettera di un numero fisso (da 1 a 25). Spazi e punteggiatura restano uguali.",
      "Le parole corte aiutano: la prima parola italiana di due lettere è quasi certamente «la». Quanto devi spostare per ottenerla?",
      "Nella cassetta degli attrezzi c'è lo strumento Cesare: prova gli spostamenti finché il testo ha senso.",
    ],
    explanation: "Il cifrario di Cesare ha solo 25 chiavi possibili: basta provarle tutte (attacco a forza bruta) o indovinare lo spostamento da una parola corta come «la».",
    defense: "Un cifrario così semplice non protegge nulla. I sistemi veri usano cifrari moderni come AES con chiavi lunghe, mai algoritmi fatti in casa.",
    build: (r) => {
      const w = pick(r, WORDS);
      const k = int(r, 3, 23);
      return { flag: mkFlag(w), artifact: text("Il biglietto", caesar(`la parola d'ordine del club e ${w}`, k)) };
    },
  },
  {
    id: "base64-messaggio",
    title: "Il messaggio in Base64",
    category: "crittografia",
    level: "facile",
    story: "Nel registro di un sito di prova hai trovato una riga di lettere e numeri che finisce con «=». Sembra un messaggio nascosto.",
    goal: "Decodificalo: l'ultima parola è la parola d'ordine. Bandiera: CYBERDOJO{parola}.",
    hints: [
      "Il Base64 usa lettere, numeri, + e /, e spesso termina con uno o due «=».",
      "Base64 non è un segreto: è solo un modo di scrivere i dati con caratteri «comodi».",
      "Usa lo strumento Base64 della cassetta degli attrezzi e incolla il testo.",
    ],
    explanation: "Base64 è una codifica, non una cifratura: chiunque può tornare al testo originale senza chiave.",
    defense: "Non nascondere mai password o dati riservati con Base64: servono vera cifratura e controllo degli accessi.",
    build: (r) => {
      const w = pick(r, WORDS);
      return { flag: mkFlag(w), artifact: text("Riga del registro", Buffer.from(`la parola d'ordine del club e ${w}`).toString("base64")) };
    },
  },
  {
    id: "esadecimale-nota",
    title: "Numeri esadecimali",
    category: "crittografia",
    level: "facile",
    story: "Un compagno ti passa una nota scritta con coppie di cifre e lettere da A a F. Dice che ogni coppia è una lettera.",
    goal: "Converti i byte in testo: l'ultima parola è la parola d'ordine. Bandiera: CYBERDOJO{parola}.",
    hints: [
      "Ogni coppia di cifre esadecimali è un byte, cioè un carattere secondo la tabella ASCII.",
      "In ASCII 61 è «a», 62 è «b», 20 è lo spazio. Le lettere minuscole vanno da 61 a 7A.",
      "Lo strumento Esadecimale della cassetta degli attrezzi converte tutto in un colpo.",
    ],
    explanation: "Il testo al computer è fatto di numeri; l'esadecimale è un modo compatto di scriverli (2 cifre = 1 byte).",
    defense: "Scrivere un dato in esadecimale non lo protegge: è solo un'altra forma. Per proteggerlo serve la cifratura.",
    build: (r) => {
      const w = pick(r, WORDS);
      return { flag: mkFlag(w), artifact: text("La nota", hexOf(bytesOf(`la chiave e ${w}`)).toUpperCase()) };
    },
  },
  {
    id: "xor-chiave-nota",
    title: "XOR con chiave nota",
    category: "crittografia",
    level: "medio",
    story: "Un messaggio è stato mescolato con l'operazione XOR: ogni byte è combinato con lo stesso numero (la chiave). Qualcuno ha lasciato la chiave sul biglietto.",
    goal: "Applica di nuovo lo XOR con la chiave e leggi la parola d'ordine (ultima parola). Bandiera: CYBERDOJO{parola}.",
    hints: [
      "XOR ha una proprietà magica: fare XOR due volte con lo stesso numero riporta al valore di partenza.",
      "Prendi ogni byte (da esadecimale a numero), fai XOR con la chiave e traduci il risultato in lettera ASCII.",
      "Nella cassetta degli attrezzi c'è lo strumento XOR: inserisci i byte e la chiave in decimale.",
    ],
    explanation: "XOR con un solo byte ripetuto è debole: la stessa chiave serve per cifrare e decifrare, e basta indovinarla (sono solo 255) per leggere tutto.",
    defense: "Una chiave lunga quanto il messaggio e mai riusata (one-time pad) è sicura, ma poco pratica; nella realtà si usano cifrari a blocchi o a flusso moderni.",
    build: (r) => {
      const w = pick(r, WORDS);
      const key = int(r, 11, 90);
      const hex = hexOf(bytesOf(`la parola e ${w}`).map((b) => b ^ key)).toUpperCase();
      return { flag: mkFlag(w), artifact: text("Messaggio e chiave", `Chiave (decimale): ${key}\nByte (esadecimale): ${hex}`) };
    },
  },
  {
    id: "vigenere-club",
    title: "Il cifrario con la parola chiave",
    category: "crittografia",
    level: "medio",
    story: "Il club segreto usa un cifrario più furbo di Cesare: lo spostamento cambia lettera dopo lettera, seguendo una parola chiave (cifrario di Vigenère).",
    goal: "Con la chiave data, decifra il messaggio: l'ultima parola è la parola d'ordine. Bandiera: CYBERDOJO{parola}.",
    hints: [
      "Ogni lettera della parola chiave è uno spostamento: A=0, B=1, C=2... La chiave si ripete lungo il messaggio.",
      "Per decifrare si sposta all'indietro. Conta solo le lettere: gli spazi non consumano la chiave.",
      "Usa lo strumento Vigenère della cassetta degli attrezzi con la chiave scritta sul foglio.",
    ],
    explanation: "Vigenère resiste alla semplice forza bruta di Cesare, ma con una chiave corta e testo lungo si rompe studiando le frequenze delle lettere.",
    defense: "Si usano cifrari moderni (AES) e chiavi generate a caso, non parole da dizionario.",
    build: (r) => {
      const w = pick(r, WORDS);
      const key = pick(r, ["luna", "sole", "mare", "vela", "cielo"]);
      return { flag: mkFlag(w), artifact: text("Il foglio", `Chiave: ${key}\nMessaggio: ${vigenere(`la parola e ${w}`, key)}`) };
    },
  },
  {
    id: "xor-prefisso-noto",
    title: "XOR senza chiave: l'inizio si conosce",
    category: "crittografia",
    level: "difficile",
    story: "Un messaggio è cifrato con XOR e un solo byte di chiave, ma questa volta nessuno te la dice. Sai però come cominciano tutte le bandiere del dojo: CYBERDOJO{.",
    goal: "Ricava la chiave e decifra tutto il messaggio. Bandiera: la scritta intera CYBERDOJO{...}.",
    hints: [
      "Il primo carattere in chiaro è «C», cioè il numero 67 (esadecimale 43).",
      "Se cifrato = chiaro XOR chiave, allora chiave = cifrato XOR chiaro. Prova con il primo byte.",
      "Trovata la chiave, usala sullo strumento XOR della cassetta degli attrezzi su tutti i byte.",
    ],
    explanation: "È un attacco a testo in chiaro noto: se sai (o indovini) anche solo una parte del messaggio, la chiave salta fuori. Per questo i protocolli veri cominciano spesso con intestazioni prevedibili.",
    defense: "Non riusare mai una chiave breve e non cifrare dati con parti prevedibili usando cifrari deboli; usa cifrari autenticati moderni come AES-GCM.",
    build: (r) => {
      const w = pick(r, WORDS);
      const key = int(r, 5, 120);
      const flag = mkFlag(w);
      const hex = hexOf(bytesOf(shownFlag(flag)).map((b) => b ^ key)).toUpperCase();
      return { flag, artifact: text("Byte intercettati", hex) };
    },
  },
  {
    id: "strati-cifrati",
    title: "Due strati",
    category: "crittografia",
    level: "difficile",
    story: "Il messaggio è stato nascosto in due passaggi: prima è stato spostato con un cifrario di Cesare, poi il risultato è stato scritto in un'altra forma.",
    goal: "Togli gli strati nell'ordine giusto: l'ultima parola è la parola d'ordine. Bandiera: CYBERDOJO{parola}.",
    hints: [
      "Per aprire un pacco a più strati si toglie prima quello più esterno, cioè l'ultimo applicato.",
      "L'ultimo passaggio è stato scrivere il testo in Base64 (lettere, numeri e, spesso, «=» finali).",
      "Decodifica Base64, poi prova gli spostamenti di Cesare finché compare «la parola».",
    ],
    explanation: "Combinare due sistemi deboli non ne fa uno forte: ogni strato si toglie da solo, uno dopo l'altro.",
    defense: "La sicurezza viene da algoritmi pubblici e collaudati con chiavi segrete, non dal nascondere il metodo o dal sommare trucchi.",
    build: (r) => {
      const w = pick(r, WORDS);
      const k = int(r, 3, 23);
      return { flag: mkFlag(w), artifact: text("Dati intercettati", Buffer.from(caesar(`la parola e ${w}`, k)).toString("base64")) };
    },
  },
];
