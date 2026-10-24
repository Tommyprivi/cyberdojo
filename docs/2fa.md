# Verifica in due passaggi (2FA)

Fatta il 2026-10-24 con il plugin `twoFactor` di Better Auth (v1.7.7). Codice dell'app di autenticazione (TOTP, 6 cifre, ogni 30 secondi) più 10 codici di recupero monouso.

## Come funziona
- **Attivazione** (Profilo, scheda «Sicurezza»): password, poi codice QR (disegnato nel browser, libreria `qrcode-generator`, nessun servizio esterno) e chiave manuale, poi conferma con il primo codice. Solo allora il 2FA diventa attivo (`user.two_factor_enabled`). Alla fine si mostrano i 10 codici di recupero, **una sola volta**: copia, scarica `.txt`, casella «li ho salvati».
- **Accesso**: dopo email e password compare il secondo passo: codice a 6 cifre o codice di recupero. La finestra per inserirlo è di 10 minuti e ha al massimo 5 tentativi; l'account si blocca per 15 minuti dopo 10 errori di fila. «Ricorda questo dispositivo» (facoltativo, spento di default) salta il codice per 30 giorni su quel browser: cookie firmato legato all'utente, revocato alla disattivazione.
- **Nuovi codici di recupero**: servono la password; quelli vecchi smettono di funzionare.
- **Disattivazione**: servono password **e** un codice (app o recupero). Il controllo del codice è sul server (`hooks.before` in `src/lib/auth.ts`), non solo nell'interfaccia.
- **Email di avviso** a ogni attivazione e disattivazione (`twoFactorChangedEmail` in `src/lib/mail/templates.ts`, inviata da `hooks.after`).
- **Messaggi** in italiano e generici (`authErrorMessage` in `src/components/auth/auth-card.tsx`).

## Metodi di accesso senza password (decisione importante)
Il plugin chiede il secondo codice **solo** dopo `/sign-in/email`. Link magico, Google e il link di conferma email aprirebbero una sessione senza codice, cioè aggirerebbero il 2FA. Per questo, **se il 2FA è attivo, quei tre metodi non aprono la sessione** (`databaseHooks.session.create.before`): l'utente torna a `/accedi` con un avviso e deve entrare con email, password e codice. L'interfaccia lo dice nella scheda Sicurezza e nella pagina di accesso.
- Chi entra **solo** con Google o col link (nessuna password) non può attivare il 2FA: la scheda lo spiega e rimanda a «Password dimenticata», che crea la password. Scelta voluta: per questi account la «conferma recente» non esiste, e il 2FA senza password non proteggerebbe nulla (basta la casella email).
- Il blocco riguarda anche l'email di conferma indirizzo (accesso automatico dopo la conferma).

## Dati e cifratura
- Tabella `two_factor` (migrazione `0004_two-factor`): `secret` e `backup_codes` sono **cifrati da Better Auth con `BETTER_AUTH_SECRET`** (verificato nel database: testo cifrato, non la chiave in chiaro). Mai nei log né nell'esportazione GDPR; si cancellano con l'account (cascata).
- **Se cambi `BETTER_AUTH_SECRET`, le chiavi 2FA già salvate non si leggono più**: tutti i 2FA attivi diventano inutilizzabili. In quel caso va azzerata la tabella (vedi sotto) e gli utenti riattivano.
- Niente RLS su `two_factor`, come le altre tabelle di Better Auth (`user`, `session`, `account`, `verification`): la libreria la legge prima che esista una sessione, quando non c'è `app.user_id`. Il ruolo `cyberdojo_app` ha i permessi (concessi nella migrazione).

## Se perdi il telefono
1. Entra con email, password e **un codice di recupero** (ognuno vale una volta).
2. Dal Profilo, scheda Sicurezza: «Nuovi codici di recupero», oppure «Disattiva» e riattiva con il nuovo telefono.
3. Se hai perso anche i codici: scrivi dal modulo di contatto. Il titolare può disattivare il 2FA dopo aver verificato l'identità (email dell'account, risposta da quell'indirizzo). Sul database, come proprietario:
   `delete from two_factor where user_id = '<id>'; update "user" set two_factor_enabled = false where id = '<id>';`
   Poi l'utente rientra con la sola password e lo riattiva.

## Prova
`pnpm test` copre formati dei codici, chiave manuale, file dei codici e modello email (`src/lib/two-factor.test.ts`, `src/lib/mail/mail.test.ts`). Prova fatta sul serio con account `@example.com`: attivazione, uscita, rientro con codice, codice sbagliato (401), codice di recupero (monouso), disattivazione con codice sbagliato (401) e giusto, link magico bloccato (redirect a `/accedi?error=failed_to_create_session`, nessun cookie).

## Limiti noti
- Il limite di velocità di Better Auth sulle rotte `/two-factor/` (3 richieste ogni 10 secondi) è attivo solo in produzione; in sviluppo valgono i tentativi massimi e il blocco account.
- La verifica del codice durante «disattiva» e «nuovi codici» (sessione già aperta) non conta nel blocco account: la protezione è la password richiesta insieme.
- Un codice TOTP già usato si può riusare nella stessa finestra di 30 secondi (comportamento della libreria).
