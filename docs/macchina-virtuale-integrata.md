# Macchina virtuale integrata: ricerca, scelta e stato

Data: 2026-10-20. Richiesta del titolare: far provare Linux «vero» nel sito, senza dual boot e senza installare nulla.

## In breve

- **Scelta: v86** (emulatore x86 nel browser, licenza BSD-2-Clause) con un Linux a 32 bit molto piccolo (Buildroot).
- **Fatto:** pagina `/pratica/macchina-virtuale` (solo computer e tablet) e componente MDX `<VirtualMachine goal="..." />`. Partono solo dopo un clic su «Avvia». Provata nel browser integrato: Linux parte, i comandi di partenza funzionano.
- **Non serve** cambiare le intestazioni del sito: niente COOP/COEP, quindi i video YouTube incorporati non sono toccati.
- **Accanto** c'è il terminale simulato (`/pratica/terminale`, componente `<LinuxTerminal>`), che resta lo strumento principale per imparare i comandi: parte subito, pesa niente, non ha limiti di compatibilità.

## Confronto delle opzioni

| | v86 | CheerpX / WebVM | Altre (JSLinux, container2wasm, Wasmer/WebContainers) |
|---|---|---|---|
| Licenza | BSD-2-Clause, chiara | Licenza Community gratuita **solo** per individui (anche ditte individuali), progetti open source e valutazioni; per organizzazioni, scuole e non profit serve una licenza commerciale; l'hosting in proprio richiede la licenza commerciale. Il motore si carica dal dominio del fornitore | JSLinux: gratuito per uso personale, codice non libero; container2wasm: Apache-2.0 ma immagini enormi; WebContainers: solo Node.js |
| Scarico | circa 2 MB (wasm) + 0,4 MB (JS) + 10 MB (kernel Linux con root in memoria) = circa 13 MB | immagini disco a blocchi scaricate a richiesta, scarico iniziale basso ma serve la rete sempre | da 30 MB in su |
| Prestazioni | Emulazione 32 bit con compilazione a WebAssembly: avvio in pochi secondi, comandi leggeri ok, lento per carichi pesanti | Molto migliori (JIT x86 verso WebAssembly), Debian completa | variabili |
| Rete | Nessuna per impostazione predefinita: se non si indica un relay non esce nulla. Le modalità con relay/proxy esistono ma qui NON sono attivate | Tailscale o rete del fornitore: esce verso Internet | variabile |
| Requisiti | Nessuna intestazione speciale, funziona senza SharedArrayBuffer | SharedArrayBuffer, quindi COOP/COEP su tutta la pagina (rischio per YouTube e altri iframe) | variabili |
| Sicurezza | Gira nella sandbox del browser; si controlla ogni file con SHA-256 | Codice proprietario caricato da terzi | variabili |
| Offline | Sì, dopo il primo scarico (cache del browser) | Parziale | variabile |
| Manutenzione | Progetto attivo, pochi file da fissare | Dipende dal fornitore e dalla licenza | variabile |

**Perché non CheerpX:** la licenza gratuita copre persone singole e progetti open source; CyberDojo è una scuola e probabilmente un'attività con una società dietro, quindi servirebbe un contratto commerciale. In più richiede COOP/COEP e non permette l'hosting in proprio senza licenza. Riconsiderare solo se il titolare vuole una Debian completa e accetta di richiedere un preventivo a Leaning Technologies.

## Cosa scarica la pagina (tutto da indirizzi pubblici, nessun binario nel repository)

| File | Origine | Licenza |
|---|---|---|
| `libv86.js` (v0.5.472) | `cdn.jsdelivr.net/npm/v86@0.5.472/build/` | BSD-2-Clause |
| `v86.wasm` | stesso pacchetto npm | BSD-2-Clause |
| `seabios.bin`, `vgabios.bin` | `cdn.jsdelivr.net/gh/copy/v86@<commit>/bios/` | LGPL (SeaBIOS, SeaVGABIOS) |
| `buildroot-bzimage68.bin` (kernel Linux 6.8 con root Buildroot) | `i.copy.sh`, pubblicato dall'autore di v86 | GPL-2.0 (kernel Linux, Buildroot, BusyBox) |

Impronte SHA-256 e dimensioni sono in `src/lib/linux/vm-config.ts`. Prima di usare un file il browser ne calcola l'impronta: se non coincide, la VM non parte e compare un messaggio. Se un file cambia a monte, basta aggiornare impronta e indirizzo in quel file (comando per l'impronta: `openssl dgst -sha256 -binary FILE | openssl base64 -A`).

## Isolamento

- Non si passa nessuna opzione di rete a v86 (né `network_relay_url` né `net_device` con proxy): la macchina non ha nessun percorso verso Internet. Da dentro, `ping 8.8.8.8` non risponde.
- Il disco è in memoria (kernel con root incorporato): chiudere la pagina cancella tutto. «Ripristina» ricrea la macchina da zero, «Riavvia» la riaccende, «Spegni» la ferma.
- I file scaricati si chiedono con `credentials: "omit"` e `referrerPolicy: "no-referrer"`.

## Come funziona nel sito

- Pagina: `src/app/(lab)/pratica/macchina-virtuale/page.tsx` (layout laboratorio: sotto i 768 px compare l'avviso standard).
- Componente: `src/components/linux/virtual-machine.tsx`, usato anche nell'MDX come `<VirtualMachine goal="..." commands={["uname -a"]} />` (su telefono mostra un avviso al posto della macchina). `commands` sono i comandi di partenza cliccabili: vengono scritti nella macchina e premono Invio.
- La tastiera della VM si attiva cliccando sullo schermo nero e si disattiva cliccando fuori, così non ruba i tasti al resto della pagina.
- Nessuna modifica alle intestazioni globali: COOP/COEP non sono necessarie, quindi YouTube (nocookie) continua a funzionare.

## Limiti noti

- È **sperimentale**: è un Linux minimo (BusyBox), non Ubuntu. Mancano `sudo`, `apt`, `nano`, gli utenti multipli. Per i comandi del corso resta meglio il terminale simulato.
- Solo 32 bit, 64 MB di memoria: niente programmi pesanti.
- Dipende da due fornitori pubblici (jsDelivr e i.copy.sh). Se `i.copy.sh` sparisce, la pagina mostra un errore chiaro. Per eliminare la dipendenza il titolare può ospitare il file del kernel su Cloudflare R2 (13 MB) mantenendo licenza e crediti: richiede solo di cambiare l'indirizzo e l'impronta in `vm-config.ts`.
- Su schermi piccoli e telefoni non si apre (avviso).
- Non provato qui: Safari e Firefox (provato nel browser integrato di sviluppo, motore Chromium).

## Prossimi passi possibili

1. Ospitare in proprio il kernel (R2) per non dipendere da terzi.
2. Preparare un'immagine Buildroot personalizzata con `nano`, `grep` completo e qualche file di prova per le lezioni F2-F4, con script di costruzione nel repository (non il binario).
3. Se serve una Debian completa: chiedere un preventivo CheerpX e valutare COOP/COEP limitati alla sola route (`headers()` in `next.config.ts` solo per `/pratica/macchina-virtuale`), con YouTube non presente su quella pagina.
