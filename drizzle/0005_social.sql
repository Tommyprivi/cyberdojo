CREATE TABLE "challenge_entries" (
	"user_id" text NOT NULL,
	"challenge_id" text NOT NULL,
	"week_start" text NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "challenge_entries_user_id_week_start_challenge_id_pk" PRIMARY KEY("user_id","week_start","challenge_id")
);
--> statement-breakpoint
ALTER TABLE "challenge_entries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "friendships" (
	"id" text PRIMARY KEY NOT NULL,
	"requester_id" text NOT NULL,
	"addressee_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"accepted_at" timestamp,
	CONSTRAINT "friendships_not_self" CHECK ("friendships"."requester_id" <> "friendships"."addressee_id")
);
--> statement-breakpoint
ALTER TABLE "friendships" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "group_members" (
	"group_id" text NOT NULL,
	"user_id" text NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "group_members_group_id_user_id_pk" PRIMARY KEY("group_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "group_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "social_blocks" (
	"user_id" text NOT NULL,
	"kind" text NOT NULL,
	"target_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "social_blocks_user_id_kind_target_id_pk" PRIMARY KEY("user_id","kind","target_id")
);
--> statement-breakpoint
ALTER TABLE "social_blocks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "social_profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"public_id" text NOT NULL,
	"nickname" text,
	"nickname_key" text,
	"avatar" text DEFAULT 'sensei' NOT NULL,
	"age_group" text NOT NULL,
	"join_leaderboard" boolean DEFAULT false NOT NULL,
	"show_to_friends" boolean DEFAULT false NOT NULL,
	"accept_requests" boolean DEFAULT false NOT NULL,
	"friend_code" text,
	"nickname_changed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "social_profiles_public_id_unique" UNIQUE("public_id"),
	CONSTRAINT "social_profiles_nickname_key_unique" UNIQUE("nickname_key"),
	CONSTRAINT "social_profiles_friend_code_unique" UNIQUE("friend_code")
);
--> statement-breakpoint
ALTER TABLE "social_profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "social_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"target_id" text NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "social_reports" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "study_groups" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"owner_id" text NOT NULL,
	"audience" text NOT NULL,
	"join_code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "study_groups_join_code_unique" UNIQUE("join_code")
);
--> statement-breakpoint
ALTER TABLE "study_groups" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "challenge_entries" ADD CONSTRAINT "challenge_entries_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_requester_id_user_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_addressee_id_user_id_fk" FOREIGN KEY ("addressee_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_study_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."study_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_blocks" ADD CONSTRAINT "social_blocks_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_profiles" ADD CONSTRAINT "social_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_groups" ADD CONSTRAINT "study_groups_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "friendships_pair" ON "friendships" USING btree (least("requester_id", "addressee_id"),greatest("requester_id", "addressee_id"));--> statement-breakpoint
CREATE INDEX "friendships_requester_idx" ON "friendships" USING btree ("requester_id");--> statement-breakpoint
CREATE INDEX "friendships_addressee_idx" ON "friendships" USING btree ("addressee_id");--> statement-breakpoint
CREATE INDEX "group_members_user_idx" ON "group_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "study_groups_owner_idx" ON "study_groups" USING btree ("owner_id");--> statement-breakpoint
CREATE POLICY "own_rows" ON "challenge_entries" AS PERMISSIVE FOR ALL TO public USING (user_id = current_setting('app.user_id', true)) WITH CHECK (user_id = current_setting('app.user_id', true));--> statement-breakpoint
CREATE POLICY "friend_select" ON "friendships" AS PERMISSIVE FOR SELECT TO public USING ("friendships"."requester_id" = current_setting('app.user_id', true) or "friendships"."addressee_id" = current_setting('app.user_id', true));--> statement-breakpoint
CREATE POLICY "friend_insert" ON "friendships" AS PERMISSIVE FOR INSERT TO public WITH CHECK ("friendships"."requester_id" = current_setting('app.user_id', true) and "friendships"."status" = 'pending');--> statement-breakpoint
CREATE POLICY "friend_accept" ON "friendships" AS PERMISSIVE FOR UPDATE TO public USING ("friendships"."addressee_id" = current_setting('app.user_id', true)) WITH CHECK ("friendships"."addressee_id" = current_setting('app.user_id', true) and "friendships"."status" = 'accepted');--> statement-breakpoint
CREATE POLICY "friend_delete" ON "friendships" AS PERMISSIVE FOR DELETE TO public USING ("friendships"."requester_id" = current_setting('app.user_id', true) or "friendships"."addressee_id" = current_setting('app.user_id', true));--> statement-breakpoint
CREATE POLICY "own_rows" ON "group_members" AS PERMISSIVE FOR ALL TO public USING (user_id = current_setting('app.user_id', true)) WITH CHECK (user_id = current_setting('app.user_id', true));--> statement-breakpoint
CREATE POLICY "own_rows" ON "social_blocks" AS PERMISSIVE FOR ALL TO public USING (user_id = current_setting('app.user_id', true)) WITH CHECK (user_id = current_setting('app.user_id', true));--> statement-breakpoint
CREATE POLICY "own_rows" ON "social_profiles" AS PERMISSIVE FOR ALL TO public USING (user_id = current_setting('app.user_id', true)) WITH CHECK (user_id = current_setting('app.user_id', true));--> statement-breakpoint
CREATE POLICY "report_insert_only" ON "social_reports" AS PERMISSIVE FOR INSERT TO public WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "own_rows" ON "study_groups" AS PERMISSIVE FOR ALL TO public USING (owner_id = current_setting('app.user_id', true)) WITH CHECK (owner_id = current_setting('app.user_id', true));
--> statement-breakpoint
-- ===================================================================================================
-- Parte scritta a mano (drizzle-kit non genera funzioni, trigger né vincoli di formato). Vedi docs/social.md.
-- Principio: l'app (ruolo cyberdojo_app) vede solo le proprie righe. Le classifiche, gli amici e i gruppi
-- mostrano dati di ALTRI utenti: lo fanno solo queste funzioni in sola lettura (SECURITY DEFINER), che
-- restituiscono solo soprannome, avatar e punti di chi ha dato il consenso. L'utente che chiede è sempre
-- quello impostato da withUser() (app.user_id): non si può chiedere "al posto di" un altro.
-- ===================================================================================================

-- Formato dei dati, anche se l'app venisse aggirata
ALTER TABLE "social_profiles" ADD CONSTRAINT "social_profiles_nickname_format" CHECK ("nickname" IS NULL OR "nickname" ~ '^[A-Za-z][A-Za-z0-9_-]{2,15}$');--> statement-breakpoint
ALTER TABLE "social_profiles" ADD CONSTRAINT "social_profiles_avatar_format" CHECK ("avatar" ~ '^[a-z]{3,12}$');--> statement-breakpoint
ALTER TABLE "social_profiles" ADD CONSTRAINT "social_profiles_age_group_ck" CHECK ("age_group" IN ('minori', 'adulti'));--> statement-breakpoint
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_status_ck" CHECK ("status" IN ('pending', 'accepted'));--> statement-breakpoint
-- Il nome di un gruppo non è testo libero: tipo, una parola e un numero.
ALTER TABLE "study_groups" ADD CONSTRAINT "study_groups_name_format" CHECK ("name" ~ '^(Classe|Gruppo|Squadra|Dojo|Club) [A-Z][a-z]{2,14} [0-9]{1,2}$');--> statement-breakpoint
ALTER TABLE "study_groups" ADD CONSTRAINT "study_groups_audience_ck" CHECK ("audience" IN ('minori', 'adulti'));--> statement-breakpoint
ALTER TABLE "social_reports" ADD CONSTRAINT "social_reports_kind_ck" CHECK ("kind" IN ('user', 'group'));--> statement-breakpoint
ALTER TABLE "social_reports" ADD CONSTRAINT "social_reports_reason_ck" CHECK ("reason" IN ('offensivo', 'molestie', 'personale', 'sicurezza', 'altro'));--> statement-breakpoint
ALTER TABLE "social_blocks" ADD CONSTRAINT "social_blocks_kind_ck" CHECK ("kind" IN ('user', 'group'));--> statement-breakpoint

-- ---------- Trigger: cambio di soprannome al massimo ogni 7 giorni ----------
CREATE OR REPLACE FUNCTION public.social_profiles_guard() RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.age_group IS DISTINCT FROM OLD.age_group THEN
      RAISE EXCEPTION 'social_age_group_locked';
    END IF;
    IF NEW.nickname IS DISTINCT FROM OLD.nickname THEN
      IF OLD.nickname IS NOT NULL AND OLD.nickname_changed_at IS NOT NULL
         AND OLD.nickname_changed_at > (now() at time zone 'UTC') - interval '7 days' THEN
        RAISE EXCEPTION 'social_nickname_cooldown';
      END IF;
      NEW.nickname_changed_at := (now() at time zone 'UTC');
    END IF;
  ELSIF NEW.nickname IS NOT NULL THEN
    NEW.nickname_changed_at := (now() at time zone 'UTC');
  END IF;
  -- Senza soprannome nessun consenso può essere attivo: non ci sarebbe nulla da mostrare.
  IF NEW.nickname IS NULL AND (NEW.join_leaderboard OR NEW.show_to_friends OR NEW.accept_requests OR NEW.friend_code IS NOT NULL) THEN
    RAISE EXCEPTION 'social_nickname_required';
  END IF;
  RETURN NEW;
END
$$;--> statement-breakpoint
CREATE TRIGGER social_profiles_guard BEFORE INSERT OR UPDATE ON public.social_profiles
  FOR EACH ROW EXECUTE FUNCTION public.social_profiles_guard();--> statement-breakpoint

-- ---------- Trigger: amicizie (stessa fascia d'età, limite di 30) ----------
CREATE OR REPLACE FUNCTION public.friendships_guard() RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  a public.social_profiles;
  b public.social_profiles;
  n integer;
BEGIN
  SELECT * INTO a FROM public.social_profiles WHERE user_id = NEW.requester_id;
  SELECT * INTO b FROM public.social_profiles WHERE user_id = NEW.addressee_id;
  IF a.user_id IS NULL OR b.user_id IS NULL OR a.nickname IS NULL OR b.nickname IS NULL THEN
    RAISE EXCEPTION 'social_profile_missing';
  END IF;
  IF a.age_group <> b.age_group THEN
    RAISE EXCEPTION 'social_age_mismatch';
  END IF;
  IF NOT b.accept_requests THEN
    RAISE EXCEPTION 'social_not_accepting';
  END IF;
  SELECT count(*) INTO n FROM public.friendships WHERE requester_id = NEW.requester_id OR addressee_id = NEW.requester_id;
  IF n >= 30 THEN RAISE EXCEPTION 'social_friend_limit'; END IF;
  SELECT count(*) INTO n FROM public.friendships WHERE requester_id = NEW.addressee_id OR addressee_id = NEW.addressee_id;
  IF n >= 30 THEN RAISE EXCEPTION 'social_friend_limit_other'; END IF;
  RETURN NEW;
END
$$;--> statement-breakpoint
CREATE TRIGGER friendships_guard BEFORE INSERT ON public.friendships
  FOR EACH ROW EXECUTE FUNCTION public.friendships_guard();--> statement-breakpoint

-- ---------- Trigger: gruppi (solo adulti li creano, limiti di dimensione) ----------
CREATE OR REPLACE FUNCTION public.study_groups_guard() RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  o public.social_profiles;
  n integer;
BEGIN
  SELECT * INTO o FROM public.social_profiles WHERE user_id = NEW.owner_id;
  IF o.user_id IS NULL OR o.nickname IS NULL THEN RAISE EXCEPTION 'social_profile_missing'; END IF;
  IF o.age_group <> 'adulti' THEN RAISE EXCEPTION 'social_group_owner_must_be_adult'; END IF;
  SELECT count(*) INTO n FROM public.study_groups WHERE owner_id = NEW.owner_id;
  IF n >= 3 THEN RAISE EXCEPTION 'social_group_owner_limit'; END IF;
  RETURN NEW;
END
$$;--> statement-breakpoint
CREATE TRIGGER study_groups_guard BEFORE INSERT ON public.study_groups
  FOR EACH ROW EXECUTE FUNCTION public.study_groups_guard();--> statement-breakpoint

CREATE OR REPLACE FUNCTION public.group_members_guard() RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  g public.study_groups;
  m public.social_profiles;
  n integer;
BEGIN
  SELECT * INTO g FROM public.study_groups WHERE id = NEW.group_id;
  SELECT * INTO m FROM public.social_profiles WHERE user_id = NEW.user_id;
  IF g.id IS NULL THEN RAISE EXCEPTION 'social_group_missing'; END IF;
  IF m.user_id IS NULL OR m.nickname IS NULL THEN RAISE EXCEPTION 'social_profile_missing'; END IF;
  -- L'unica eccezione alla regola di fascia è il creatore (adulto responsabile di un gruppo di ragazzi).
  IF NEW.user_id <> g.owner_id AND m.age_group <> g.audience THEN RAISE EXCEPTION 'social_age_mismatch'; END IF;
  SELECT count(*) INTO n FROM public.group_members WHERE group_id = NEW.group_id;
  IF n >= 40 THEN RAISE EXCEPTION 'social_group_full'; END IF;
  IF NEW.user_id <> g.owner_id THEN
    SELECT count(*) INTO n FROM public.group_members WHERE user_id = NEW.user_id;
    IF n >= 5 THEN RAISE EXCEPTION 'social_group_limit'; END IF;
  END IF;
  IF EXISTS (SELECT 1 FROM public.social_blocks b WHERE b.user_id = NEW.user_id AND b.kind = 'group' AND b.target_id = g.id) THEN
    RAISE EXCEPTION 'social_blocked';
  END IF;
  RETURN NEW;
END
$$;--> statement-breakpoint
CREATE TRIGGER group_members_guard BEFORE INSERT ON public.group_members
  FOR EACH ROW EXECUTE FUNCTION public.group_members_guard();--> statement-breakpoint

-- ---------- Funzioni di sola lettura ----------

-- Classifica della settimana: solo chi ha attivato la partecipazione, solo la propria fascia d'età.
-- Chi non partecipa non vede nulla (la query parte da "me": se me non partecipa non restituisce righe).
CREATE OR REPLACE FUNCTION public.social_leaderboard(p_start timestamptz, p_end timestamptz, p_limit integer)
RETURNS TABLE (rank integer, public_id text, nickname text, avatar text, xp integer, is_me boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH me AS (
    SELECT sp.user_id, sp.public_id, sp.age_group
    FROM social_profiles sp
    WHERE sp.user_id = nullif(current_setting('app.user_id', true), '')
      AND sp.nickname IS NOT NULL AND sp.join_leaderboard
  ),
  eligible AS (
    SELECT sp.user_id, sp.public_id, sp.nickname, sp.avatar,
      coalesce((
        SELECT sum(x.amount) FROM xp_events x
        WHERE x.user_id = sp.user_id
          AND (x.created_at AT TIME ZONE 'UTC') >= p_start AND (x.created_at AT TIME ZONE 'UTC') < p_end
      ), 0)::integer AS xp
    FROM social_profiles sp, me
    WHERE sp.age_group = me.age_group AND sp.join_leaderboard AND sp.nickname IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM social_blocks b
        WHERE b.kind = 'user'
          AND ((b.user_id = me.user_id AND b.target_id = sp.public_id) OR (b.user_id = sp.user_id AND b.target_id = me.public_id))
      )
  ),
  ranked AS (
    SELECT (row_number() OVER (ORDER BY e.xp DESC, lower(e.nickname)))::integer AS rank,
           e.public_id, e.nickname, e.avatar, e.xp, (e.user_id = (SELECT user_id FROM me)) AS is_me
    FROM eligible e
  )
  SELECT r.rank, r.public_id, r.nickname, r.avatar, r.xp, r.is_me
  FROM ranked r
  WHERE r.rank <= least(greatest(p_limit, 1), 100) OR r.is_me
  ORDER BY r.rank
$$;--> statement-breakpoint

-- Amici (e richieste) di chi chiede. Dell'altro si vedono soprannome, avatar, serie, lezioni completate
-- (il server ne ricava la cintura) e XP della settimana solo se l'altro ha attivato "mostra agli amici".
CREATE OR REPLACE FUNCTION public.social_friends(p_start timestamptz, p_end timestamptz)
RETURNS TABLE (
  friendship_id text, status text, incoming boolean, public_id text, visible boolean,
  nickname text, avatar text, xp integer, streak_current integer, streak_last_day text,
  timezone text, completed_lessons text[]
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH me AS (
    SELECT sp.user_id, sp.public_id FROM social_profiles sp WHERE sp.user_id = nullif(current_setting('app.user_id', true), '')
  ),
  f AS (
    SELECT fr.id, fr.status, (fr.addressee_id = me.user_id) AS incoming, fr.created_at,
           CASE WHEN fr.requester_id = me.user_id THEN fr.addressee_id ELSE fr.requester_id END AS other_id
    FROM friendships fr, me
    WHERE fr.requester_id = me.user_id OR fr.addressee_id = me.user_id
  )
  SELECT f.id, f.status, f.incoming, sp.public_id,
    (sp.show_to_friends AND sp.nickname IS NOT NULL),
    CASE WHEN sp.show_to_friends THEN sp.nickname END,
    CASE WHEN sp.show_to_friends THEN sp.avatar END,
    CASE WHEN f.status = 'accepted' AND sp.show_to_friends THEN coalesce((
      SELECT sum(x.amount) FROM xp_events x
      WHERE x.user_id = sp.user_id
        AND (x.created_at AT TIME ZONE 'UTC') >= p_start AND (x.created_at AT TIME ZONE 'UTC') < p_end
    ), 0)::integer END,
    CASE WHEN f.status = 'accepted' AND sp.show_to_friends THEN coalesce(s.current, 0) END,
    CASE WHEN f.status = 'accepted' AND sp.show_to_friends THEN s.last_day END,
    CASE WHEN f.status = 'accepted' AND sp.show_to_friends THEN coalesce(pr.timezone, 'Europe/Rome') END,
    CASE WHEN f.status = 'accepted' AND sp.show_to_friends THEN array(
      SELECT lp.lesson_id FROM lesson_progress lp WHERE lp.user_id = sp.user_id AND lp.status = 'completata'
    ) END
  FROM f
  JOIN social_profiles sp ON sp.user_id = f.other_id
  LEFT JOIN streaks s ON s.user_id = sp.user_id
  LEFT JOIN profiles pr ON pr.id = sp.user_id
  ORDER BY f.created_at
$$;--> statement-breakpoint

-- Trova chi ha generato un codice amico, ma solo se può davvero ricevere la richiesta dal chiamante.
-- Restituisce l'id dell'account solo al server (mai al browser), che poi scrive la richiesta con la RLS.
CREATE OR REPLACE FUNCTION public.social_resolve_friend_code(p_code text)
RETURNS TABLE (target_id text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT t.user_id
  FROM social_profiles t, social_profiles me
  WHERE me.user_id = nullif(current_setting('app.user_id', true), '')
    AND me.nickname IS NOT NULL AND me.show_to_friends
    AND t.friend_code = p_code AND t.accept_requests AND t.nickname IS NOT NULL
    AND t.user_id <> me.user_id AND t.age_group = me.age_group
    AND NOT EXISTS (
      SELECT 1 FROM social_blocks b
      WHERE b.kind = 'user'
        AND ((b.user_id = me.user_id AND b.target_id = t.public_id) OR (b.user_id = t.user_id AND b.target_id = me.public_id))
    )
$$;--> statement-breakpoint

-- I gruppi di chi chiede (il codice si vede solo se si è il creatore).
CREATE OR REPLACE FUNCTION public.social_my_groups()
RETURNS TABLE (group_id text, name text, audience text, is_owner boolean, members integer, join_code text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT g.id, g.name, g.audience, (g.owner_id = gm.user_id),
         (SELECT count(*) FROM group_members m WHERE m.group_id = g.id)::integer,
         CASE WHEN g.owner_id = gm.user_id THEN g.join_code END
  FROM group_members gm
  JOIN study_groups g ON g.id = gm.group_id
  WHERE gm.user_id = nullif(current_setting('app.user_id', true), '')
  ORDER BY g.created_at
$$;--> statement-breakpoint

-- Dentro un gruppo: soprannome, avatar e XP della settimana di ogni membro, più i totali del gruppo
-- (lezioni completate e XP). Le lezioni dei singoli membri non escono mai da qui. Solo per i membri.
CREATE OR REPLACE FUNCTION public.social_group_detail(p_group text, p_start timestamptz, p_end timestamptz)
RETURNS TABLE (
  public_id text, nickname text, avatar text, xp integer, is_owner boolean, is_me boolean,
  total_lessons integer, total_xp_week integer, total_members integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH me AS (
    SELECT sp.user_id, sp.public_id FROM social_profiles sp WHERE sp.user_id = nullif(current_setting('app.user_id', true), '')
  ),
  g AS (
    SELECT sg.id, sg.owner_id
    FROM study_groups sg
    JOIN group_members gm ON gm.group_id = sg.id
    JOIN me ON me.user_id = gm.user_id
    WHERE sg.id = p_group
  ),
  mem AS (
    SELECT sp.user_id, sp.public_id, sp.nickname, sp.avatar, (sp.user_id = g.owner_id) AS is_owner,
      coalesce((
        SELECT sum(x.amount) FROM xp_events x
        WHERE x.user_id = sp.user_id
          AND (x.created_at AT TIME ZONE 'UTC') >= p_start AND (x.created_at AT TIME ZONE 'UTC') < p_end
      ), 0)::integer AS xp,
      (SELECT count(*) FROM lesson_progress lp WHERE lp.user_id = sp.user_id AND lp.status = 'completata')::integer AS lessons
    FROM g
    JOIN group_members gm ON gm.group_id = g.id
    JOIN social_profiles sp ON sp.user_id = gm.user_id
  ),
  tot AS (
    SELECT coalesce(sum(lessons), 0)::integer AS lessons, coalesce(sum(xp), 0)::integer AS xp, count(*)::integer AS members FROM mem
  )
  SELECT m.public_id, m.nickname, m.avatar, m.xp, m.is_owner, (m.user_id = (SELECT user_id FROM me)),
         tot.lessons, tot.xp, tot.members
  FROM mem m, tot
  WHERE NOT EXISTS (
    SELECT 1 FROM social_blocks b, me
    WHERE b.kind = 'user'
      AND ((b.user_id = me.user_id AND b.target_id = m.public_id) OR (b.user_id = m.user_id AND b.target_id = me.public_id))
  )
  ORDER BY m.xp DESC, lower(m.nickname)
$$;--> statement-breakpoint

-- Cerca un gruppo dal codice (solo per chi ha un soprannome e non ha bloccato quel gruppo).
CREATE OR REPLACE FUNCTION public.social_resolve_group_code(p_code text)
RETURNS TABLE (group_id text, audience text, members integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT g.id, g.audience, (SELECT count(*) FROM group_members m WHERE m.group_id = g.id)::integer
  FROM study_groups g, social_profiles me
  WHERE me.user_id = nullif(current_setting('app.user_id', true), '') AND me.nickname IS NOT NULL
    AND g.join_code = p_code
    AND NOT EXISTS (SELECT 1 FROM social_blocks b WHERE b.user_id = me.user_id AND b.kind = 'group' AND b.target_id = g.id)
$$;--> statement-breakpoint

-- Chi può fare cosa: solo le funzioni di lettura al ruolo applicativo; le funzioni dei trigger a nessuno.
REVOKE ALL ON FUNCTION public.social_leaderboard(timestamptz, timestamptz, integer) FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.social_friends(timestamptz, timestamptz) FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.social_resolve_friend_code(text) FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.social_my_groups() FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.social_group_detail(text, timestamptz, timestamptz) FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.social_resolve_group_code(text) FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.social_profiles_guard() FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.friendships_guard() FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.study_groups_guard() FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.group_members_guard() FROM PUBLIC;--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cyberdojo_app') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.social_profiles, public.friendships, public.study_groups,
      public.group_members, public.social_blocks, public.challenge_entries TO cyberdojo_app;
    -- Le segnalazioni si possono solo inserire: nessuno, nemmeno l'app, le rilegge.
    REVOKE ALL ON TABLE public.social_reports FROM cyberdojo_app;
    GRANT INSERT ON TABLE public.social_reports TO cyberdojo_app;
    GRANT EXECUTE ON FUNCTION public.social_leaderboard(timestamptz, timestamptz, integer) TO cyberdojo_app;
    GRANT EXECUTE ON FUNCTION public.social_friends(timestamptz, timestamptz) TO cyberdojo_app;
    GRANT EXECUTE ON FUNCTION public.social_resolve_friend_code(text) TO cyberdojo_app;
    GRANT EXECUTE ON FUNCTION public.social_my_groups() TO cyberdojo_app;
    GRANT EXECUTE ON FUNCTION public.social_group_detail(text, timestamptz, timestamptz) TO cyberdojo_app;
    GRANT EXECUTE ON FUNCTION public.social_resolve_group_code(text) TO cyberdojo_app;
  END IF;
END
$$;
