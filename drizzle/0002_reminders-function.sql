-- Elenco di chi ha attivato i promemoria, per il lavoro pianificato che li spedisce.
--
-- Perché una funzione e non una query dell'app: le tabelle hanno la sicurezza per riga, e l'app (ruolo
-- cyberdojo_app) vede solo i dati dell'utente su cui sta lavorando. Un lavoro pianificato deve invece
-- scorrere più utenti. Invece di dare all'app un ruolo con più poteri, questa funzione gira con i
-- diritti del proprietario (SECURITY DEFINER), restituisce SOLO i campi che servono e solo per chi ha
-- dato il consenso ed ha un'email verificata. Nessun'altra tabella viene aperta.
create or replace function public.reminder_candidates()
returns table (
  user_id text,
  email text,
  name text,
  timezone text,
  reminder_hour integer,
  last_reminder_day text,
  streak_current integer,
  streak_best integer,
  streak_last_day text,
  freezes integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    u.id,
    u.email,
    u.name,
    p.timezone,
    p.reminder_hour,
    p.last_reminder_day,
    coalesce(s.current, 0),
    coalesce(s.best, 0),
    s.last_day,
    coalesce(s.freezes, 0)
  from profiles p
  join "user" u on u.id = p.id
  left join streaks s on s.user_id = p.id
  where p.reminder_email = true
    and u.email_verified = true
$$;
--> statement-breakpoint
revoke all on function public.reminder_candidates() from public;
--> statement-breakpoint
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'cyberdojo_app') then
    grant execute on function public.reminder_candidates() to cyberdojo_app;
  end if;
end
$$;
