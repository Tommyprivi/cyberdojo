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
