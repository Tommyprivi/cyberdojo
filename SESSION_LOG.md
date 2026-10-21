# Registro sessioni

Log cronologico delle azioni svolte nel progetto. Una riga per azione completata.

- [21/10 22:05] AZIONE: Analisi completa del progetto (struttura, stack, architettura, contenuti, stato dei controlli)
- FILE: nessuno (solo lettura)
- NOTE: Next.js 16.4 / React 19.3 / Tailwind v4, better-auth + drizzle + Neon (non Supabase come da SPEC v0.1). 443 lezioni MDX in 5 corsi (cybersecurity 91, dati 149, fondamenta 74, hedge 40, trading 89), tutte in stato `draft`. Working tree con 166 file modificati/non tracciati non committati.

- [21/10 22:05] AZIONE: Creato il file di registro delle sessioni
- FILE: SESSION_LOG.md
- NOTE: Richiesto dall'utente: una riga in fondo dopo ogni azione completata.

- [21/10 22:07] AZIONE: Corretto il test rosso della banca c14 (domanda troppo corta: 15 caratteri, il limite è 16)
- FILE: src/lib/practice/banks-cyber/c14.ts
- NOTE: "Che cos'è NTLM?" -> "Che cos'è il protocollo di autenticazione NTLM?". Unica domanda troppo corta in tutto il corpus (6136 domande).

- [21/10 22:08] AZIONE: Escluso dal controllo ESLint il materiale di terze parti vendutato nel repository
- FILE: eslint.config.mjs
- NOTE: `.agents/**` e `.claude/**` (skill e agenti clonati) producevano 2 errori ESLint che non riguardavano il codice del progetto.

- [21/10 22:09] AZIONE: Portate a 8 schermate le due lezioni che ne avevano 9 (regola del lint: 6-8)
- FILE: content/cybersecurity/c15/C.15.001.mdx, content/cybersecurity/c21/C.21.001.mdx
- NOTE: In C.15.001 il quiz "Tocca a te" è stato spostato prima e le due schermate sui rinnovi sono state unite. In C.21.001 "Le sette fasi di PTES" e "Altri standard" sono diventate una schermata sola. Contenuto invariato.

- [21/10 22:10] AZIONE: Corretti i 5 prerequisiti inesistenti del corso Hedge fund
- FILE: content/hedge/h5/H.05.001.mdx, content/hedge/h7/H.07.001.mdx, content/hedge/h9/H.09.001.mdx, content/hedge/h10/H.10.001.mdx, content/hedge/h12/H.12.001.mdx
- NOTE: I moduli H4, H6, H8, H11 non hanno lezioni (hanno solo le banche). I prerequisiti ora puntano all'ultima lezione esistente del modulo precedente. Nota: i moduli mancanti restano da scrivere.

- [21/10 22:11] AZIONE: Eseguita la verifica completa del progetto
- FILE: nessuno (solo lettura)
- NOTE: vitest 2132/2132 OK, ESLint pulito, typecheck pulito, build di produzione OK. lint:content passa da 40 a 33 problemi: restano solo "verification.generator sconosciuto" (33 banche di domande da scrivere: 23 Cybersecurity C12-C21, 10 Hedge H5 e H12).

- [21/10 21:55] AZIONE: Salvataggio del lavoro in corso non committato
- FILE: .gitattributes, .gitignore, SESSION_LOG.md e 630 file
- NOTE: Commit `ead149e` su `main` (repo locale, nessun remote). Configurata identità git solo per questo repository con quella delle commit precedenti. Aggiunto `.gitattributes` (`* text=auto eol=lf`) per fermare il passaggio a CRLF che sporcava ogni diff. Esclusi `.agents/` e `.claude/` (skill di terze parti, 7,6 MB).

- [21/10 21:58] AZIONE: Configurate le chiavi ElevenLabs, Resend e Groq
- FILE: .env.local, .env.example
- NOTE: La prima chiave ElevenLabs ricevuta era l'ID della chiave, non la chiave (l'API risponde `api_key_id_used_as_api_key`): serviva una chiave che inizi con `sk_`, ora verificata. La chiave `gsk_` è di Groq, non di Google: aggiunto `GROQ_API_KEY`/`GROQ_MODEL` come provider alternativo per l'AI Dojo. La chiave Resend funziona ma l'account non ha domini: si usa `onboarding@resend.dev` (invio solo all'indirizzo del titolare), per gli utenti reali serve un dominio.

- [21/10 22:01] AZIONE: Scritte le 33 banche di domande mancanti
- FILE: src/lib/practice/banks-cyber/c12.ts, c13.ts, c15.ts, c16.ts, c18.ts, c19.ts, c20.ts, c21.ts, src/lib/practice/banks-hedge/h05.ts, h12.ts
- NOTE: 442 domande in 33 banche (12-14 per banca), scritte a partire dalle lezioni: 23 banche Cybersecurity (C12, C13, C15, C16, C18, C19, C20, C21) e 10 Hedge fund (H5, H12). Con queste il lint dei contenuti passa: 443 lezioni controllate, 0 problemi. Le 33 lezioni che erano bloccate si sbloccano.

- [21/10 22:03] AZIONE: Resend non blocca più lo sviluppo quando il dominio manca
- FILE: src/lib/email.ts
- NOTE: Se Resend risponde con errore, in sviluppo il messaggio resta stampato a terminale e salvato in `.outbox/` invece di far fallire la richiesta. In produzione l'errore viene ancora propagato. Email di prova inviata con successo all'indirizzo del titolare.

- [21/10 22:05] AZIONE: Completata la mascotte "Onigiri Sensei" e aggiunta la pagina 404
- FILE: src/components/mascot.tsx, src/app/not-found.tsx, src/app/(app)/revisione/grafica/page.tsx, public/img/mascotte/sensei.svg
- NOTE: La mascotte esisteva solo come bozza (file con scritto "PLACEHOLDER GENERATO") ed era già usata in 11 punti del sito. Scelto di tenerla: il riso onigiri richiama il sigillo giapponese del marchio. Ora usa i colori del sito (indaco, carta, rosso del sigillo) invece del verde provvisorio, e la bocca in modalità "serio" non è più bianca su bianco (era invisibile). Aggiunta la terza posizione "attento" e una pagina 404 con la mascotte, che non esisteva.

- [21/10 22:08] AZIONE: Eseguita la verifica completa del progetto
- FILE: nessuno (solo lettura)
- NOTE: vitest 2264/2264 OK (21 file), ESLint pulito su tutto il progetto, typecheck pulito, build di produzione OK, lint:content 443 lezioni con 0 problemi.
