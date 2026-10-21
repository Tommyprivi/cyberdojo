# AI Dojo

Assistente di studio nella pagina `/dojo`: lo studente fa domande sulle lezioni («Chiedi al Sensei») e si fa interrogare («Interrogazione», 5-10 domande). Le interrogazioni non assegnano XP né serie e non si salvano.

## Come ottenere la chiave gratuita (Google Gemini)
1. Vai su https://aistudio.google.com e accedi con un account Google.
2. Premi «Get API key» e crea una chiave (piano gratuito, senza carta).
3. Mettila in `.env.local` come `GEMINI_API_KEY=...` (mai in chat, mai nel repository) e riavvia il server.
4. Facoltativo: `GEMINI_MODEL=` per cambiare modello. Predefinito: `gemini-3.5-flash-lite` (indicato come modello Flash-Lite con piano gratuito nella documentazione ufficiale, ottobre 2026; i nomi cambiano spesso: ricontrolla su https://ai.google.dev/gemini-api/docs/models).

Senza chiave la pagina funziona lo stesso: la chat risponde «L'AI Dojo non è ancora attivo: manca la chiave.» e l'interrogazione parte in modalità dimostrativa (domande dagli obiettivi del corso, giudizio a occhio), utile per provare l'interfaccia.

## Limiti del piano gratuito
I limiti (richieste al minuto e al giorno, per modello) cambiano e si vedono in AI Studio, pagina «Rate limits». Se si superano, il servizio risponde 429 e l'app mostra «Il servizio gratuito è al limite per ora». Il codice aggiunge limiti propri per utente: 30 messaggi all'ora e 100 al giorno, risposte di al massimo 1500 token, attesa massima 15 secondi.

## Privacy: avviso obbligatorio
Con il piano gratuito Google può usare i messaggi per migliorare i suoi servizi (la tabella prezzi lo indica per i modelli gratuiti; il piano a pagamento no). Per questo la pagina mostra sempre: «Le domande vengono elaborate da un servizio esterno (Google Gemini, piano gratuito): non scrivere dati personali. Le risposte dell'IA possono sbagliare: controlla sempre le lezioni.»
**Prima del lancio pubblico con minori:** valutare un piano a pagamento o un fornitore con garanzie di non-addestramento, e far controllare informativa privacy e base giuridica a un professionista.
Al fornitore vanno solo messaggi e testo della lezione: mai nome, email o ID dell'utente. I testi delle conversazioni non finiscono nei log né nel database.

## Come funziona
- `src/lib/ai/provider.ts`: interfaccia `AiProvider` e scelta del fornitore. `gemini.ts` (REST con `fetch`, chiave nell'intestazione `x-goog-api-key`), `fake.ts` (nessuna rete: test e chiave mancante).
- `src/lib/ai/context.ts`: contesto semplice, senza vettori. Lezione: obiettivi + testo (MDX ripulito, max 12.000 caratteri). Modulo: titoli e obiettivi delle lezioni. Corso: moduli e titoli delle lezioni con ID per i link. Solo lezioni visibili (`isVisible`).
- `src/lib/ai/prompts.ts`: persona del Sensei e regole (solo corsi, «non lo so, non è nel corso», link `/lezione/<id>`, nessuna consulenza finanziaria/medica/legale, niente attacchi reali, messaggi trattati come dati contro la prompt injection, niente dati personali).
- Interrogazione: il modello chiude ogni valutazione con `[[ESITO:giusta|parziale|sbagliata]]`; la pagina toglie il marcatore e calcola il punteggio (giusta 1, parziale 0,5).
- `src/app/api/dojo/route.ts` + `src/lib/ai/handler.ts`: sessione obbligatoria, validazione con zod (`schema.ts`), limite di frequenza, timeout, errori in italiano.

## Limitatore: contatore in memoria, nessuna tabella
Scelta: contatore in memoria del processo (`limits.ts`). Pro: nessuna migrazione, nessun dato nuovo da proteggere. Contro: si azzera al riavvio e non è condiviso tra più istanze serverless, quindi su Vercel il limite vale «per istanza». Per il piano gratuito basta, perché il vero tetto è quello di Google. Se si scala o si passa a un piano a pagamento, aggiungere una tabella `ai_usage` (user_id, giorno, contatore) con RLS come le altre.

## Cambiare fornitore
Scrivere una classe che implementa `AiProvider` (`generate({system, messages, maxOutputTokens, signal})` restituisce `{text}`), poi sceglierla in `getProvider()` in `provider.ts` (ad esempio in base a una nuova variabile d'ambiente). Gli errori vanno lanciati come `AiError` con messaggio in italiano.

## Prova senza rete
`pnpm test` (test in `src/lib/ai/ai.test.ts`) non fa chiamate di rete: usa il provider finto e una `fetch` simulata.
