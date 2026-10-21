/** Pagine di manuale brevi, in italiano, per i comandi del simulatore. Servono a `man` e a `--help`. */

export type ManPage = {
  syn: string;
  desc: string;
  opts?: [string, string][];
  ex?: [string, string][];
};

export const MAN: Record<string, ManPage> = {
  pwd: { syn: "pwd", desc: "Mostra la cartella in cui ti trovi adesso (percorso assoluto).", ex: [["pwd", "stampa per esempio /home/studente"]] },
  ls: {
    syn: "ls [OPZIONI] [FILE...]",
    desc: "Elenca il contenuto di una cartella.",
    opts: [
      ["-l", "formato lungo: permessi, proprietario, gruppo, dimensione, data"],
      ["-a", "mostra anche i file nascosti (quelli che iniziano con un punto)"],
      ["-h", "dimensioni leggibili (K, M) insieme a -l"],
      ["-R", "entra anche nelle sottocartelle"],
      ["-1", "un nome per riga"],
      ["-d", "mostra la cartella stessa, non il suo contenuto"],
      ["-r", "ordine inverso"],
    ],
    ex: [["ls -la", "tutto, anche i nascosti, con i dettagli"], ["ls -lh /var/log", "dimensioni leggibili"]],
  },
  cd: {
    syn: "cd [CARTELLA]",
    desc: "Cambia cartella. Senza argomenti torna alla home.",
    opts: [["~", "la tua home"], ["..", "la cartella sopra"], ["-", "l'ultima cartella in cui eri"]],
    ex: [["cd /var/log", "percorso assoluto (parte da /)"], ["cd ../Documenti", "percorso relativo"]],
  },
  cat: { syn: "cat [-n] [FILE...]", desc: "Mostra il contenuto dei file (e li concatena).", opts: [["-n", "numera le righe"]], ex: [["cat appunti.txt", "legge un file"]] },
  echo: { syn: "echo [-n] [-e] [TESTO...]", desc: "Stampa il testo. Con $VAR stampa il valore di una variabile.", opts: [["-n", "senza andare a capo"], ["-e", "interpreta \\n e \\t"]], ex: [["echo ciao > saluto.txt", "scrive «ciao» in un file"], ["echo $HOME", "stampa la home"]] },
  printf: { syn: "printf FORMATO [ARGOMENTI...]", desc: "Stampa con un formato (%s testo, %d numero, \\n a capo).", ex: [["printf '%s ha %d anni\\n' Ada 36", "formato con due valori"]] },
  mkdir: { syn: "mkdir [-p] CARTELLA...", desc: "Crea cartelle.", opts: [["-p", "crea anche le cartelle intermedie e non protesta se esistono"]], ex: [["mkdir -p progetti/web/css", "crea tutta la catena"]] },
  touch: { syn: "touch FILE...", desc: "Crea un file vuoto, o aggiorna la data di uno esistente.", ex: [["touch nota.txt", "crea nota.txt"]] },
  cp: { syn: "cp [-r] ORIGINE... DESTINAZIONE", desc: "Copia file e cartelle.", opts: [["-r", "copia anche le cartelle, con tutto il contenuto"]], ex: [["cp a.txt b.txt", "copia a.txt in b.txt"], ["cp -r foto backup/", "copia una cartella"]] },
  mv: { syn: "mv ORIGINE... DESTINAZIONE", desc: "Sposta o rinomina file e cartelle.", ex: [["mv vecchio.txt nuovo.txt", "rinomina"], ["mv nota.txt Documenti/", "sposta"]] },
  rm: {
    syn: "rm [-r] [-f] FILE...",
    desc: "Elimina file e cartelle. Non esiste il cestino: ciò che cancelli è perso. Nel laboratorio i percorsi di sistema sono bloccati.",
    opts: [["-r", "elimina anche le cartelle, con tutto il contenuto"], ["-f", "non chiede e non protesta se il file non esiste"]],
    ex: [["rm vecchio.txt", "elimina un file"], ["rm -r cartella", "elimina una cartella"]],
  },
  rmdir: { syn: "rmdir CARTELLA...", desc: "Elimina cartelle vuote.", ex: [["rmdir vuota", "funziona solo se la cartella è vuota"]] },
  head: { syn: "head [-n N] [FILE...]", desc: "Mostra le prime N righe (10 se non indichi N).", opts: [["-n N", "numero di righe"]], ex: [["head -n 3 auth.log", "le prime tre righe"]] },
  tail: { syn: "tail [-n N] [FILE...]", desc: "Mostra le ultime N righe (10 se non indichi N). Con -n +N parte dalla riga N.", opts: [["-n N", "numero di righe"]], ex: [["tail -n 5 auth.log", "le ultime cinque righe"]] },
  less: { syn: "less FILE", desc: "Legge un file lungo. Nel simulatore stampa tutto il file; nel vero less si scorre con le frecce e si esce con q.", ex: [["less /var/log/syslog", "legge un registro"]] },
  more: { syn: "more FILE", desc: "Come less, più semplice: legge un file pagina per pagina (qui stampa tutto).", ex: [["more appunti.txt", "legge un file"]] },
  wc: { syn: "wc [-l] [-w] [-c] [FILE...]", desc: "Conta righe, parole e byte.", opts: [["-l", "solo righe"], ["-w", "solo parole"], ["-c", "solo byte"]], ex: [["wc -l auth.log", "quante righe ha il registro"]] },
  sort: { syn: "sort [-r] [-n] [-u] [-f] [-t SEP] [-k N] [FILE...]", desc: "Ordina le righe.", opts: [["-r", "ordine inverso"], ["-n", "ordine numerico"], ["-u", "elimina i doppioni"], ["-f", "ignora maiuscole e minuscole"], ["-t SEP -k N", "ordina per il campo N, separato da SEP"]], ex: [["sort -nr numeri.txt", "dal più grande al più piccolo"]] },
  uniq: { syn: "uniq [-c] [-d] [-u] [-i] [FILE]", desc: "Toglie le righe uguali CONSECUTIVE (di solito si usa dopo sort).", opts: [["-c", "conta le ripetizioni"], ["-d", "solo righe ripetute"], ["-u", "solo righe uniche"]], ex: [["sort frutta.txt | uniq -c", "conta quante volte compare ogni riga"]] },
  cut: { syn: "cut -d SEP -f CAMPI [FILE...]", desc: "Taglia colonne da un testo.", opts: [["-d SEP", "il carattere che separa i campi (predefinito: tabulazione)"], ["-f LISTA", "campi da tenere: 1  1,3  2-4"], ["-c LISTA", "caratteri da tenere"]], ex: [["cut -d, -f1 utenti.csv", "prima colonna di un CSV"], ["cut -d: -f1 /etc/passwd", "i nomi utente"]] },
  grep: {
    syn: "grep [OPZIONI] MODELLO [FILE...]",
    desc: "Cerca righe che contengono un modello (anche un'espressione regolare).",
    opts: [["-i", "ignora maiuscole e minuscole"], ["-v", "mostra le righe che NON corrispondono"], ["-n", "mostra il numero di riga"], ["-c", "conta le righe invece di mostrarle"], ["-r", "cerca dentro le cartelle"], ["-l", "mostra solo i nomi dei file"], ["-E", "espressioni regolari estese"], ["-F", "modello letterale"], ["-w", "solo parole intere"]],
    ex: [["grep Failed auth.log", "righe con «Failed»"], ["grep -ci error syslog", "quante righe contengono error"], ["grep -rn password .", "in tutta la cartella"]],
  },
  find: {
    syn: "find [CARTELLA...] [CRITERI]",
    desc: "Cerca file e cartelle.",
    opts: [["-name MODELLO", "per nome (usa * e ?)"], ["-iname MODELLO", "per nome, ignorando le maiuscole"], ["-type f|d", "solo file (f) o cartelle (d)"], ["-maxdepth N", "profondità massima"], ["-user NOME", "di proprietà dell'utente"], ["-perm 644", "con quei permessi esatti"]],
    ex: [["find . -name '*.txt'", "tutti i .txt da qui in giù"], ["find /var/log -type f", "i file di /var/log"]],
  },
  file: { syn: "file FILE...", desc: "Dice di che tipo è un file (testo, cartella, script...).", ex: [["file registro.log", "registro.log: ASCII text"]] },
  tr: { syn: "tr [-d] INSIEME1 [INSIEME2]", desc: "Sostituisce o cancella caratteri (legge dalla pipe).", opts: [["-d", "cancella i caratteri dell'insieme"]], ex: [["echo ciao | tr a-z A-Z", "maiuscolo"]] },
  tee: { syn: "tee [-a] FILE...", desc: "Copia ciò che arriva dalla pipe sia sullo schermo sia nei file.", opts: [["-a", "aggiunge in fondo invece di sovrascrivere"]], ex: [["ls | tee elenco.txt", "mostra e salva"]] },
  chmod: {
    syn: "chmod [-R] MODO FILE...",
    desc: "Cambia i permessi. Modo ottale (r=4, w=2, x=1: 755, 644, 600) o simbolico (u+x, go-w, a=r).",
    opts: [["-R", "anche dentro le cartelle"], ["u g o a", "proprietario, gruppo, altri, tutti"], ["+ - =", "aggiunge, toglie, imposta"]],
    ex: [["chmod 600 segreto.txt", "solo il proprietario legge e scrive"], ["chmod +x script.sh", "rende eseguibile"], ["chmod go-rwx privato", "toglie tutto a gruppo e altri"]],
  },
  chown: { syn: "sudo chown [-R] UTENTE[:GRUPPO] FILE...", desc: "Cambia proprietario (e gruppo). Serve sudo.", ex: [["sudo chown alice file.txt", "ora è di alice"], ["sudo chown alice:lab file.txt", "proprietario e gruppo"]] },
  chgrp: { syn: "sudo chgrp [-R] GRUPPO FILE...", desc: "Cambia il gruppo di un file. Serve sudo.", ex: [["sudo chgrp lab file.txt", "ora appartiene al gruppo lab"]] },
  whoami: { syn: "whoami", desc: "Mostra il nome dell'utente con cui lavori." },
  id: { syn: "id [-u|-g|-n] [UTENTE]", desc: "Mostra identificativi e gruppi di un utente.", ex: [["id", "uid, gid e gruppi di studente"]] },
  groups: { syn: "groups [UTENTE]", desc: "Elenca i gruppi di un utente." },
  date: { syn: "date [+FORMATO]", desc: "Mostra data e ora (del simulatore).", ex: [["date +%F", "2026-10-20"], ["date '+%H:%M'", "solo l'ora"]] },
  uname: { syn: "uname [-a] [-r] [-s] [-m] [-n]", desc: "Informazioni sul sistema.", opts: [["-a", "tutto"], ["-r", "versione del kernel"]] },
  hostname: { syn: "hostname", desc: "Mostra il nome del computer." },
  env: { syn: "env", desc: "Mostra le variabili d'ambiente (quelle esportate)." },
  printenv: { syn: "printenv [VARIABILE]", desc: "Mostra una variabile d'ambiente, o tutte." },
  export: { syn: "export NOME=VALORE", desc: "Crea una variabile d'ambiente visibile ai programmi lanciati.", ex: [["export MIA=ciao", "poi: echo $MIA"]] },
  unset: { syn: "unset NOME", desc: "Cancella una variabile." },
  history: { syn: "history [N] [-c]", desc: "Mostra i comandi digitati. Le frecce su/giù li richiamano.", opts: [["-c", "cancella la cronologia"]] },
  clear: { syn: "clear", desc: "Pulisce lo schermo (anche Ctrl+L)." },
  man: { syn: "man COMANDO", desc: "Mostra il manuale di un comando (qui, versione breve in italiano).", ex: [["man ls", "il manuale di ls"]] },
  help: { syn: "help", desc: "Elenca i comandi del simulatore." },
  sudo: { syn: "sudo COMANDO...", desc: "Esegue un comando come amministratore (root). Nel laboratorio la password è lab123.", opts: [["-k", "dimentica la password"], ["-l", "mostra cosa puoi fare"]], ex: [["sudo cat /var/log/auth.log", "legge un file riservato"]] },
  ps: { syn: "ps [aux | -ef]", desc: "Mostra i processi (i programmi in esecuzione).", ex: [["ps aux", "tutti i processi"], ["ps aux | grep python", "cerca un processo"]] },
  top: { syn: "top", desc: "Mostra i processi ordinati per uso della CPU. Qui è un'istantanea." },
  kill: { syn: "kill [-9] PID...", desc: "Chiude un processo dato il suo PID (numero). -9 lo chiude con la forza.", ex: [["kill 2314", "chiude il processo 2314"]] },
  apt: { syn: "sudo apt update | install PACCHETTO | remove PACCHETTO | list --installed", desc: "Gestione dei programmi su Debian/Ubuntu. Qui è solo una simulazione: non scarica nulla.", ex: [["sudo apt update", "aggiorna l'elenco"], ["sudo apt install tree", "installa (finto)"]] },
  "apt-get": { syn: "sudo apt-get update | install PACCHETTO", desc: "Vecchio nome di apt. Qui equivale ad apt." },
  nano: { syn: "nano FILE", desc: "Editor di testo semplice. Nel simulatore si apre una finestra: Ctrl+S salva ed esce, Ctrl+X esce senza salvare.", ex: [["nano appunti.txt", "modifica un file"]] },
  which: { syn: "which COMANDO", desc: "Mostra dove si trova un comando." },
  basename: { syn: "basename PERCORSO", desc: "Estrae il nome del file da un percorso." },
  dirname: { syn: "dirname PERCORSO", desc: "Estrae la cartella da un percorso." },
  seq: { syn: "seq [INIZIO] FINE", desc: "Stampa una sequenza di numeri.", ex: [["seq 1 5", "1 2 3 4 5"]] },
  sleep: { syn: "sleep SECONDI", desc: "Aspetta (nel simulatore non aspetta davvero)." },
  uptime: { syn: "uptime", desc: "Da quanto tempo il sistema è acceso." },
  bash: { syn: "bash SCRIPT [ARGOMENTI]", desc: "Esegue uno script. Anche ./script.sh, se ha il permesso x.", ex: [["bash saluto.sh Ada", "esegue lo script con un argomento ($1)"]] },
  sh: { syn: "sh SCRIPT [ARGOMENTI]", desc: "Come bash." },
  test: { syn: "test ESPRESSIONE   oppure   [ ESPRESSIONE ]", desc: "Verifica una condizione (si usa con if). Esempi: -f file, -d cartella, -e esiste, -z testo vuoto, A = B, N -gt M.", ex: [["[ -f appunti.txt ] && echo esiste", "controlla un file"]] },
  true: { syn: "true", desc: "Non fa nulla e riesce sempre." },
  false: { syn: "false", desc: "Non fa nulla e fallisce sempre." },
  exit: { syn: "exit", desc: "Nel simulatore non chiude nulla: usa il pulsante Esci in alto." },
};

export function renderMan(name: string, page: ManPage): string {
  const lines: string[] = [];
  lines.push(`NOME\n    ${name}`);
  lines.push(`SINTASSI\n    ${page.syn}`);
  lines.push(`DESCRIZIONE\n    ${page.desc}`);
  if (page.opts?.length) lines.push("OPZIONI\n" + page.opts.map(([f, d]) => `    ${f.padEnd(14)} ${d}`).join("\n"));
  if (page.ex?.length) lines.push("ESEMPI\n" + page.ex.map(([c, d]) => `    ${c.padEnd(34)} # ${d}`).join("\n"));
  return lines.join("\n\n") + "\n";
}

export function renderHelp(name: string, page: ManPage): string {
  const lines = [`Uso: ${page.syn}`, page.desc];
  if (page.opts?.length) lines.push("", "Opzioni:", ...page.opts.map(([f, d]) => `  ${f.padEnd(14)} ${d}`));
  if (page.ex?.length) lines.push("", "Esempi:", ...page.ex.map(([c, d]) => `  ${c.padEnd(34)} # ${d}`));
  lines.push("", `(altre informazioni: man ${name})`);
  return lines.join("\n") + "\n";
}
