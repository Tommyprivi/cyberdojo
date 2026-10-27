# CyberDojo: stato del progetto (passaggio di consegne tra IA)

Aggiornato: 27 ottobre 2026. Chi subentra legge QUESTO file per primo, poi `AGENTS.md`, `DECISIONS.md`, `docs/lavori-da-fare.md`.
Titolare: non tecnico, vuole risposte in italiano semplice, brevi. Tono del sito: Sensei severo ma caldo. Tutto gratuito, nessun abbonamento, nessuna pubblicità.

## Regole di lavoro (obbligatorie)
1. Una sola IA alla volta scrive nella cartella. Prima di toccare un file controlla `git status` e non rifare ciò che esiste.
2. Mai incollare chiavi, token o password in chat né nei file di git. Segreti solo in `.env.local` e su Vercel.
3. Per i sorgenti usare Edit, mai script che riscrivono file interi (in passato hanno svuotato file).
4. Migrazioni sul database vero: SOLO con copia di sicurezza fatta lo stesso giorno (`pnpm db:backup`, poi `pnpm db:migrate:prod -- --backup backups/<file>`). Il sistema di sicurezza blocca l'IA su questo comando: lo lancia il titolare.
5. Minori dai 14 anni: niente chat libera, niente messaggi tra utenti, niente testo libero pubblico. "Mentore" con messaggi: NON si fa.
6. Contenuti di finanza: solo educazione, mai consulenza. Nessuna istruzione per attaccare sistemi reali.
7. Regola "nessun salto" (DECISIONS.md): si sblocca una lezione solo completando i prerequisiti, oppure superando la prova di padronanza del modulo (nessun XP).
8. Prima di dire "finito": tipi (`npx tsc --noEmit`), test (`npx vitest run`), `npx next build`.

## Dove sta cosa
- Codice: `C:\Users\privi\Nuova cartella\cyberdojo` (Next.js 16 con Cache Components, Better Auth, Drizzle + Neon, RLS).
- GitHub: `Tommyprivi/cyberdojo`, branch `main` (ultimo commit al 27/10: `2bf3e82`).
- Sito online: `https://cyberdojo-nine.vercel.app` (Vercel, progetto `cyberdojo`). Versione online = quella del 24 ottobre, NON ancora la 2.0.
- Il sito è in manutenzione con conto alla rovescia fino al 31 ottobre 2026 ore 15:00 (`content/countdown.json`, `src/proxy.ts`).
- Database: Neon, UN SOLO database (sviluppo e produzione coincidono: 16 utenti, quasi tutti di prova). Rami `dev` e `preview` da creare.
- Email: Resend, funziona solo verso l'indirizzo del titolare finché non c'è un dominio verificato.
- Login: email e password, link magico, 2FA. Google TOLTO.
- App Android: configurata in `android/twa-manifest.json`, guida `docs/android.md`. Java 17 installato; Android SDK NON installato (le licenze Google le accetta il titolare). Si costruisce UNA volta alla fine.

## Funzioni: cosa esiste nel codice
Legenda: ONLINE = sul sito pubblico; CODICE = scritto, testato con test automatici, nel repository, non ancora online né provato a schermo.

### Base (ONLINE)
- Registrazione, accesso, recupero password, 2FA, profilo, promemoria email, pagine legali (privacy, termini, cookie, minori, accessibilità, contatti).
- 5 corsi con 522 lezioni (F Fondamenta, C Cybersecurity, D Dati, T Trading con Python, H Hedge fund); 518 pubblicate (con video YouTube con consenso), 4 bozze senza video.
- Strumenti nel browser: terminale Python (Pyodide), SQL (PGlite), terminale Linux simulato, macchina virtuale (v86), laboratorio.
- AI Dojo (tutor, chiave Groq in `.env.local`/Vercel), social base (classifica, amici con codice, gruppi, sfide settimanali), banner novità.

### Aggiornamento 2.0 (CODICE, commit f3cb360)
Percorso e studio: sentiero del modulo, test d'ingresso (5 corsi), prove di padronanza per modulo (80%, nessun XP), livelli Base/Medio/Avanzato, tutorial di 4 schermate, ripasso intelligente (scatole Leitner), mappa del sapere, piano di studio, ricerca (/cerca), glossario (108 termini) con parole cliccabili nelle lezioni, sfida del giorno, appunti, segnalibri, certificato di fine corso con verifica pubblica.
App: menu «Esplora», calcolatrice sicura (senza eval), sito installabile (manifest, icone, pagina offline), studio offline per le ultime 30 lezioni aperte, modalità app (transizioni, vibrazione, tasti grandi).
Notifiche push (Android e PC; spente finché mancano le chiavi VAPID), riepilogo settimanale via email.
Community: pannello annunci per staff (/annunci/scrivi), reazioni emoji, commenti a frasi pronte (niente testo libero), classifica per corso, confronto squadre, novità viste salvate sull'account, leghe settimanali, eventi dal vivo (content/events.json).
Divertimento: negozio con monete (solo punti di gioco), 20+ laboratori CTF simulati con indizi, duelli a turni tra amici (24 ore).
Scuole: ruolo docente (assegnato solo dal proprietario del DB) e classi con consenso dello studente, portfolio pubblico (solo adulti, spento di default, noindex).
Audio e Sensei: lezione da ascoltare (sintesi vocale del browser, Media Session), Sensei a voce (microfono + lettura), Sensei che conosce i punti deboli, correzione del codice Python.

### Impianto dei 10 corsi nuovi (CODICE)
Lettere: W Sviluppo web, P Programmazione, A App per telefono, I Intelligenza artificiale, B Database e dati grandi, L Cloud e DevOps, R Reti e internet, E Hacking etico e CTF, X Blockchain, M Mondo digitale. Ogni corso 200 lezioni in 5 blocchi, indice completo in `docs/nuovi-corsi.md`, ricetta in `docs/guida-scrivere-lezioni.md`. Scritto davvero: solo il modulo pilota W.01 (10 lezioni). I corsi compaiono come «in preparazione».

## Database: migrazioni
- 0000–0005: applicate.
- 0006 (annunci, reazioni, frasi, staff, prove, notifiche): APPLICATA il 27/10, copia in `backups/2026-10-27T13-48-39.json` (cartella ignorata da git).
- 0007 (verifica certificati), 0008 (negozio, segnalibri), 0009 (duelli, docenti, portfolio), 0010 (blocca i docenti dal scrivere annunci): SCRITTE, NON APPLICATE. Servono prima di pubblicare la 2.0.
- Staff: l'account del titolare è già nello staff (`scripts/aggiungi-staff.mts`).

## Cosa manca (in ordine di priorità)
1. Provare a schermo (browser, anche formato telefono) le pagine nuove, una per una, e correggere: /esplora, /padronanza, /ingresso, /ripasso, /mappa, /cerca, /glossario, /sfida, /negozio, /leghe, /eventi, /ctf, /duelli, /docente, /profilo/notifiche, /profilo/portfolio, /segnalibri, /certificato. NESSUNA è stata aperta in un browser.
2. Ottimizzare e riordinare l'interfaccia (soprattutto telefono); controllo del peso del carico iniziale (la pagina dei quiz porta troppe banche di domande nel browser); stile (`eslint`) da ricontrollare.
3. Applicare le migrazioni 0007–0010 con copia di sicurezza (la lancia il titolare).
4. Creare i rami Neon `dev` e `preview` e separare i dati di prova da quelli veri.
5. Pubblicare la 2.0 su Vercel (serve un token Vercel NUOVO: il precedente è finito in chat e va revocato). Poi aggiornare le variabili d'ambiente se servono.
6. Notifiche: generare le chiavi con `scripts/genera-vapid.mts` e metterle su Vercel (le inserisce il titolare).
7. Scrivere le ~1.990 lezioni dei 10 corsi nuovi, a gruppi di agenti (1 agente = 1 modulo da 10 lezioni), con controllo (`lint-content`, compilazione, test) e revisione prima di pubblicare. La prima ondata di 15 agenti (W2–W4, P1–P4, M1–M4, I1–I4) è FALLITA per il limite di sessione: da rilanciare. Decisione aperta: pubblicare i corsi nuovi anche senza video? (Mai inventare link video.)
8. Ampliare i 5 corsi esistenti (non iniziato; piani in `docs/brief-approfondimenti.md`).
9. Immagini: prompt pronti in `docs/prompt-immagini.md`; il titolare le genera e le mette in `public/img/…`, poi vanno collegate e ottimizzate.
10. Dominio `cyberdojo.it` (da acquistare), poi: collegare a Vercel, verificare su Resend (email a tutti), Play Store facoltativo.
11. APK Android: alla fine, dopo UI ottimizzata. Servono: licenze SDK accettate dal titolare, chiave di firma (copia privata!), `assetlinks.json`.
12. Rimasti: revisione di un esperto per contenuti finanza, legali e C8; pulsante «Segnala un errore»; 4 lezioni senza video; copertine mancanti; voci ElevenLabs.

## Limiti noti (da non nascondere al titolare)
- Tutto il nuovo è provato solo con test automatici, non su un telefono vero né su un browser.
- Offline: si riaprono solo le lezioni già aperte; verifiche e salvataggi richiedono la rete.
- Duelli: manca un tetto di inviti ricevuti e la possibilità di ritirare un invito.
- Nessun account ha l'email verificata (serve il dominio).
- L'app Android è il sito in un contenitore: si aggiorna col sito, ma non sarà un'app nativa.

## Segnalazioni di sicurezza aperte
- Revocare il token Vercel usato in chat; cambiare le password del database comparse in chat (ruoli `neondb_owner` e `cyberdojo_app`, da Neon → Roles → Reset password; poi aggiornare `.env.local` e Vercel).
