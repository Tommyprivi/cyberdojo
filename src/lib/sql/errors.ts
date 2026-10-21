import { stripSql } from "./limits";

export type SqlErrorInfo = { message: string; code?: string; position?: number; detail?: string; hint?: string };

export type ExplainContext = { sql: string; tables?: string[]; columns?: string[] };

function distance(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

/** Il nome più simile a `wanted` tra `names` (differenza piccola), oppure null. */
export function closestName(wanted: string, names: string[] = []): string | null {
  const w = wanted.toLowerCase();
  let best: string | null = null;
  let bestD = Infinity;
  for (const n of new Set(names)) {
    const d = distance(w, n.toLowerCase());
    if (d < bestD) {
      best = n;
      bestD = d;
    }
  }
  return best !== null && bestD <= Math.max(2, Math.floor(w.length / 3)) ? best : null;
}

const quoted = (m: string, re: RegExp) => re.exec(m)?.[1];

/**
 * Spiega in italiano gli errori SQL più comuni. Restituisce il suggerimento da mostrare sotto il
 * messaggio originale (che resta in inglese, come lo scrive Postgres), o null se non c'è niente di utile.
 */
export function explainSqlError(err: SqlErrorInfo, ctx: ExplainContext): string | null {
  const m = err.message;
  const sql = stripSql(ctx.sql);
  switch (err.code) {
    case "42703": {
      const col = quoted(m, /column "([^"]+)"/);
      const bare = col?.split(".").pop();
      const guess = bare ? closestName(bare, ctx.columns) : null;
      return (
        `La colonna ${col ? `«${col}» ` : ""}non esiste in nessuna delle tabelle usate dalla query. Controlla come è scritto il nome (le colonne sono nell'elenco a sinistra).` +
        (guess ? ` Forse intendevi «${guess}»?` : "") +
        (/"[^"]*"/.test(ctx.sql) ? " Attenzione: i nomi tra virgolette doppie sono sensibili alle maiuscole; i testi vanno tra apici singoli ('così')." : "")
      );
    }
    case "42P01": {
      const t = quoted(m, /relation "([^"]+)"/);
      const guess = t ? closestName(t, ctx.tables) : null;
      return `La tabella ${t ? `«${t}» ` : ""}non esiste in questo database. Guarda l'elenco delle tabelle a sinistra: scrivi il nome esattamente così.` + (guess ? ` Forse intendevi «${guess}»?` : "");
    }
    case "42601": {
      const near = quoted(m, /at or near "([^"]*)"/);
      const hasJoin = /\bjoin\b/i.test(sql);
      if (hasJoin && !/\b(on|using)\b/i.test(sql)) {
        return "Un JOIN ha bisogno della condizione che dice come collegare le due tabelle: scrivi ON tabella1.colonna = tabella2.colonna subito dopo il nome della seconda tabella.";
      }
      const tips: string[] = [];
      if (near) tips.push(`Postgres si è bloccato vicino a «${near}»: il problema è lì o poco prima.`);
      else tips.push("Postgres si è bloccato alla fine del testo: forse manca qualcosa (una parola, una parentesi, un apice).");
      if (/,\s*(from|where|group|order)\b/i.test(sql)) tips.push("C'è una virgola di troppo prima di FROM, WHERE, GROUP BY o ORDER BY?");
      const opens = (sql.match(/\(/g) ?? []).length;
      const closes = (sql.match(/\)/g) ?? []).length;
      if (opens !== closes) tips.push("Le parentesi aperte e chiuse non sono in numero uguale.");
      if ((ctx.sql.match(/'/g) ?? []).length % 2 === 1) tips.push("C'è un apice ' aperto e mai chiuso.");
      tips.push("Controlla l'ordine delle parti: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY.");
      return `Errore di sintassi: la query non rispetta la grammatica SQL. ${tips.join(" ")}`;
    }
    case "42803":
      return "Quando usi un'aggregazione (COUNT, SUM, AVG...) insieme ad altre colonne, ogni colonna che non è dentro l'aggregazione deve comparire anche in GROUP BY. Aggiungila a GROUP BY, oppure toglila dalla SELECT.";
    case "42702":
      return "Il nome della colonna esiste in più di una tabella e Postgres non sa quale scegliere. Scrivi il nome della tabella davanti, per esempio clienti.id.";
    case "42883":
      return "Postgres non trova una funzione o un operatore adatto a questi tipi di dati. Spesso si confrontano o si sommano valori di tipo diverso (testo e numero): controlla i tipi delle colonne a sinistra.";
    case "42P07":
      return "Esiste già una tabella con questo nome. Scegli un altro nome oppure cancella la vecchia con DROP TABLE.";
    case "23505":
      return "Esiste già una riga con lo stesso valore in una colonna che deve essere unica (per esempio la chiave primaria o l'email).";
    case "23503":
      return "La chiave esterna non è rispettata: o il valore non esiste nella tabella collegata, o stai cancellando una riga a cui altre righe fanno ancora riferimento.";
    case "23502":
      return "Una colonna obbligatoria (NOT NULL) è rimasta vuota. Indica un valore per tutte le colonne obbligatorie.";
    case "23514":
      return "Il valore non rispetta un controllo (CHECK) della tabella, per esempio un voto fuori dall'intervallo o uno stato non previsto.";
    case "22P02":
      return "Il valore scritto non ha il formato giusto per il tipo della colonna (per esempio testo dove serve un numero o una data).";
    case "22012":
      return "Divisione per zero: il divisore vale 0 per almeno una riga.";
    default:
      return null;
  }
}

/** Avvisi su query che funzionano ma probabilmente non fanno quello che si vuole (prodotto cartesiano). */
export function detectWarnings(sql: string): string[] {
  const clean = stripSql(sql);
  const out: string[] = [];
  if (/\bcross\s+join\b/i.test(clean)) {
    out.push("CROSS JOIN abbina ogni riga della prima tabella con ogni riga della seconda (prodotto cartesiano): le righe si moltiplicano. Di solito serve un JOIN con la condizione ON.");
  } else {
    const from = /\bfrom\b([\s\S]*?)(?=\bwhere\b|\bgroup\b|\border\b|\blimit\b|\bhaving\b|\bunion\b|;|$)/i.exec(clean)?.[1] ?? "";
    const flat = from.replace(/\([^()]*\)/g, "");
    const hasComma = flat.includes(",");
    if (hasComma && !/\bjoin\b/i.test(flat) && !/\bwhere\b/i.test(clean)) {
      out.push("Hai elencato più tabelle dopo FROM senza una condizione WHERE: ogni riga viene abbinata a tutte le altre (prodotto cartesiano). Usa un JOIN ... ON oppure aggiungi la condizione in WHERE.");
    }
  }
  return out;
}
