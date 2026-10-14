# CyberDojo: decisioni vincolanti (integrano e, dove in conflitto, sostituiscono SPEC.md)

Data: 2026-10-13

## Stack (cambia rispetto alla spec: niente Supabase)
- Next.js (App Router), TypeScript, Tailwind, shadcn/ui, pnpm
- Database: **Neon Postgres** (pgAdmin come client). ORM: **Drizzle**. Controlli per utente lato server + policy RLS su Neon come seconda barriera
- Auth: **Better Auth**: email+password, magic link, Google
- Email: **Resend** (in sviluppo il magic link si stampa in console)
- Storage: **Cloudflare R2** dietro interfaccia sostituibile (disco locale in sviluppo)
- TTS: **ElevenLabs** dietro interfaccia indipendente dal fornitore, con provider finto per i test
- Segreti solo in `.env.local` (mai in chat, mai nel repository)

## Prodotto
- Nome: CyberDojo, in un'unica costante di configurazione
- "Reti" resta dentro Fondamenta (F5-F8)
- Nessun salto di lezioni. Il percorso consigliato cambia solo priorità e durata stimata
- Età: solo **fascia** (14-17, 18-25, 26-40, 41+) più dichiarazione di avere almeno 14 anni. Da rivedere con un consulente prima del lancio pubblico
- Test d'ingresso pratico di 5 domande dopo la registrazione, saltabile (se saltato si parte da F1)
- Percorso consigliato in base a: fascia d'età, test, obiettivo, minuti al giorno
- Nuovo modulo **C11 "Prossimi passi"**: link finali (piattaforme legali, documentazione ufficiale, certificazioni, CTF e comunità italiane, tutti verificati uno per uno con data di controllo) e tutorial completo per costruire un home lab a tre livelli (VM gratuite, mini PC usato, server). Nessun link di affiliazione
- Avvisi obbligatori nel lab: rete isolata, mai esposto a Internet, solo target propri o autorizzati, costi nascosti
- Gratis, nessun codice per pagamenti

## Qualità contenuti
- Stati: `draft` → `ai-reviewed` → `tested` (comandi in CI) → `published`
- `published` richiede l'approvazione esplicita del titolare. Per C8 (attacco etico) la revisione umana è obbligatoria
- Revisione IA con checklist fissa: correttezza tecnica, comandi, tono, accessibilità

## Design (sostituisce la sezione 8 della spec dove in conflitto)
- Stile chiaro e da gioco, ispirato agli esempi forniti dal titolare: verde tatami (principale), rosso sigillo (accento), cinture per i livelli. Tema chiaro predefinito; scuro e "sistema" a scelta.
- Font: **Fredoka** (titoli), **Nunito** (testo), **JetBrains Mono** (codice). Sostituiscono Bricolage Grotesque e IBM Plex.
- Mascotte: "Onigiri Sensei", bozza SVG generata, da sostituire.
- Su PC: navigazione in alto, esercizi affiancati, frecce ← → nelle lezioni, Invio passa alla domanda successiva.
- Lezioni facili da capire e da ricordare: un concetto per schermata, un'immagine concreta, riquadri Regola / Attenzione / Esempio / Trucco, prova interattiva, schede di ripasso alla fine.

## Sito
- Pubblici: home e **mappa dei corsi** (moduli, titoli, obiettivi). Lezioni, verifiche e progressi dietro account
- Estetica: moderna con tocchi dojo. Tema che segue il sistema, interruttore nel profilo
- Tono del Sensei: severo ma caldo
- Video: solo citazione del canale, nessun avviso ai creatori
- **Ogni lezione pubblicata ha un video** YouTube incorporato (nocookie, caricato al clic, massimo 10 minuti). Istruzioni: docs/video.md
- Lezioni come **casi** (SOC, log, pacchetti), tono del Sensei secco e un po' ironico, curiosità vere, niente paragoni da manuale

## Legale (tutte bozze da far controllare a un professionista)
Privacy, cookie, termini con uso etico, disclaimer sicurezza e lab, crediti e fonti, informativa minori, trattamento dati, esportazione e cancellazione GDPR, uso accettabile, divulgazione responsabile, voci sintetiche, contenuti di terzi, accessibilità.

## Licenze
- Contenuti: tutti i diritti riservati. Codice: MIT

## Asset
Logo, cinture, illustrazioni e schemi: li genero io come bozza marcata "placeholder generato". Li sostituisci tu quando vuoi.

## Laboratorio (sostituisce l'area "Allenati" come serie di esercizi)
Deciso il 2026-10-14. L'area Allenati diventa una **postazione di lavoro professionale**: strumenti veri a sinistra/al centro, il **tutor (Sensei)** di fianco che guida, spiega a cosa serve ogni cosa e dice «ricordati questo».
- **Strumenti, in questo ordine di lavoro:** terminale Linux simulato, analizzatore di pacchetti (stile Wireshark semplificato), calcolatore di rete (bit, esadecimale, subnet, CIDR), lettore di log del firewall.
- **Tre modalità del tutor:** *Guidato* (un passo alla volta, il successivo si apre solo se quello è giusto, errori spiegati), *Aiutami* (libero, suggerimenti a richiesta), *Da solo* (nessun aiuto, per mettersi alla prova).
- **«Ricordati»:** i punti da ricordare detti dal tutor si raccolgono in un taccuino per utente (richiede l'account).
- **Voce:** solo testo per ora; la voce del Sensei con ElevenLabs si aggancia nella fase audio.
- **Ordine dei lavori:** prima account (database Neon, Better Auth, salvataggio), poi il laboratorio.

## Animazioni (Percorso)
Deciso il 2026-10-14, su richiesta del titolare: mascotte (fluttua, sbatte le palpebre, code della fascia), schede dei numeri (entrata a scalare, fiamma e scintilla vive) e scheda «Prossimo caso» (luce sulla barra, onda sul pulsante, mascotte che spunta). Sostituisce la regola «movimento solo per XP/cintura/streak» per queste zone. Restano leggere e si fermano con «riduci movimento» del sistema. Il resto del sito resta fermo.

## Account, accesso e salvataggio (fatto il 2026-10-14)
- **Pubblico:** home, mappa dei corsi, pagine di accesso e registrazione. **Privato (serve l'account):** Percorso, lezioni, verifiche, profilo.
- **Registrazione:** nome, email, password (almeno 10 caratteri), fascia d'età, dichiarazione di avere almeno 14 anni (senza, non ci si registra), obiettivo, minuti al giorno, obiettivo giornaliero. Si accede anche con Google e con il link via email. Chi arriva senza profilo (Google, link) passa da «Benvenuto».
- **Ordine obbligatorio:** una lezione si apre solo se i prerequisiti sono completati, e il server lo controlla anche per la verifica.
- **Verifica registrata sul server:** il browser riceve solo un identificativo del tentativo, mai il seme né le risposte giuste. Un tentativo si valuta una volta sola.
- **XP:** lezione 10 + verifica 10 + 5 se primo tentativo perfetto, una sola volta per lezione (vincolo del database). Il numero scritto in `<Recap xp>` è ignorato.
- **Serie:** conta il giorno nel fuso dell'utente, solo se supera una verifica; +1 congelamento ogni 7 giorni (massimo 2); un congelamento copre un giorno saltato.
- **DECISIONE DA CONFERMARE (presa da me):** dopo `retries` tentativi falliti nelle ultime 24 ore si aspetta 24 ore dal primo errore (come per gli esami di modulo). La spec non lo diceva per le lezioni.
- **Bozze:** in produzione si vedono solo le lezioni `published`; in sviluppo anche le bozze, o con `SHOW_DRAFTS=1`.
- **GDPR:** dal profilo si scaricano tutti i propri dati (senza password né chiavi) e si cancella l'account con tutto ciò che contiene.
- **Non fatto:** test d'ingresso, verifica dell'email (serve Resend), obbligo di dichiarazione sulla privacy (le pagine legali non esistono ancora), blocco degli accessi ripetuti oltre quello di Better Auth.
