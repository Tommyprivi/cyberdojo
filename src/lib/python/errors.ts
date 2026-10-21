/**
 * Spiega in italiano i 6 errori Python più comuni. Si legge l'ultima riga della traceback
 * e si restituisce un suggerimento da mostrare SOTTO la traceback originale (che resta in inglese).
 */

export type ErrorHelp = { name: string; text: string };

const LAST_LINE = /^(SyntaxError|IndentationError|NameError|TypeError|ZeroDivisionError|IndexError)(?::\s*(.*))?$/;

export function explainPythonError(stderr: string): ErrorHelp | null {
  const lines = stderr
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter((l) => l.trim() !== "");
  // Cerca dal fondo: l'ultima riga che inizia con un nome di errore noto.
  let name = "";
  let detail = "";
  for (let i = lines.length - 1; i >= 0; i--) {
    const m = LAST_LINE.exec(lines[i].trim());
    if (m) {
      name = m[1];
      detail = m[2] ?? "";
      break;
    }
  }
  if (!name) return null;
  const lineNo = /File "<(?:esercizio|repl)>", line (\d+)/.exec(stderr)?.[1];
  const where = lineNo ? ` (vicino alla riga ${lineNo})` : "";

  switch (name) {
    case "SyntaxError":
      return {
        name,
        text:
          `Errore di sintassi${where}: Python non riesce a leggere la frase che hai scritto. ` +
          "Controlla questi tre punti: i due punti «:» alla fine di if, for, while e def; le parentesi e le virgolette, " +
          "che vanno chiuse; e la riga PRIMA di quella indicata, perché spesso l'errore sta lì.",
      };
    case "IndentationError": {
      let extra = "Le righe dentro un if, un ciclo o una funzione vanno spostate a destra di 4 spazi, tutte della stessa quantità.";
      if (/expected an indented block/.test(detail)) extra = "Dopo i due punti «:» la riga successiva deve essere spostata a destra di 4 spazi.";
      else if (/unexpected indent/.test(detail)) extra = "Questa riga è spostata a destra senza motivo: allineala con quella sopra.";
      else if (/unindent does not match/.test(detail)) extra = "Questa riga rientra in un punto che non corrisponde a nessun blocco sopra: allinea gli spazi.";
      return { name, text: `Errore di rientro${where}: in Python gli spazi a inizio riga contano. ${extra}` };
    }
    case "NameError": {
      const n = /name '([^']+)' is not defined/.exec(detail)?.[1];
      const who = n ? `«${n}»` : "un nome";
      return {
        name,
        text:
          `Python non conosce ${who}. Succede se lo scrivi in modo diverso da come l'hai creato (le maiuscole contano), ` +
          "se lo usi prima di creare la variabile con «=», o se dimentichi le virgolette attorno a un testo.",
      };
    }
    case "TypeError": {
      let extra = "Stai usando un tipo di dato dove ne serve un altro (per esempio un testo al posto di un numero).";
      if (/can only concatenate str/.test(detail)) extra = "Non puoi sommare un testo e un numero. Trasforma il numero in testo con str(numero), oppure il testo in numero con int(testo).";
      else if (/unsupported operand type/.test(detail)) extra = "Questa operazione non funziona tra questi due tipi di dato. Spesso basta convertire con int() o float().";
      else if (/not callable/.test(detail)) extra = "Hai messo le parentesi () dopo qualcosa che non è una funzione. Togli le parentesi o controlla il nome.";
      else if (/argument/.test(detail)) extra = "Il numero di valori passati alla funzione non è giusto: controlla quanti ne richiede.";
      return { name, text: `Errore di tipo${where}: ${extra}` };
    }
    case "ZeroDivisionError":
      return {
        name,
        text: `Hai diviso per zero${where}, e in matematica (e in Python) non si può. Controlla che il divisore non possa valere 0, per esempio con un «if» prima della divisione.`,
      };
    case "IndexError":
      return {
        name,
        text:
          `Hai chiesto un elemento che non esiste${where}. Gli indici partono da 0: una lista di 3 elementi ha gli indici 0, 1 e 2, ` +
          "mai 3. L'ultimo elemento è lista[len(lista) - 1], oppure lista[-1].",
      };
    default:
      return null;
  }
}
