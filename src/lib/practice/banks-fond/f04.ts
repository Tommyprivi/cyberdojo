import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo F4 (Fondamenta IT, Linux e Reti). Una chiave per lezione: "f04-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 */
export const F04_ITEMS: Record<string, BankItem[]> = {
  // F.04.001 Redirezioni e pipe
  "f04-pipe": [
    { q: "Quale simbolo salva l'output di un comando in un file, cancellando il contenuto precedente?", ok: ">", no: [">>", "|", "<"] },
    { q: "Quale simbolo aggiunge l'output in fondo a un file senza cancellare quello che c'è già?", ok: ">>", no: [">", "|", "2>"] },
    { q: "Cosa fa il comando `ls | wc -l`?", ok: "Conta quante righe produce ls, cioè quanti elementi elenca", no: ["Salva l'elenco in un file chiamato wc", "Elenca il contenuto del file wc", "Conta le parole del file ls"] },
    { q: "Il file note.txt contiene 3 righe. Dopo `echo ciao >> note.txt` quante righe ha?", ok: "4", no: ["1", "3", "0"] },
    { q: "Il file note.txt contiene 3 righe. Dopo `echo ciao > note.txt` quante righe ha?", ok: "1", no: ["4", "3", "0"] },
    { q: "Quale canale devia il simbolo `2>`?", ok: "Lo stderr, cioè i messaggi di errore", no: ["Lo stdout, cioè il risultato normale", "Lo stdin, cioè l'ingresso", "Entrambi i canali di uscita"] },
    { q: "Cosa fa `comando 2> /dev/null`?", ok: "Butta via i messaggi di errore del comando", no: ["Salva l'output normale in un file chiamato null", "Cancella il file /dev/null", "Esegue il comando due volte"] },
    { q: "Quale comando manda sia l'output normale sia gli errori nello stesso file?", ok: "comando > tutto.txt 2>&1", no: ["comando > tutto.txt", "comando 2> tutto.txt", "comando | tutto.txt"] },
    { q: "Cosa stampa `cat accessi.log | head -n 2` se il file ha 8 righe?", ok: "Le prime due righe del file", no: ["Le ultime due righe del file", "Il numero 2", "Tutte le 8 righe"] },
    { q: "Che differenza c'è tra i simboli `>` e `|`?", ok: "> manda l'output verso un file, | lo manda verso un altro comando", no: ["> manda l'output a un altro comando, | lo manda in un file", "Sono equivalenti: cambia solo lo stile", "> sovrascrive i comandi, | li cancella"] },
    { q: "Cosa contiene a.txt dopo `echo uno > a.txt; echo due >> a.txt`?", ok: "uno e poi due, su due righe", no: ["Solo due", "Solo uno", "due e poi uno"] },
    { q: "Cosa fa `wc -l < note.txt`?", ok: "Legge note.txt come ingresso e stampa il numero di righe", no: ["Salva il numero di righe dentro note.txt", "Cancella le righe di note.txt", "Stampa il numero di parole di note.txt"] },
    { q: "Un comando stampa un errore sullo schermo anche se scrivi `comando > out.txt`. Perché?", ok: "Perché > devia solo lo stdout, non lo stderr", no: ["Perché out.txt non esiste ancora", "Perché serve >> al posto di >", "Perché gli errori non si possono mai deviare"] },
    { q: "Cosa stampa `cat accessi.log | head -n 5 | tail -n 1` se il file ha 8 righe?", ok: "La quinta riga del file", no: ["La prima riga del file", "L'ultima riga del file", "Le ultime cinque righe"] },
    { q: "Come si chiama il canale da cui un comando legge i dati in ingresso, di solito dalla tastiera?", ok: "stdin", no: ["stdout", "stderr", "stdlog"] },
  ],

  // F.04.002 grep
  "f04-grep": [
    { q: "Cosa stampa `grep ssh accessi.log`?", ok: "Le righe che contengono la parola ssh", no: ["Il numero di righe con ssh", "Le righe che non contengono ssh", "I nomi dei file che contengono ssh"] },
    { q: "Quale opzione di grep stampa il numero delle righe che corrispondono, invece delle righe stesse?", ok: "-c", no: ["-n", "-v", "-r"] },
    { q: "Quale opzione di grep mostra il numero di riga davanti a ogni risultato?", ok: "-n", no: ["-c", "-i", "-l"] },
    { q: "Quale opzione di grep stampa le righe che NON contengono il testo cercato?", ok: "-v", no: ["-i", "-n", "-r"] },
    { q: "Quale opzione di grep ignora la differenza tra maiuscole e minuscole?", ok: "-i", no: ["-v", "-c", "-r"] },
    { q: "Nel file c'è la parola FALLITO. Cosa stampa `grep fallito accessi.log`?", ok: "Niente, perché grep distingue maiuscole e minuscole", no: ["Tutte le righe con FALLITO", "Un errore: il file non esiste", "Il numero di righe con FALLITO"] },
    { q: "Quale comando cerca la parola errore in tutti i file della cartella logs?", ok: "grep -r errore logs/", no: ["grep -c errore logs/", "grep -v errore logs/", "cat logs/ | grep errore"] },
    { q: "Cosa trova `grep ^03 accessi.log`?", ok: "Le righe che iniziano con 03", no: ["Le righe che finiscono con 03", "Le righe che contengono 03 in qualunque punto", "Le righe che non contengono 03"] },
    { q: "Cosa trova `grep 'admin$' accessi.log`?", ok: "Le righe che finiscono con admin", no: ["Le righe che iniziano con admin", "Le righe che contengono admin e un dollaro", "Le righe che non contengono admin"] },
    { q: "Quale comando conta le righe di un file che NON contengono FALLITO?", ok: "grep -vc FALLITO file", no: ["grep -c FALLITO file", "grep -v FALLITO file | head", "grep FALLITO file | wc -w"] },
    { q: "Cosa fa `grep FALLITO accessi.log | grep admin`?", ok: "Stampa le righe che contengono sia FALLITO sia admin", no: ["Stampa le righe che contengono FALLITO oppure admin", "Stampa solo il numero di righe con admin", "Dà errore: non si possono usare due grep"] },
    { q: "Cosa significa se `grep -c FALLITO accessi.log` stampa 0?", ok: "Nessuna riga contiene FALLITO", no: ["Il comando è fallito per un errore", "FALLITO compare esattamente una volta", "Il file ha una sola riga"] },
    { q: "La parola root è nella riga 3 di utenti.txt. Cosa stampa `grep -n root utenti.txt`?", ok: "Il numero 3, due punti e la riga che contiene root", no: ["Solo la riga che contiene root", "Solo il numero 3", "Il numero di righe che contengono root"] },
    { q: "Perché si mettono le virgolette in `grep 'admin$' accessi.log`?", ok: "Perché la shell non interpreti il $ al posto di grep", no: ["Per cercare solo le parole intere", "Per ignorare le maiuscole", "Perché sono obbligatorie in ogni grep"] },
    { q: "Cosa stampa `grep -rl FALLITO logs/`?", ok: "I nomi dei file nella cartella logs che contengono FALLITO", no: ["Tutte le righe con FALLITO nella cartella logs", "Il numero di file nella cartella logs", "I file della cartella logs che non contengono FALLITO"] },
  ],

  // F.04.003 Ordinare e contare
  "f04-ordina": [
    { q: "Quale comando estrae la seconda colonna di accessi.log, con i campi separati da spazi?", ok: "cut -d' ' -f2 accessi.log", no: ["cut -f2 -d: accessi.log", "cut -c2 accessi.log", "cut -d' ' -f1 accessi.log"] },
    { q: "Perché in `sort | uniq -c` il comando sort va messo prima di uniq?", ok: "Perché uniq elimina e conta solo righe uguali che sono vicine", no: ["Perché uniq non sa leggere dalla pipe", "Perché sort toglie i duplicati", "Perché uniq ordina le righe in senso inverso"] },
    { q: "Cosa stampa `wc -l accessi.log` se il file ha 8 righe?", ok: "8 accessi.log", no: ["8", "accessi.log 8", "32"] },
    { q: "Cosa fa `uniq -c`?", ok: "Mette davanti a ogni riga il numero di volte che compare di seguito", no: ["Conta le lettere di ogni riga", "Ordina le righe per numero", "Elimina le righe che compaiono una volta sola"] },
    { q: "Quale comando ordina righe di numeri dal più piccolo al più grande?", ok: "sort -n", no: ["sort", "sort -r", "uniq -n"] },
    { q: "Con `sort` semplice, in quale ordine escono le righe 10, 9 e 100?", ok: "10, 100, 9", no: ["9, 10, 100", "100, 10, 9", "9, 100, 10"] },
    { q: "Un log ha 8 righe e 4 contengono FALLITO. Cosa stampa `grep FALLITO log | wc -l`?", ok: "4", no: ["8", "1", "12"] },
    { q: "Cosa stampa `echo ssh | tr a-z A-Z`?", ok: "SSH", no: ["ssh", "Ssh", "A-Z"] },
    { q: "Cosa stampa `echo 03:01 | tr -d ':'`?", ok: "0301", no: ["03 01", "03:01", "301"] },
    { q: "Cosa fa l'opzione `-rn` di sort?", ok: "Ordina i numeri dal più grande al più piccolo", no: ["Ordina i numeri dal più piccolo al più grande", "Toglie le righe duplicate", "Ordina in ordine alfabetico senza guardare i numeri"] },
    { q: "Quale pipeline mostra gli indirizzi (campo 2) di accessi.log con il numero di volte che compaiono?", ok: "cut -d' ' -f2 accessi.log | sort | uniq -c", no: ["cut -d' ' -f2 accessi.log | uniq -c | sort", "sort accessi.log | wc -l", "uniq -c accessi.log | cut -f2"] },
    { q: "Cosa stampa `echo mario:1001:/home/mario | cut -d: -f2`?", ok: "1001", no: ["mario", "/home/mario", "mario:1001"] },
    { q: "Cosa fa `tr -s ' '` su un testo con spazi ripetuti?", ok: "Riduce gli spazi ripetuti a uno solo", no: ["Toglie tutti gli spazi", "Sostituisce gli spazi con trattini", "Ordina le parole"] },
    { q: "Dopo `uniq -c`, quale comando mette in cima i conteggi più alti?", ok: "sort -rn", no: ["sort -n", "uniq -d", "wc -l"] },
    { q: "Cosa stampa `printf 'b\\na\\nb\\n' | sort | uniq -c`?", ok: "1 a e poi 2 b", no: ["2 b e poi 1 a", "1 a e poi 1 b", "3 a"] },
  ],

  // F.04.004 sed e awk
  "f04-sed-awk": [
    { q: "Cosa stampa `echo 'ssh ssh' | sed 's/ssh/web/'`?", ok: "web ssh", no: ["web web", "ssh ssh", "web"] },
    { q: "Cosa stampa `echo 'ssh ssh' | sed 's/ssh/web/g'`?", ok: "web web", no: ["web ssh", "ssh web", "ssh ssh"] },
    { q: "Quale comando sostituisce FALLITO con NEGATO in tutte le righe stampate, senza modificare il file?", ok: "sed 's/FALLITO/NEGATO/g' accessi.log", no: ["sed -i 's/FALLITO/NEGATO/g' accessi.log", "sed 'd/FALLITO/NEGATO/' accessi.log", "grep -s FALLITO NEGATO accessi.log"] },
    { q: "Cosa fa l'opzione -i di sed?", ok: "Modifica il file direttamente sul posto", no: ["Ignora maiuscole e minuscole", "Stampa solo le righe modificate", "Chiede conferma prima di cambiare"] },
    { q: "Cosa stampa `sed -n '2p' accessi.log`?", ok: "La seconda riga del file", no: ["Le prime due righe", "Il numero 2", "Tutte le righe tranne la seconda"] },
    { q: "Un file ha 8 righe e 2 contengono la parola web. Cosa stampa `sed '/web/d' accessi.log | wc -l`?", ok: "6", no: ["2", "8", "0"] },
    { q: "Cosa stampa `echo 'a b c' | awk '{print $2}'`?", ok: "b", no: ["a", "c", "a b c"] },
    { q: "Cosa contiene `$1` in un comando awk?", ok: "Il primo campo della riga", no: ["L'intera riga", "Il primo carattere della riga", "Il numero di righe"] },
    { q: "Cosa stampa `echo 'x:y:z' | awk -F: '{print $3}'`?", ok: "z", no: ["x", "y", "x:y:z"] },
    { q: "Cosa stampa `echo 'uno due' | awk '{print $2, $1}'`?", ok: "due uno", no: ["uno due", "due", "$2 $1"] },
    { q: "Cosa fa `awk '$4 == \"FALLITO\" {print $2}' accessi.log`?", ok: "Stampa la colonna 2 delle sole righe in cui la colonna 4 è FALLITO", no: ["Stampa tutte le righe che contengono FALLITO", "Conta le righe con FALLITO", "Stampa la colonna 4 di ogni riga"] },
    { q: "Se il file ha 8 righe, cosa stampa `awk '{n++} END {print n}' accessi.log`?", ok: "8", no: ["1", "0", "accessi.log"] },
    { q: "In awk, cosa indica `$0`?", ok: "L'intera riga", no: ["Il primo campo", "L'ultimo campo", "Il numero della riga"] },
    { q: "Quando conviene usare awk invece di cut?", ok: "Quando serve una condizione su una colonna o le colonne sono separate da più spazi", no: ["Quando si vuole modificare il file originale", "Quando si vogliono ordinare le righe", "Quando si cerca una parola in tutta la cartella"] },
    { q: "Cosa stampa `sed -n '3,5p'` su un file di 8 righe?", ok: "Le righe dalla 3 alla 5", no: ["Le righe 3 e 5 soltanto", "Le prime 5 righe tranne la 3", "Il numero 3,5"] },
  ],

  // F.04.005 Bash scripting 1
  "f04-bash1": [
    { q: "Cosa significa la prima riga `#!/bin/bash` di uno script?", ok: "Indica che lo script va eseguito con bash", no: ["È un commento ignorato anche dal sistema", "Cancella tutti i permessi del file", "Importa la cartella /bin/bash"] },
    { q: "Hai creato saluto.sh, ma `./saluto.sh` risponde «Permesso negato». Quale comando serve?", ok: "chmod +x saluto.sh", no: ["chmod -x saluto.sh", "Riscrivere lo shebang", "Rinominare il file in saluto.txt"] },
    { q: "Quale riga assegna correttamente la stringa mario alla variabile utente?", ok: "utente=mario", no: ["utente = mario", "$utente=mario", "utente := mario"] },
    { q: "Cosa stampa `n=3; echo Valore $n`?", ok: "Valore 3", no: ["Valore n", "Valore $n", "3 Valore"] },
    { q: "Cosa salva nella variabile n il comando `n=$(grep -c FALLITO accessi.log)`?", ok: "Il numero di righe che contengono FALLITO", no: ["Il testo del comando grep", "Le righe che contengono FALLITO", "Il nome del file accessi.log"] },
    { q: "Quale riga è scritta correttamente?", ok: "if [ \"$n\" -gt 3 ]; then", no: ["if [\"$n\" -gt 3]; then", "if [ \"$n\" > 3 ] then", "if \"$n\" -gt 3; then"] },
    { q: "Quale test controlla che accessi.log esista e sia un file normale?", ok: "[ -f accessi.log ]", no: ["[ -d accessi.log ]", "[ accessi.log -eq 0 ]", "[ accessi.log = file ]"] },
    { q: "Con quale parola si chiude un blocco if in bash?", ok: "fi", no: ["end", "done", "endif"] },
    { q: "Cosa significa un # all'inizio di una riga di script (non la prima)?", ok: "È un commento: bash lo ignora", no: ["È un comando di debug", "Cancella la riga successiva", "Indica una variabile"] },
    { q: "In un test numerico di bash, quale operatore significa «maggiore di»?", ok: "-gt", no: ["-lt", "-eq", "-ne"] },
    { q: "Perché si scrive `./script.sh` e non solo `script.sh`?", ok: "La cartella corrente non è tra quelle in cui il sistema cerca i programmi, quindi si indica il percorso", no: ["Il punto serve a rendere lo script eseguibile", "Il punto nasconde l'output", "Sono la stessa cosa in ogni caso"] },
    { q: "Cosa succede se in bash scrivi `nome = mario`, con gli spazi?", ok: "Bash cerca un comando chiamato nome e dà errore", no: ["Assegna mario a nome", "Crea un file chiamato mario", "Stampa mario"] },
    { q: "Uno script ha lo shebang ma non il permesso di esecuzione. Come si può comunque lanciarlo?", ok: "bash nomescript.sh", no: ["./nomescript.sh", "cat nomescript.sh", "exec nomescript.sh"] },
    { q: "Cosa stampa lo script con `FALLITI=4` e poi `if [ \"$FALLITI\" -gt 3 ]; then echo AVVISO; fi`?", ok: "AVVISO", no: ["Niente", "4", "FALLITI"] },
    { q: "A cosa serve la sintassi `$( ... )` in bash?", ok: "A usare l'output di un comando come valore", no: ["A calcolare somme", "A creare una funzione", "A commentare più righe"] },
  ],

  // F.04.006 Bash scripting 2
  "f04-bash2": [
    { q: "Cosa contiene `$#` dentro uno script?", ok: "Il numero di argomenti ricevuti", no: ["Il nome dello script", "L'ultimo argomento", "Il codice di uscita"] },
    { q: "Lanci `./analizza.sh accessi.log`. Cosa contiene `$1`?", ok: "accessi.log", no: ["./analizza.sh", "1", "Il numero di righe del file"] },
    { q: "Lanci `./analizza.sh accessi.log`. Cosa contiene `$0`?", ok: "./analizza.sh", no: ["accessi.log", "0", "Niente"] },
    { q: "Quale codice di uscita indica che un comando è andato a buon fine?", ok: "0", no: ["1", "-1", "255"] },
    { q: "Come si legge il codice di uscita dell'ultimo comando eseguito?", ok: "echo $?", no: ["echo $0", "echo $#", "echo $!"] },
    { q: "Cosa stampa `grep -q ZZZ accessi.log; echo $?` se ZZZ non c'è nel file?", ok: "1", no: ["0", "ZZZ", "Niente: grep -q non stampa mai"] },
    { q: "Cosa stampa `for p in a b c; do echo $p; done`?", ok: "a, b e c, ciascuno su una riga", no: ["Solo a", "abc su una riga sola", "c, b e a"] },
    { q: "Cosa stampa `n=1; while [ $n -le 3 ]; do echo $n; n=$((n+1)); done`?", ok: "1, 2 e 3 su tre righe", no: ["1, 2, 3 e 4", "Solo 1, all'infinito", "Niente"] },
    { q: "Cosa succede se in un ciclo while dimentichi di far avanzare il contatore?", ok: "Il ciclo non finisce mai, finché non lo interrompi con Ctrl+C", no: ["Il ciclo gira una volta sola", "Bash aggiunge il contatore da solo", "Il ciclo non parte"] },
    { q: "Cosa fa `set -e` all'inizio di uno script?", ok: "Ferma lo script al primo comando che fallisce", no: ["Stampa ogni comando prima di eseguirlo", "Ignora tutti gli errori", "Rende le variabili obbligatorie"] },
    { q: "Cosa fa `set -u` all'inizio di uno script?", ok: "Dà errore se si usa una variabile non assegnata", no: ["Rende lo script eseguibile", "Ferma lo script al primo errore", "Cancella le variabili alla fine"] },
    { q: "Perché è meglio scrivere `ls \"$f\"` invece di `ls $f` se il nome del file può contenere spazi?", ok: "Perché il nome resta un solo argomento anche se contiene spazi", no: ["Perché le virgolette rendono il file eseguibile", "Perché ls richiede sempre le virgolette", "Perché le virgolette cancellano gli spazi dal nome"] },
    { q: "Quale riga manda un messaggio di errore su stderr invece che sullo stdout?", ok: "echo \"Errore\" >&2", no: ["echo \"Errore\" > errore", "echo \"Errore\" | stderr", "echo \"Errore\" 2> &1"] },
    { q: "Cosa stampa `saluta() { echo Ciao $1; }; saluta Anna`?", ok: "Ciao Anna", no: ["Ciao $1", "Ciao", "saluta Anna"] },
    { q: "Uno script termina con `exit 2`. Cosa stampa `echo $?` subito dopo averlo lanciato?", ok: "2", no: ["0", "1", "Niente"] },
    { q: "Con `set -e`, perché `grep -c ZZZ file` può fermare lo script anche se non è un vero errore?", ok: "Perché grep esce con codice 1 quando non trova righe", no: ["Perché grep -c non funziona con set -e", "Perché stampa 0", "Perché set -e ferma ogni comando che stampa qualcosa"] },
    { q: "Cosa fa `comando1 && comando2`?", ok: "Esegue comando2 solo se comando1 ha avuto successo", no: ["Esegue sempre entrambi insieme", "Esegue comando2 solo se comando1 è fallito", "Passa l'output di comando1 a comando2"] },
  ],

  // F.04.007 cron
  "f04-cron": [
    { q: "Cosa significa la riga di crontab `30 2 * * *`?", ok: "Ogni giorno alle 02:30", no: ["Ogni giorno alle 30:02", "Ogni 30 minuti e ogni 2 ore", "Il giorno 30 del mese alle 02:00"] },
    { q: "Cosa significa la riga di crontab `*/15 * * * *`?", ok: "Ogni 15 minuti", no: ["Ogni 15 ore", "Alle 15:00 di ogni giorno", "Il giorno 15 di ogni mese"] },
    { q: "Cosa significa la riga di crontab `0 3 * * 1`?", ok: "Ogni lunedì alle 03:00", no: ["Il giorno 1 di ogni mese alle 03:00", "Ogni domenica alle 03:00", "Ogni ora fino alle 03:00"] },
    { q: "Cosa significa la riga di crontab `0 0 1 * *`?", ok: "Il primo giorno di ogni mese, a mezzanotte", no: ["Ogni giorno a mezzanotte", "Ogni lunedì a mezzanotte", "Una sola volta, il 1 gennaio"] },
    { q: "Cosa significa la riga di crontab `30 2 * * 1-5`?", ok: "Alle 02:30, dal lunedì al venerdì", no: ["Alle 02:30, solo nei giorni 1 e 5 del mese", "Alle 02:30, dal giorno 1 al giorno 5 di ogni mese", "Ogni 5 minuti dalle 02:30"] },
    { q: "Quanti campi di orario ha una riga di crontab prima del comando?", ok: "Cinque", no: ["Tre", "Quattro", "Sei"] },
    { q: "Qual è l'ordine dei cinque campi di una riga di crontab?", ok: "Minuto, ora, giorno del mese, mese, giorno della settimana", no: ["Ora, minuto, giorno, mese, anno", "Secondo, minuto, ora, giorno, mese", "Giorno, mese, anno, ora, minuto"] },
    { q: "Quale comando mostra le attività pianificate dell'utente corrente?", ok: "crontab -l", no: ["crontab -e", "crontab -r", "cron --list"] },
    { q: "Quale comando apre il crontab per modificarlo?", ok: "crontab -e", no: ["crontab -l", "crontab -r", "cron -e"] },
    { q: "Uno script funziona se lo lanci a mano, ma da cron dà «comando non trovato». Qual è la causa più probabile?", ok: "Cron ha un PATH minimo: serve il percorso assoluto del comando", no: ["Cron non sa eseguire gli script bash", "Lo script va rinominato con estensione .cron", "Cron funziona solo di notte"] },
    { q: "Come si scrive il simbolo % dentro un comando nel crontab?", ok: "\\%", no: ["%%", "$%", "%"] },
    { q: "A cosa serve aggiungere `>> /home/studente/cron.log 2>&1` a una riga di crontab?", ok: "A salvare in un file sia l'output sia gli errori del comando", no: ["A eseguire il comando due volte", "A far partire il comando in background", "A cancellare il file cron.log"] },
    { q: "Quale riga esegue /home/studente/backup.sh ogni giorno alle 03:15?", ok: "15 3 * * * /home/studente/backup.sh", no: ["3 15 * * * /home/studente/backup.sh", "15 3 * * 1 /home/studente/backup.sh", "* 3 15 * * /home/studente/backup.sh"] },
    { q: "Cosa fa il comando `crontab -r`?", ok: "Cancella l'intero crontab senza chiedere conferma", no: ["Mostra il crontab", "Esegue subito tutte le attività", "Rimuove solo l'ultima riga"] },
    { q: "Perché per provare una riga nuova conviene usare `* * * * *` con un comando innocuo?", ok: "Perché parte ogni minuto e si vede subito se funziona", no: ["Perché è l'unico orario valido per i test", "Perché cron esegue ogni riga una sola volta", "Perché evita di scrivere il percorso dello script"] },
  ],
};
