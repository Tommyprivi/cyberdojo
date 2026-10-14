# Database (Neon)

## Collegamento
1. Crea un progetto su Neon e copia la stringa di connessione in `.env.local` come `DATABASE_URL`. Mai in chat o nel repository.
2. Applica le migrazioni: `pnpm db:migrate`. In alternativa incolla `drizzle/0000_init.sql` in pgAdmin.

## RLS: ruolo non proprietario (obbligatorio)
Le policy RLS non si applicano al proprietario delle tabelle. Se l'app si collega con il ruolo che ha creato le tabelle, le policy sono ignorate e resta solo la barriera lato server.

Crea un ruolo applicativo e usa la sua stringa come `DATABASE_URL` in produzione. Le migrazioni si eseguono con il ruolo proprietario.

```sql
create role cyberdojo_app login password 'CAMBIA-QUESTA' ; -- scegli tu la password
grant usage on schema public to cyberdojo_app;
grant select, insert, update, delete on all tables in schema public to cyberdojo_app;
alter default privileges in schema public
  grant select, insert, update, delete on tables to cyberdojo_app;
```

## Regole per chi scrive query
- Dati di un utente: sempre dentro `withUser(userId, tx => ...)` (`src/lib/db/scoped.ts`).
- `certificates` e `audio_assets` non hanno RLS: i certificati si leggono per `public_code`, gli audio sono pubblici.

## Stato (2026-10-14)
- Database Neon collegato. Migrazione `0000_init` applicata con `pnpm db:migrate` (usa `DATABASE_URL`, il proprietario).
- Creato il ruolo `cyberdojo_app` (non proprietario). L'app si collega con `DATABASE_URL_APP`; in produzione è obbligatoria (`src/lib/db/index.ts`).
- Provata davvero la RLS con due utenti finti: ognuno vede e scrive solo le proprie righe; senza identità non si vede nulla; modifica e cancellazione di righe altrui bloccate.
- Provato l'accesso su database vero: registrazione, uscita, accesso, password sbagliata (401), richiesta da un altro sito (403), link magico monouso, avvio di Google.
- Non provato: accesso Google completo (richiede il consenso di un account reale), invio email vero con Resend.
- `.env.local` non va mai su git. `pnpm dev:clean` cancella la cache `.next` e avvia il server (utile se le pagine mostrano stili vecchi).
