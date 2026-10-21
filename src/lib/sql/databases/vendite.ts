import type { SampleDatabase } from "./types";

const MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno"];
const GIORNI = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];

/** Date campione: il 5 e il 20 di ogni mese del primo semestre 2026. */
const date: { id: number; iso: string; mese: number; giorno: string }[] = [];
for (let m = 1; m <= 6; m++) {
  for (const g of [5, 20]) {
    const iso = `2026-${String(m).padStart(2, "0")}-${String(g).padStart(2, "0")}`;
    date.push({ id: Number(iso.replaceAll("-", "")), iso, mese: m, giorno: GIORNI[new Date(`${iso}T12:00:00Z`).getUTCDay()] });
  }
}

const prodotti: [number, string, string, string, number][] = [
  [1, "Tastiera meccanica", "Periferiche", "Tecnika", 79.9],
  [2, "Mouse wireless", "Periferiche", "Tecnika", 24.5],
  [3, "Monitor 24 pollici", "Monitor", "Visio", 139],
  [4, "Monitor 27 pollici", "Monitor", "Visio", 219],
  [5, "Cuffie con microfono", "Audio", "Sonora", 54.9],
  [6, "Altoparlanti USB", "Audio", "Sonora", 29.9],
  [7, "Hub USB-C", "Accessori", "Tecnika", 34.9],
  [8, "Zaino per portatile", "Accessori", "Viaggio+", 44],
];

/** Generatore pseudo-casuale con seme fisso: i fatti sono sempre gli stessi. */
function* casuale(seme: number): Generator<number> {
  let s = seme;
  for (;;) {
    s = (s * 1103515245 + 12345) % 2147483648;
    yield s / 2147483648;
  }
}
const rnd = casuale(2026);
const scegli = (n: number) => Math.floor((rnd.next().value as number) * n);

const fatti: string[] = [];
for (let i = 1; i <= 40; i++) {
  const d = date[scegli(date.length)];
  const p = prodotti[scegli(prodotti.length)];
  const negozio = 1 + scegli(4);
  const cliente = 1 + scegli(6);
  const quantita = 1 + scegli(4);
  const importo = Math.round(quantita * p[4] * 100) / 100;
  fatti.push(`(${i},${d.id},${p[0]},${negozio},${cliente},${quantita},${importo.toFixed(2)})`);
}

const q = (s: string) => `'${s.replaceAll("'", "''")}'`;

/** Schema a stella: una tabella dei fatti al centro e quattro dimensioni attorno. Per le lezioni sul data warehouse. */
export const vendite: SampleDatabase = {
  id: "vendite",
  title: "Vendite (schema a stella)",
  description: "Una tabella dei fatti con le vendite e quattro dimensioni: data, prodotto, negozio e cliente.",
  script: `
CREATE TABLE dim_data (
  data_id integer PRIMARY KEY,
  data date NOT NULL,
  anno integer NOT NULL,
  trimestre integer NOT NULL,
  mese integer NOT NULL,
  nome_mese text NOT NULL,
  giorno_settimana text NOT NULL
);
CREATE TABLE dim_prodotto (
  prodotto_id integer PRIMARY KEY,
  nome text NOT NULL,
  categoria text NOT NULL,
  marca text NOT NULL,
  prezzo_listino numeric(8,2) NOT NULL
);
CREATE TABLE dim_negozio (
  negozio_id integer PRIMARY KEY,
  nome text NOT NULL,
  citta text NOT NULL,
  regione text NOT NULL,
  canale text NOT NULL
);
CREATE TABLE dim_cliente (
  cliente_id integer PRIMARY KEY,
  segmento text NOT NULL,
  fascia_eta text NOT NULL,
  citta text NOT NULL
);
CREATE TABLE fatti_vendite (
  vendita_id integer PRIMARY KEY,
  data_id integer NOT NULL REFERENCES dim_data(data_id),
  prodotto_id integer NOT NULL REFERENCES dim_prodotto(prodotto_id),
  negozio_id integer NOT NULL REFERENCES dim_negozio(negozio_id),
  cliente_id integer NOT NULL REFERENCES dim_cliente(cliente_id),
  quantita integer NOT NULL,
  importo numeric(10,2) NOT NULL
);

INSERT INTO dim_data (data_id, data, anno, trimestre, mese, nome_mese, giorno_settimana) VALUES
${date.map((d) => `(${d.id},'${d.iso}',2026,${Math.ceil(d.mese / 3)},${d.mese},${q(MESI[d.mese - 1])},${q(d.giorno)})`).join(",\n")};

INSERT INTO dim_prodotto (prodotto_id, nome, categoria, marca, prezzo_listino) VALUES
${prodotti.map((p) => `(${p[0]},${q(p[1])},${q(p[2])},${q(p[3])},${p[4].toFixed(2)})`).join(",\n")};

INSERT INTO dim_negozio (negozio_id, nome, citta, regione, canale) VALUES
(1,'Milano Centro','Milano','Lombardia','Negozio'),
(2,'Roma Termini','Roma','Lazio','Negozio'),
(3,'Napoli Vomero','Napoli','Campania','Negozio'),
(4,'Sito web','Online','Online','Online');

INSERT INTO dim_cliente (cliente_id, segmento, fascia_eta, citta) VALUES
(1,'Privato','18-25','Milano'),
(2,'Privato','26-40','Roma'),
(3,'Azienda','41+','Milano'),
(4,'Privato','41+','Napoli'),
(5,'Azienda','26-40','Roma'),
(6,'Privato','26-40','Torino');

INSERT INTO fatti_vendite (vendita_id, data_id, prodotto_id, negozio_id, cliente_id, quantita, importo) VALUES
${fatti.join(",\n")};
`,
  examples: [
    { title: "I fatti (le vendite)", sql: "SELECT * FROM fatti_vendite;" },
    {
      title: "Incasso per mese (fatti + dimensione data)",
      sql: "SELECT d.mese, d.nome_mese, SUM(f.importo) AS incasso\nFROM fatti_vendite f\nJOIN dim_data d ON d.data_id = f.data_id\nGROUP BY d.mese, d.nome_mese\nORDER BY d.mese;",
    },
    {
      title: "Incasso per categoria di prodotto",
      sql: "SELECT p.categoria, SUM(f.quantita) AS pezzi, SUM(f.importo) AS incasso\nFROM fatti_vendite f\nJOIN dim_prodotto p ON p.prodotto_id = f.prodotto_id\nGROUP BY p.categoria\nORDER BY incasso DESC;",
    },
    {
      title: "Incasso per regione e canale",
      sql: "SELECT n.regione, n.canale, SUM(f.importo) AS incasso\nFROM fatti_vendite f\nJOIN dim_negozio n ON n.negozio_id = f.negozio_id\nGROUP BY n.regione, n.canale\nORDER BY incasso DESC;",
    },
    {
      title: "Quattro dimensioni insieme (cubo)",
      sql: "SELECT d.trimestre, p.categoria, c.segmento, SUM(f.importo) AS incasso\nFROM fatti_vendite f\nJOIN dim_data d ON d.data_id = f.data_id\nJOIN dim_prodotto p ON p.prodotto_id = f.prodotto_id\nJOIN dim_cliente c ON c.cliente_id = f.cliente_id\nGROUP BY d.trimestre, p.categoria, c.segmento\nORDER BY d.trimestre, incasso DESC;",
    },
    {
      title: "Subtotali con ROLLUP",
      sql: "SELECT d.trimestre, d.nome_mese, SUM(f.importo) AS incasso\nFROM fatti_vendite f\nJOIN dim_data d ON d.data_id = f.data_id\nGROUP BY ROLLUP (d.trimestre, d.nome_mese)\nORDER BY d.trimestre, d.nome_mese;",
    },
  ],
};
