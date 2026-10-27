CREATE TABLE "announcement_phrases" (
	"announcement_id" text NOT NULL,
	"user_id" text NOT NULL,
	"phrase_key" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "announcement_phrases_announcement_id_user_id_phrase_key_pk" PRIMARY KEY("announcement_id","user_id","phrase_key"),
	CONSTRAINT "announcement_phrases_key" CHECK ("announcement_phrases"."phrase_key" in ('grazie','bellissimo','non-vedo-lora','ottimo-lavoro','ho-una-domanda','funziona-bene','ho-unidea'))
);
--> statement-breakpoint
ALTER TABLE "announcement_phrases" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "announcement_reactions" (
	"announcement_id" text NOT NULL,
	"user_id" text NOT NULL,
	"emoji" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "announcement_reactions_announcement_id_user_id_pk" PRIMARY KEY("announcement_id","user_id"),
	CONSTRAINT "announcement_reactions_emoji" CHECK ("announcement_reactions"."emoji" in ('👍','🔥','🎉','❤️','🤯','👏'))
);
--> statement-breakpoint
ALTER TABLE "announcement_reactions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"author_id" text,
	"published_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "announcements" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "mastery_attempts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"scope" text NOT NULL,
	"score" integer NOT NULL,
	"total" integer NOT NULL,
	"passed" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mastery_attempts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "push_subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"kinds" jsonb DEFAULT '["studio","novita","sfide"]'::jsonb NOT NULL,
	"hour" integer DEFAULT 18 NOT NULL,
	"last_study_day" text,
	"last_news_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "push_subscriptions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "staff_roles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"role" text DEFAULT 'staff' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "staff_roles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "tutorial_done" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "seen_news_version" text;--> statement-breakpoint
ALTER TABLE "announcement_phrases" ADD CONSTRAINT "announcement_phrases_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcement_reactions" ADD CONSTRAINT "announcement_reactions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mastery_attempts" ADD CONSTRAINT "mastery_attempts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_roles" ADD CONSTRAINT "staff_roles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "announcements_published_idx" ON "announcements" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "mastery_user_scope_idx" ON "mastery_attempts" USING btree ("user_id","scope");--> statement-breakpoint
CREATE UNIQUE INDEX "push_endpoint" ON "push_subscriptions" USING btree ("endpoint");--> statement-breakpoint
CREATE INDEX "push_user_idx" ON "push_subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE POLICY "own_rows" ON "announcement_phrases" AS PERMISSIVE FOR ALL TO public USING (user_id = current_setting('app.user_id', true)) WITH CHECK (user_id = current_setting('app.user_id', true));--> statement-breakpoint
CREATE POLICY "own_rows" ON "announcement_reactions" AS PERMISSIVE FOR ALL TO public USING (user_id = current_setting('app.user_id', true)) WITH CHECK (user_id = current_setting('app.user_id', true));--> statement-breakpoint
CREATE POLICY "announcements_read" ON "announcements" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "announcements_staff_insert" ON "announcements" AS PERMISSIVE FOR INSERT TO public WITH CHECK (exists (select 1 from staff_roles s where s.user_id = current_setting('app.user_id', true)));--> statement-breakpoint
CREATE POLICY "announcements_staff_update" ON "announcements" AS PERMISSIVE FOR UPDATE TO public USING (exists (select 1 from staff_roles s where s.user_id = current_setting('app.user_id', true))) WITH CHECK (exists (select 1 from staff_roles s where s.user_id = current_setting('app.user_id', true)));--> statement-breakpoint
CREATE POLICY "announcements_staff_delete" ON "announcements" AS PERMISSIVE FOR DELETE TO public USING (exists (select 1 from staff_roles s where s.user_id = current_setting('app.user_id', true)));--> statement-breakpoint
CREATE POLICY "own_rows" ON "mastery_attempts" AS PERMISSIVE FOR ALL TO public USING (user_id = current_setting('app.user_id', true)) WITH CHECK (user_id = current_setting('app.user_id', true));--> statement-breakpoint
CREATE POLICY "own_rows" ON "push_subscriptions" AS PERMISSIVE FOR ALL TO public USING (user_id = current_setting('app.user_id', true)) WITH CHECK (user_id = current_setting('app.user_id', true));--> statement-breakpoint
CREATE POLICY "own_staff_row" ON "staff_roles" AS PERMISSIVE FOR SELECT TO public USING ("staff_roles"."user_id" = current_setting('app.user_id', true));
--> statement-breakpoint
-- Conteggi delle reazioni: aggregati senza nomi (si vede quante persone, non chi). Solo lettura.
CREATE OR REPLACE FUNCTION public.announcement_reaction_counts(p_ids text[])
RETURNS TABLE (announcement_id text, emoji text, n integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT r.announcement_id, r.emoji, count(*)::integer
  FROM announcement_reactions r
  WHERE r.announcement_id = ANY (p_ids)
  GROUP BY r.announcement_id, r.emoji
$$;--> statement-breakpoint

-- Conteggi dei commenti a frasi: come sopra, solo numeri.
CREATE OR REPLACE FUNCTION public.announcement_phrase_counts(p_ids text[])
RETURNS TABLE (announcement_id text, phrase_key text, n integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT p.announcement_id, p.phrase_key, count(*)::integer
  FROM announcement_phrases p
  WHERE p.announcement_id = ANY (p_ids)
  GROUP BY p.announcement_id, p.phrase_key
$$;--> statement-breakpoint

-- Classifica per corso (prefisso della lezione: F, C, D, T, H): come social_leaderboard, ma conta solo gli XP
-- delle lezioni di quel corso. Solo chi ha attivato la partecipazione, solo la propria fascia d'età.
CREATE OR REPLACE FUNCTION public.course_leaderboard(p_course text, p_start timestamptz, p_end timestamptz, p_limit integer)
RETURNS TABLE (rank integer, public_id text, nickname text, avatar text, xp integer, is_me boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
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
          AND x.ref_id LIKE p_course || '.%'
          AND (x.created_at AT TIME ZONE 'UTC') >= p_start AND (x.created_at AT TIME ZONE 'UTC') < p_end
      ), 0)::integer AS xp
    FROM social_profiles sp, me
    WHERE p_course ~ '^[A-Z]$'
      AND sp.age_group = me.age_group AND sp.join_leaderboard AND sp.nickname IS NOT NULL
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

-- Destinatari delle notifiche, per il lavoro pianificato (come reminder_candidates): solo i campi che servono.
CREATE OR REPLACE FUNCTION public.push_candidates()
RETURNS TABLE (
  id text, user_id text, endpoint text, p256dh text, auth text, kinds jsonb, hour integer,
  last_study_day text, last_news_id text, timezone text, streak_current integer, streak_last_day text
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT ps.id, ps.user_id, ps.endpoint, ps.p256dh, ps.auth, ps.kinds, ps.hour,
         ps.last_study_day, ps.last_news_id, p.timezone,
         coalesce(s.current, 0), s.last_day
  FROM push_subscriptions ps
  JOIN profiles p ON p.id = ps.user_id
  LEFT JOIN streaks s ON s.user_id = ps.user_id
$$;--> statement-breakpoint

REVOKE ALL ON FUNCTION public.announcement_reaction_counts(text[]) FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.announcement_phrase_counts(text[]) FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.course_leaderboard(text, timestamptz, timestamptz, integer) FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.push_candidates() FROM PUBLIC;--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cyberdojo_app') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.announcement_reactions, public.announcement_phrases,
      public.mastery_attempts, public.push_subscriptions TO cyberdojo_app;
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.announcements TO cyberdojo_app;
    GRANT SELECT ON TABLE public.staff_roles TO cyberdojo_app;
    GRANT EXECUTE ON FUNCTION public.announcement_reaction_counts(text[]) TO cyberdojo_app;
    GRANT EXECUTE ON FUNCTION public.announcement_phrase_counts(text[]) TO cyberdojo_app;
    GRANT EXECUTE ON FUNCTION public.course_leaderboard(text, timestamptz, timestamptz, integer) TO cyberdojo_app;
    GRANT EXECUTE ON FUNCTION public.push_candidates() TO cyberdojo_app;
  END IF;
END
$$;
