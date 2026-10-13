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
