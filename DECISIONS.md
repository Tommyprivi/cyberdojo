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
