import { dashed, int, mkFlag, pad2, pick, sample, shuffled, time, uniqueIps } from "../gen";
import type { Challenge } from "../types";

const USERS = ["marco", "giulia", "luca", "sara", "paolo", "elena", "andrea", "chiara"];
const FILES = ["bilancio.xlsx", "orario.pdf", "contratti.docx", "rubrica.csv", "verbali.docx", "listino.xlsx", "presentazione.pptx", "ordini.csv", "turni.pdf", "inventario.xlsx"];

/** Orari crescenti a partire da `start` secondi. */
function ticks(r: () => number, n: number, start: number, maxStep: number): number[] {
  const out: number[] = [];
  let t = start;
  for (let i = 0; i < n; i++) {
    t += int(r, 3, maxStep);
    out.push(t);
  }
  return out;
}

export const LOGS: Challenge[] = [
  {
    id: "firewall-intruso",
    title: "Chi bussa alla porta 22?",
    category: "log",
    level: "facile",
    story: "Il firewall di una piccola azienda inventata ha registrato una notte movimentata. Qualcuno continua a bussare alla porta 22 (l'accesso remoto SSH) e viene sempre respinto.",
    goal: "Trova l'indirizzo IP che ha tentato più volte la porta 22. Bandiera: CYBERDOJO{indirizzo} con i punti sostituiti da trattini (es. CYBERDOJO{1-2-3-4}).",
    hints: [
      "Cerca nel registro le righe con DENY e dst=10.0.0.5:22.",
      "Usa il filtro sopra il registro: scrivi «:22» e conta quante volte compare ogni indirizzo sorgente (src).",
      "L'intruso è l'indirizzo che compare molte più volte degli altri, sempre respinto sulla porta 22.",
    ],
    explanation: "Molti tentativi ravvicinati sulla stessa porta da un solo indirizzo sono il segno classico di una scansione o di un tentativo di indovinare le password (forza bruta).",
    defense: "Blocca automaticamente gli indirizzi che superano un certo numero di tentativi (fail2ban), limita SSH alle reti che servono, usa chiavi al posto delle password e l'autenticazione a due fattori.",
    build: (r) => {
      const [intruder, ...others] = uniqueIps(r, 9);
      const times = ticks(r, 32, 2 * 3600 + 900, 90);
      const kinds: string[] = [];
      const lines: string[] = [];
      for (let i = 0; i < 9; i++) kinds.push(`DENY TCP src=${intruder} dst=10.0.0.5:22`);
      for (const o of others.slice(0, 5)) kinds.push(`DENY TCP src=${o} dst=10.0.0.5:${pick(r, [23, 3389, 8080, 445])}`);
      while (kinds.length < 32) kinds.push(`ALLOW TCP src=10.0.0.${int(r, 20, 60)} dst=10.0.0.9:443`);
      shuffled(r, kinds).forEach((k, i) => lines.push(`2026-03-14 ${time(times[i])} ${k}`));
      return { flag: mkFlag(dashed(intruder)), artifact: { kind: "log", title: "Registro del firewall", lines } };
    },
  },
  {
    id: "file-notturno",
    title: "Il file modificato di notte",
    category: "log",
    level: "facile",
    story: "Dopo una violazione sospetta, l'informatico dell'ufficio (inventato) ti mostra l'elenco dei file di una cartella condivisa. Tutti sono stati toccati durante l'orario di lavoro, tranne uno.",
    goal: "Trova il file modificato fuori orario. Bandiera: CYBERDOJO{nome} (nome del file senza estensione).",
    hints: [
      "L'ufficio lavora dalle 09:00 alle 18:00: cerca un orario molto diverso.",
      "Guarda la colonna «Ultima modifica» e individua l'ora che non c'entra con gli altri.",
      "Il nome da scrivere è quello del file, senza il punto e l'estensione (per esempio senza «.xlsx»).",
    ],
    explanation: "Le date e gli orari di modifica sono tracce preziose per la forensica digitale: un'attività a notte fonda su un file importante merita sempre un controllo.",
    defense: "Attiva il registro degli accessi ai file, tieni copie di sicurezza e invia avvisi per modifiche fuori orario.",
    build: (r) => {
      const names = sample(r, FILES, 8);
      const odd = int(r, 0, 7);
      const rows = names.map((n, i) => {
        const when = i === odd ? `2026-03-14 ${pad2(int(r, 2, 4))}:${pad2(int(r, 0, 59))}` : `2026-03-1${int(r, 1, 3)} ${pad2(int(r, 9, 17))}:${pad2(int(r, 0, 59))}`;
        return [n, when, pick(r, USERS)];
      });
      const flag = mkFlag(names[odd].split(".")[0]);
      return { flag, artifact: { kind: "table", title: "Cartella condivisa", columns: ["File", "Ultima modifica", "Utente"], rows } };
    },
  },
  {
    id: "ssh-primo-accesso",
    title: "L'accesso dall'esterno",
    category: "log",
    level: "medio",
    story: "Il registro di accesso SSH di un server inventato contiene tentativi falliti e accessi riusciti. Gli indirizzi che cominciano con 10. o 192.168. sono interni all'azienda; gli altri arrivano da Internet.",
    goal: "Trova l'accesso riuscito (Accepted) che arriva da un indirizzo esterno. Bandiera: CYBERDOJO{utente-OraMinuti}, per esempio CYBERDOJO{utente-0000}.",
    hints: [
      "Filtra il registro con «Accepted»: sono pochi.",
      "Tra gli accessi riusciti, scarta quelli da indirizzi interni (10.x.x.x o 192.168.x.x).",
      "L'ora è nella parte iniziale della riga: scrivi ore e minuti senza i due punti, l'utente è dopo «for».",
    ],
    explanation: "Leggere un registro significa filtrare il rumore: gli accessi riusciti da posti insoliti sono il primo posto dove guardare.",
    defense: "Limita l'accesso SSH per indirizzo, richiedi chiavi o autenticazione a due fattori e avvisa quando un utente entra da un luogo nuovo.",
    build: (r) => {
      const [ext, ...rest] = uniqueIps(r, 4);
      const user = pick(r, USERS);
      const legit = pick(r, USERS);
      const times = ticks(r, 20, 3 * 3600, 400);
      const ev: string[] = [];
      for (let i = 0; i < 6; i++) ev.push(`Failed password for ${user} from ${ext} port ${int(r, 40000, 60000)} ssh2`);
      ev.push(`Accepted password for ${legit} from 192.168.1.${int(r, 10, 90)} port ${int(r, 40000, 60000)} ssh2`);
      ev.push(`Failed password for ${pick(r, USERS)} from ${rest[0]} port ${int(r, 40000, 60000)} ssh2`);
      for (let i = 0; i < 10; i++) ev.push(`Failed password for ${pick(r, USERS)} from ${pick(r, rest)} port ${int(r, 40000, 60000)} ssh2`);
      // l'accesso esterno riuscito viene dopo i sei tentativi falliti dello stesso indirizzo
      const order = shuffled(r, ev.slice(6));
      const seq = [...ev.slice(0, 6), ...order];
      const acceptedAt = int(r, 7, 17);
      seq.splice(acceptedAt, 0, `Accepted password for ${user} from ${ext} port ${int(r, 40000, 60000)} ssh2`);
      let hh = "";
      const lines = seq.slice(0, 20).map((e, i) => {
        const t = times[i];
        if (e.startsWith("Accepted") && e.includes(ext)) hh = `${pad2(Math.floor(t / 3600))}${pad2(Math.floor(t / 60) % 60)}`;
        return `Mar 14 ${time(t)} srv1 sshd[${int(r, 1000, 9999)}]: ${e}`;
      });
      return { flag: mkFlag(`${user}-${hh}`), artifact: { kind: "log", title: "Registro di accesso SSH", lines } };
    },
  },
  {
    id: "forza-bruta",
    title: "Chi è entrato davvero?",
    category: "log",
    level: "difficile",
    story: "Nel registro ci sono più indirizzi sospetti. Uno ha provato tanti accessi ma non è mai entrato. Un altro è entrato dall'esterno senza errori (un dipendente da casa). Uno solo ha fallito più volte e POI è entrato.",
    goal: "Trova l'utente violato e l'indirizzo dell'aggressore. Bandiera: CYBERDOJO{utente_indirizzo} con trattini nell'indirizzo (es. CYBERDOJO{nome_1-2-3-4}).",
    hints: [
      "Ti serve un indirizzo che abbia SIA righe «Failed» SIA una riga «Accepted».",
      "Filtra per «Accepted» e, per ogni indirizzo esterno, controlla se prima aveva fallito.",
      "Scarta chi è entrato senza fallimenti precedenti e chi ha solo fallito. L'utente è quello dopo «for» nella riga Accepted.",
    ],
    explanation: "Una serie di errori seguita da un successo è la firma di una forza bruta riuscita: l'aggressore ha indovinato la password.",
    defense: "Password lunghe e uniche, blocco dopo pochi errori, autenticazione a due fattori e avvisi sugli accessi riusciti subito dopo molti errori.",
    build: (r) => {
      const [bad, noisy, remote] = uniqueIps(r, 3);
      const [victim, other, worker] = sample(r, USERS, 3);
      const times = ticks(r, 40, 1 * 3600, 160);
      const ev: string[] = [];
      const fail = (u: string, ip: string) => `Failed password for ${u} from ${ip} port ${int(r, 40000, 60000)} ssh2`;
      for (let i = 0; i < 12; i++) ev.push(fail(pick(r, USERS), noisy));
      for (let i = 0; i < 9; i++) ev.push(fail(i < 7 ? victim : other, bad));
      for (let i = 0; i < 6; i++) ev.push(`Accepted password for ${other} from 10.0.0.${int(r, 10, 99)} port ${int(r, 40000, 60000)} ssh2`);
      const mixed = shuffled(r, ev);
      // l'accesso del dipendente da casa: nessun fallimento prima
      mixed.splice(int(r, 3, 12), 0, `Accepted password for ${worker} from ${remote} port ${int(r, 40000, 60000)} ssh2`);
      // l'accesso dell'aggressore: dopo l'ultimo suo fallimento
      const lastFail = mixed.map((e, i) => (e.includes(`from ${bad} `) ? i : -1)).reduce((a, b) => Math.max(a, b), -1);
      mixed.splice(lastFail + 1, 0, `Accepted password for ${victim} from ${bad} port ${int(r, 40000, 60000)} ssh2`);
      const lines = mixed.slice(0, 40).map((e, i) => `Mar 14 ${time(times[i])} srv1 sshd[${int(r, 1000, 9999)}]: ${e}`);
      return { flag: mkFlag(`${victim}_${dashed(bad)}`), artifact: { kind: "log", title: "Registro di accesso SSH", lines } };
    },
  },
];
