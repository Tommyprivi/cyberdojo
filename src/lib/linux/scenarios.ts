import { VFS, mkDir as d, mkFile as f } from "./fs";
import type { DirNode, FsNode } from "./types";
import { groupText, passwdText } from "./users";

export type ScenarioId = "base" | "logs" | "permessi" | "scripting";

export interface ScenarioInfo {
  id: ScenarioId;
  label: string;
  blurb: string;
  /** Obiettivo mostrato nel pannello del tutor. */
  goal: string;
  /** Cartella di partenza. */
  start: string;
  /** Comandi suggeriti (cliccabili). */
  commands: string[];
  /** Cose da provare, in ordine. */
  tasks: string[];
}

export const SCENARIOS: ScenarioInfo[] = [
  {
    id: "base",
    label: "Base",
    blurb: "La tua home con cartelle e file di prova.",
    goal: "Muoviti nelle cartelle, leggi i file, creane di nuovi e cerca dentro i testi.",
    start: "/home/studente",
    commands: ["pwd", "ls -la", "cd Documenti", "cat appunti.txt", "grep -n linux appunti.txt", "mkdir -p prove/uno", "sort frutta.txt | uniq -c", "man ls"],
    tasks: [
      "Scopri dove sei con pwd e guarda cosa c'è con ls -la.",
      "Entra in Documenti e leggi appunti.txt.",
      "Conta quante volte compare ogni frutto in frutta.txt (sort + uniq -c).",
      "Crea la cartella prove/uno in un colpo solo con mkdir -p.",
    ],
  },
  {
    id: "logs",
    label: "Registri (log)",
    blurb: "/var/log con auth.log e access.log fittizi.",
    goal: "Trova chi ha provato a entrare nel server: leggi i registri, filtra con grep e conta gli indirizzi.",
    start: "/var/log",
    commands: ["ls -lh", "sudo cat auth.log", "sudo grep Failed auth.log", "sudo grep -c Failed auth.log", "grep 404 access.log", "cut -d' ' -f1 access.log | sort | uniq -c | sort -nr", "tail -n 5 access.log"],
    tasks: [
      "Con ls -l nota chi può leggere auth.log: serve sudo.",
      "Conta i tentativi falliti: sudo grep -c Failed auth.log.",
      "Trova l'indirizzo IP più attivo in access.log (cut, sort, uniq -c, sort -nr).",
      "Cerca le richieste che hanno dato errore 404.",
    ],
  },
  {
    id: "permessi",
    label: "Permessi e utenti",
    blurb: "File con permessi diversi, proprietari e gruppi.",
    goal: "Capisci chi può leggere, scrivere ed eseguire cosa. Correggi i permessi con chmod e usa sudo quando serve.",
    start: "/home/studente/permessi",
    commands: ["ls -l", "id", "cat segreto.txt", "cat solo_root.txt", "chmod +x script.sh", "./script.sh", "chmod 600 diario.txt", "sudo chown alice di_alice.txt"],
    tasks: [
      "Leggi la colonna dei permessi con ls -l: rwx per proprietario, gruppo, altri.",
      "Prova a leggere solo_root.txt: perché non puoi? Poi riprova con sudo.",
      "Rendi eseguibile script.sh con chmod +x e lancialo con ./script.sh.",
      "Rendi diario.txt privato (chmod 600) e verifica con ls -l.",
    ],
  },
  {
    id: "scripting",
    label: "Script",
    blurb: "Una cartella con script da completare.",
    goal: "Completa gli script con nano, rendili eseguibili e lanciali. Poi prova cicli for e if.",
    start: "/home/studente/scripting",
    commands: ["cat LEGGIMI.txt", "nano saluto.sh", "chmod +x saluto.sh", "./saluto.sh Ada", "bash elenca.sh", "for f in *.txt; do echo $f; done", "echo $?"],
    tasks: [
      "Leggi LEGGIMI.txt e apri saluto.sh con nano.",
      "Completa i TODO, salva (Ctrl+S) e rendilo eseguibile.",
      "Lancia ./saluto.sh Ada e controlla l'esito con echo $?.",
      "Prova un ciclo for direttamente nel terminale.",
    ],
  },
];

export function scenarioInfo(id: ScenarioId): ScenarioInfo {
  return SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];
}

export const isScenarioId = (v: unknown): v is ScenarioId => SCENARIOS.some((s) => s.id === v);

const BASE_TIME = Date.UTC(2026, 9, 12, 9, 30);

const S = "studente";
const R = "root";

function setTimes(n: FsNode) {
  if (n.mtime === 0) n.mtime = BASE_TIME;
  if (n.kind === "dir") Object.values(n.children).forEach(setTimes);
}

const binStub = "[programma binario: il contenuto non si può leggere in questo simulatore]\n";

function systemRoot(home: Record<string, FsNode>, extraVarLog: Record<string, FsNode> = {}, extraRoot: Record<string, FsNode> = {}): DirNode {
  const bin: Record<string, FsNode> = {};
  for (const n of ["ls", "cat", "cp", "mv", "rm", "mkdir", "rmdir", "echo", "bash", "sh", "pwd", "chmod", "chown", "grep", "sleep", "ps", "kill", "date", "uname", "touch", "head", "tail", "sort", "less"]) {
    bin[n] = f(R, R, 0o755, binStub);
  }
  return d(R, R, 0o755, {
    bin: d(R, R, 0o755, bin),
    boot: d(R, R, 0o755, { "vmlinuz-6.8.0-45-generic": f(R, R, 0o600, binStub) }),
    dev: d(R, R, 0o755, { null: f(R, R, 0o666, ""), zero: f(R, R, 0o666, "") }),
    etc: d(R, R, 0o755, {
      passwd: f(R, R, 0o644, passwdText()),
      group: f(R, R, 0o644, groupText()),
      hostname: f(R, R, 0o644, "lab\n"),
      hosts: f(R, R, 0o644, "127.0.0.1 localhost\n127.0.1.1 lab\n"),
      issue: f(R, R, 0o644, "Ubuntu 24.04 LTS (laboratorio CyberDojo) \\n \\l\n"),
      "os-release": f(R, R, 0o644, 'PRETTY_NAME="Ubuntu 24.04 LTS"\nNAME="Ubuntu"\nVERSION_ID="24.04"\nID=ubuntu\n'),
      shadow: f(R, "shadow", 0o640, "root:!:20000:0:99999:7:::\nstudente:$y$j9T$finto$hashfinto:20000:0:99999:7:::\n"),
      sudoers: f(R, R, 0o440, "root ALL=(ALL:ALL) ALL\n%sudo ALL=(ALL:ALL) ALL\n"),
    }),
    home: d(R, R, 0o755, home),
    lib: d(R, R, 0o755, {}),
    opt: d(R, R, 0o755, {}),
    proc: d(R, R, 0o555, {}),
    root: d(R, R, 0o700, { "segreto_di_root.txt": f(R, R, 0o600, "Solo root può leggere questo file.\n") }),
    sbin: d(R, R, 0o755, {}),
    tmp: d(R, R, 0o777, { "lavoro_lungo.py": f(S, S, 0o644, "while True:\n    pass  # consuma la CPU all'infinito\n") }),
    usr: d(R, R, 0o755, { bin: d(R, R, 0o755, {}), lib: d(R, R, 0o755, {}), share: d(R, R, 0o755, {}), local: d(R, R, 0o755, {}) }),
    var: d(R, R, 0o755, {
      log: d(R, R, 0o755, extraVarLog),
      tmp: d(R, R, 0o777, {}),
      lib: d(R, R, 0o755, {}),
      www: d("www-data", "www-data", 0o755, { html: d("www-data", "www-data", 0o755, { "index.html": f("www-data", "www-data", 0o644, "<h1>Sito di prova</h1>\n") }) }),
    }),
    ...extraRoot,
  });
}

function dotfiles(): Record<string, FsNode> {
  return {
    ".bashrc": f(S, S, 0o644, "# ~/.bashrc: configurazione della shell\nexport EDITOR=nano\nPS1='\\u@\\h:\\w\\$ '\n"),
    ".profile": f(S, S, 0o644, "# ~/.profile: letto all'accesso\n"),
  };
}

function otherHomes(): Record<string, FsNode> {
  return {
    ospite: d("ospite", "ospite", 0o755, { "nota.txt": f("ospite", "ospite", 0o644, "Ciao, sono l'utente ospite.\n") }),
    alice: d("alice", "alice", 0o750, { "diario.txt": f("alice", "alice", 0o600, "Il diario privato di Alice.\n") }),
    bob: d("bob", "bob", 0o750, {}),
  };
}

function baseHome(): Record<string, FsNode> {
  return {
    ...dotfiles(),
    "benvenuto.txt": f(S, S, 0o644, "Benvenuto nel laboratorio Linux di CyberDojo!\nQui puoi sbagliare senza rompere nulla: è tutto simulato.\nProva: ls, cd Documenti, cat appunti.txt\n"),
    "frutta.txt": f(S, S, 0o644, "mela\npera\nbanana\nmela\narancia\nbanana\nmela\nkiwi\npera\n"),
    Documenti: d(S, S, 0o755, {
      "appunti.txt": f(S, S, 0o644, "Appunti di Linux\n----------------\nLinux è un sistema operativo libero.\nIl comando ls elenca i file.\nIl comando cd cambia cartella.\nCon grep si cerca nei file: Linux ama il testo.\nI permessi si cambiano con chmod.\nRicorda: su linux le maiuscole contano.\n"),
      "lista_spesa.txt": f(S, S, 0o644, "latte\npane\nuova\nmele\ncaffè\nbiscotti\n"),
      "relazione.md": f(S, S, 0o644, "# Relazione\n\nTitolo provvisorio.\n\n## Obiettivi\n- imparare la shell\n- non cancellare per sbaglio\n"),
      "utenti.csv": f(S, S, 0o644, "nome,città,ruolo\nAda,Torino,admin\nBruno,Roma,utente\nCarla,Milano,utente\nDario,Torino,utente\nElena,Roma,admin\nFabio,Torino,ospite\n"),
    }),
    Immagini: d(S, S, 0o755, { "gatto.jpg": f(S, S, 0o644, "[immagine simulata]\n"), "paesaggio.png": f(S, S, 0o644, "[immagine simulata]\n") }),
    Scaricati: d(S, S, 0o755, { "programma.zip": f(S, S, 0o644, "[archivio simulato]\n") }),
    Scrivania: d(S, S, 0o755, {}),
    appunti: d(S, S, 0o755, { "idee.txt": f(S, S, 0o644, "Idee per il laboratorio.\n") }),
    "accessi.log": f(S, S, 0o644, [
      "03:01 203.0.113.9 ssh FALLITO admin",
      "03:02 203.0.113.9 ssh FALLITO root",
      "03:02 198.51.100.7 web OK -",
      "03:05 203.0.113.9 ssh FALLITO admin",
      "03:07 192.168.1.66 ssh OK mario",
      "03:09 198.51.100.7 web OK -",
      "03:12 198.51.100.7 ssh FALLITO test",
      "03:15 192.168.1.20 ssh OK lucia",
      "",
    ].join("\n")),
    indagine: d(S, S, 0o755, {
      "registro.log": f(S, S, 0o644, [
        "09:01 login ok utente=anna",
        "09:05 login ok utente=marco",
        "09:12 login fallito utente=admin",
        "09:12 login fallito utente=admin",
        "09:13 login fallito utente=admin",
        "09:20 logout utente=anna",
        "",
      ].join("\n")),
      "note.txt": f(S, S, 0o644, "Note dell'indagine: tre accessi falliti di fila su admin.\n"),
      evidenze: d(S, S, 0o755, { "schermata.txt": f(S, S, 0o644, "[schermata simulata]\n") }),
    }),
    progetti: d(S, S, 0o755, {
      "README.txt": f(S, S, 0o644, "Cartella dei progetti.\n"),
      sito: d(S, S, 0o755, { "index.html": f(S, S, 0o644, "<html><body>Ciao</body></html>\n"), "stile.css": f(S, S, 0o644, "body { color: black; }\n") }),
    }),
  };
}

const pick = <T,>(arr: T[], i: number) => arr[i % arr.length];

function authLog(): string {
  const lines: string[] = [];
  const bad = ["185.220.101.4", "185.220.101.4", "45.155.205.233", "185.220.101.4", "103.77.192.18"];
  const users = ["root", "admin", "ubuntu", "root", "test", "oracle", "root"];
  let sec = 0;
  const ts = (h: number, m: number, s: number) => `Oct 20 ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  lines.push(`${ts(2, 58, 11)} lab sshd[1180]: Server listening on 0.0.0.0 port 22.`);
  for (let i = 0; i < 30; i++) {
    sec += 7 + (i % 5);
    const h = 3 + Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    const ip = pick(bad, i);
    const u = pick(users, i);
    const port = 40000 + i * 137;
    if (u !== "root" && i % 3 === 0) lines.push(`${ts(h, m, s)} lab sshd[${1200 + i}]: Invalid user ${u} from ${ip} port ${port}`);
    lines.push(`${ts(h, m, s)} lab sshd[${1200 + i}]: Failed password for ${u === "root" ? "root" : "invalid user " + u} from ${ip} port ${port} ssh2`);
  }
  lines.push(`${ts(9, 58, 3)} lab sshd[1190]: Accepted password for studente from 192.168.1.20 port 51234 ssh2`);
  lines.push(`${ts(9, 58, 3)} lab sshd[1190]: pam_unix(sshd:session): session opened for user studente(uid=1000) by (uid=0)`);
  lines.push(`${ts(10, 2, 41)} lab sudo:  studente : TTY=pts/0 ; PWD=/home/studente ; USER=root ; COMMAND=/usr/bin/apt update`);
  lines.push(`${ts(10, 2, 41)} lab sudo: pam_unix(sudo:session): session opened for user root(uid=0) by studente(uid=1000)`);
  lines.push(`${ts(10, 3, 12)} lab sshd[2001]: Failed password for studente from 192.168.1.20 port 51300 ssh2`);
  return lines.join("\n") + "\n";
}

function accessLog(): string {
  const lines: string[] = [];
  const clients: [string, string, string, number][] = [
    ["192.168.1.20", "GET /index.html HTTP/1.1", "200", 1534],
    ["192.168.1.21", "GET /stile.css HTTP/1.1", "200", 402],
    ["192.168.1.20", "GET /immagini/logo.png HTTP/1.1", "200", 20311],
    ["185.220.101.4", "GET /wp-login.php HTTP/1.1", "404", 153],
    ["185.220.101.4", "GET /.env HTTP/1.1", "404", 153],
    ["45.155.205.233", "GET /admin HTTP/1.1", "404", 153],
    ["192.168.1.22", "POST /contatti HTTP/1.1", "200", 821],
    ["185.220.101.4", "GET /phpmyadmin/ HTTP/1.1", "404", 153],
    ["192.168.1.20", "GET /vecchia-pagina HTTP/1.1", "301", 169],
    ["192.168.1.21", "GET /report HTTP/1.1", "500", 1021],
  ];
  for (let i = 0; i < 40; i++) {
    const [ip, req, code, size] = pick(clients, i * 3 + (i % 4));
    const m = Math.floor(i / 2);
    lines.push(`${ip} - - [20/Oct/2026:09:${String(10 + m).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")} +0000] "${req}" ${code} ${size} "-" "Mozilla/5.0"`);
  }
  return lines.join("\n") + "\n";
}

function syslog(): string {
  return [
    "Oct 20 02:58:10 lab systemd[1]: Started OpenBSD Secure Shell server.",
    "Oct 20 03:00:01 lab CRON[1301]: (root) CMD (/usr/local/bin/backup.sh)",
    "Oct 20 03:12:44 lab kernel: [UFW BLOCK] IN=eth0 SRC=185.220.101.4 DST=192.168.1.10 PROTO=TCP DPT=22",
    "Oct 20 04:00:01 lab CRON[1420]: (root) CMD (/usr/local/bin/backup.sh)",
    "Oct 20 09:15:02 lab nginx[701]: worker process started",
    "Oct 20 10:01:22 lab systemd[1]: Started lavoro_lungo.service.",
    "",
  ].join("\n");
}

function buildLogs(): DirNode {
  return systemRoot(
    { studente: d(S, S, 0o755, { ...dotfiles(), "note.txt": f(S, S, 0o644, "Compito: trova chi ha tentato di entrare nel server.\nIndizio: guarda auth.log e access.log in /var/log.\n") }), ...otherHomes() },
    {
      "auth.log": f(R, "adm", 0o640, authLog()),
      syslog: f(R, "adm", 0o640, syslog()),
      "access.log": f("www-data", "adm", 0o644, accessLog()),
      "error.log": f("www-data", "adm", 0o644, "2026/10/20 09:21:07 [error] 702#702: *4 open() \"/var/www/html/.env\" failed (2: No such file or directory)\n2026/10/20 09:24:55 [error] 702#702: *9 upstream timed out while reading response\n"),
      "dpkg.log": f(R, R, 0o644, "2026-10-12 09:30:11 install nginx:amd64 <none> 1.24.0\n2026-10-12 09:30:14 status installed nginx:amd64 1.24.0\n"),
    },
  );
}

function buildPermessi(): DirNode {
  return systemRoot({
    studente: d(S, S, 0o755, {
      ...dotfiles(),
      permessi: d(S, S, 0o755, {
        "pubblico.txt": f(S, S, 0o644, "Tutti possono leggere questo file.\n"),
        "diario.txt": f(S, S, 0o644, "Caro diario, oggi ho imparato chmod.\n"),
        "segreto.txt": f(S, S, 0o600, "Solo il proprietario legge e scrive qui.\n"),
        "solo_lettura.txt": f(S, S, 0o444, "Nessuno può modificare questo file (nemmeno tu, finché non cambi i permessi).\n"),
        "script.sh": f(S, S, 0o644, '#!/bin/bash\necho "Funziona! Lo script è stato eseguito."\n'),
        "eseguibile.sh": f(S, S, 0o755, '#!/bin/bash\necho "Io sono già eseguibile."\n'),
        "di_alice.txt": f("alice", "alice", 0o640, "Appunti di Alice: gli altri non possono leggerli.\n"),
        "config_root.conf": f(R, R, 0o644, "# configurazione di sistema, leggibile da tutti ma modificabile solo da root\nmodalita=sicura\n"),
        "solo_root.txt": f(R, R, 0o600, "Riservato a root.\n"),
        riservata: d(R, R, 0o700, { "chiave.txt": f(R, R, 0o600, "chiave-finta-1234\n") }),
        condiviso: d(S, "lab", 0o775, { "piano.txt": f(S, "lab", 0o664, "Piano del gruppo lab.\n") }),
      }),
    }),
    ...otherHomes(),
  });
}

function buildScripting(): DirNode {
  return systemRoot({
    studente: d(S, S, 0o755, {
      ...dotfiles(),
      scripting: d(S, S, 0o755, {
        "LEGGIMI.txt": f(S, S, 0o644, "Script da completare\n====================\n1. saluto.sh: salutare la persona il cui nome è il primo argomento ($1).\n2. backup.sh: creare la cartella backup e copiarci i file .txt.\n3. elenca.sh: già completo, serve da esempio (ciclo for).\nDopo aver modificato uno script ricordati di renderlo eseguibile: chmod +x nome.sh\n"),
        "saluto.sh": f(S, S, 0o644, '#!/bin/bash\n# Saluta la persona il cui nome arriva come primo argomento ($1).\n# TODO 1: se $1 è vuoto, stampa "Uso: ./saluto.sh NOME" ed esci con exit 1\n# TODO 2: stampa "Ciao NOME, benvenuto nel laboratorio!"\necho "Script incompleto: modificami con nano saluto.sh"\n'),
        "backup.sh": f(S, S, 0o644, '#!/bin/bash\n# Copia tutti i file .txt nella cartella backup.\nDEST=backup\necho "Copio i file in $DEST ..."\n# TODO: crea la cartella (mkdir -p) e copia i .txt (cp)\n'),
        "elenca.sh": f(S, S, 0o644, '#!/bin/bash\n# Elenca i file .txt con un ciclo for.\nfor f in *.txt; do\n  echo "File: $f"\ndone\n'),
        "dati.txt": f(S, S, 0o644, "uno\ndue\ntre\n"),
        "note.txt": f(S, S, 0o644, "Una nota qualsiasi.\n"),
      }),
    }),
    ...otherHomes(),
  });
}

/** Costruisce il filesystem di partenza di uno scenario (sempre nuovo: modificarlo non tocca gli altri). */
export function buildFs(id: ScenarioId): VFS {
  const root =
    id === "logs" ? buildLogs() : id === "permessi" ? buildPermessi() : id === "scripting" ? buildScripting() : systemRoot({ studente: d(S, S, 0o755, baseHome()), ...otherHomes() });
  setTimes(root);
  return new VFS(root);
}
