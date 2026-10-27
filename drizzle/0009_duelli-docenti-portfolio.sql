CREATE TABLE "duel_results" (
	"duel_id" text NOT NULL,
	"user_id" text NOT NULL,
	"score" integer NOT NULL,
	"total" integer NOT NULL,
	"finished_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "duel_results_duel_id_user_id_pk" PRIMARY KEY("duel_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "duel_results" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "duels" (
	"id" text PRIMARY KEY NOT NULL,
	"challenger_id" text NOT NULL,
	"opponent_id" text NOT NULL,
	"seed" text NOT NULL,
	"course" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "duels_not_self" CHECK ("duels"."challenger_id" <> "duels"."opponent_id")
);
--> statement-breakpoint
ALTER TABLE "duels" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "portfolio_pages" (
	"user_id" text PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"show_certificates" boolean DEFAULT true NOT NULL,
	"show_belt" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "portfolio_pages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "group_members" ADD COLUMN "share_progress" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "duel_results" ADD CONSTRAINT "duel_results_duel_id_duels_id_fk" FOREIGN KEY ("duel_id") REFERENCES "public"."duels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "duel_results" ADD CONSTRAINT "duel_results_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "duels" ADD CONSTRAINT "duels_challenger_id_user_id_fk" FOREIGN KEY ("challenger_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "duels" ADD CONSTRAINT "duels_opponent_id_user_id_fk" FOREIGN KEY ("opponent_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_pages" ADD CONSTRAINT "portfolio_pages_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "duels_challenger_idx" ON "duels" USING btree ("challenger_id");--> statement-breakpoint
CREATE INDEX "duels_opponent_idx" ON "duels" USING btree ("opponent_id");--> statement-breakpoint
CREATE POLICY "own_rows" ON "duel_results" AS PERMISSIVE FOR ALL TO public USING (user_id = current_setting('app.user_id', true)) WITH CHECK (user_id = current_setting('app.user_id', true));--> statement-breakpoint
CREATE POLICY "duel_select" ON "duels" AS PERMISSIVE FOR SELECT TO public USING ("duels"."challenger_id" = current_setting('app.user_id', true) or "duels"."opponent_id" = current_setting('app.user_id', true));--> statement-breakpoint
CREATE POLICY "duel_insert" ON "duels" AS PERMISSIVE FOR INSERT TO public WITH CHECK ("duels"."challenger_id" = current_setting('app.user_id', true) and exists (select 1 from friendships f where f.status = 'accepted' and ((f.requester_id = current_setting('app.user_id', true) and f.addressee_id = "duels"."opponent_id") or (f.addressee_id = current_setting('app.user_id', true) and f.requester_id = "duels"."opponent_id"))));--> statement-breakpoint
CREATE POLICY "duel_update" ON "duels" AS PERMISSIVE FOR UPDATE TO public USING ("duels"."challenger_id" = current_setting('app.user_id', true) or "duels"."opponent_id" = current_setting('app.user_id', true)) WITH CHECK ("duels"."challenger_id" = current_setting('app.user_id', true) or "duels"."opponent_id" = current_setting('app.user_id', true));--> statement-breakpoint
CREATE POLICY "own_rows" ON "portfolio_pages" AS PERMISSIVE FOR ALL TO public USING (user_id = current_setting('app.user_id', true)) WITH CHECK (user_id = current_setting('app.user_id', true));
--> statement-breakpoint
-- Duello: dettaglio per uno dei due. Il punteggio dell'altro si vede solo quando entrambi hanno finito (o il duello è chiuso).
CREATE OR REPLACE FUNCTION public.duel_detail(p_id text)
RETURNS TABLE (
  id text, status text, expires_at timestamp, seed text, course text, i_am_challenger boolean,
  my_score integer, my_total integer, their_finished boolean, their_score integer, their_nickname text
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  WITH me AS (SELECT nullif(current_setting('app.user_id', true), '') AS uid)
  SELECT d.id, d.status, d.expires_at, d.seed, d.course,
         (d.challenger_id = me.uid),
         mine.score, mine.total,
         (theirs.user_id IS NOT NULL),
         CASE WHEN mine.user_id IS NOT NULL OR d.status IN ('done','expired') THEN theirs.score END,
         sp.nickname
  FROM duels d
  CROSS JOIN me
  LEFT JOIN duel_results mine ON mine.duel_id = d.id AND mine.user_id = me.uid
  LEFT JOIN duel_results theirs ON theirs.duel_id = d.id AND theirs.user_id <> me.uid
  LEFT JOIN social_profiles sp ON sp.user_id = CASE WHEN d.challenger_id = me.uid THEN d.opponent_id ELSE d.challenger_id END
  WHERE d.id = p_id AND me.uid IN (d.challenger_id, d.opponent_id)
$$;--> statement-breakpoint

-- Classe di un docente: solo chi ha creato il gruppo ED è docente (staff_roles), e solo dei membri che hanno dato il consenso.
-- Restituisce numeri, mai email o nomi.
CREATE OR REPLACE FUNCTION public.class_progress(p_group text)
RETURNS TABLE (member_no integer, nickname text, lessons integer, xp integer, last_day text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  WITH me AS (SELECT nullif(current_setting('app.user_id', true), '') AS uid),
  allowed AS (
    SELECT g.id FROM study_groups g, me
    WHERE g.id = p_group AND g.owner_id = me.uid
      AND EXISTS (SELECT 1 FROM staff_roles s WHERE s.user_id = me.uid AND s.role IN ('docente','admin'))
  )
  SELECT (row_number() OVER (ORDER BY m.joined_at))::integer,
         coalesce(sp.nickname, 'Studente ' || (row_number() OVER (ORDER BY m.joined_at))::text),
         (SELECT count(*) FROM lesson_progress lp WHERE lp.user_id = m.user_id AND lp.status = 'completata')::integer,
         coalesce((SELECT sum(x.amount) FROM xp_events x WHERE x.user_id = m.user_id), 0)::integer,
         (SELECT max(x.created_at)::date::text FROM xp_events x WHERE x.user_id = m.user_id)
  FROM group_members m
  JOIN allowed a ON a.id = m.group_id
  LEFT JOIN social_profiles sp ON sp.user_id = m.user_id
  WHERE m.share_progress
$$;--> statement-breakpoint

-- Portfolio pubblico: solo adulti che lo hanno acceso. Soprannome, avatar, XP (se mostrati) e certificati. Nient'altro.
CREATE OR REPLACE FUNCTION public.portfolio_public(p_public_id text)
RETURNS TABLE (nickname text, avatar text, xp integer, certificates jsonb)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT sp.nickname, sp.avatar,
         CASE WHEN pp.show_belt THEN coalesce((SELECT sum(x.amount) FROM xp_events x WHERE x.user_id = sp.user_id), 0)::integer END,
         CASE WHEN pp.show_certificates THEN coalesce((
           SELECT jsonb_agg(jsonb_build_object('course', c.course, 'belt', c.belt, 'issued_at', c.issued_at, 'code', c.public_code) ORDER BY c.issued_at)
           FROM certificates c WHERE c.user_id = sp.user_id), '[]'::jsonb) ELSE '[]'::jsonb END
  FROM social_profiles sp
  JOIN portfolio_pages pp ON pp.user_id = sp.user_id
  WHERE sp.public_id = p_public_id AND pp.enabled AND sp.nickname IS NOT NULL AND sp.age_group = 'adulti'
$$;--> statement-breakpoint

REVOKE ALL ON FUNCTION public.duel_detail(text) FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.class_progress(text) FROM PUBLIC;--> statement-breakpoint
REVOKE ALL ON FUNCTION public.portfolio_public(text) FROM PUBLIC;--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cyberdojo_app') THEN
    GRANT SELECT, INSERT, UPDATE ON TABLE public.duels TO cyberdojo_app;
    GRANT SELECT, INSERT ON TABLE public.duel_results TO cyberdojo_app;
    GRANT SELECT, INSERT, UPDATE ON TABLE public.portfolio_pages TO cyberdojo_app;
    GRANT EXECUTE ON FUNCTION public.duel_detail(text) TO cyberdojo_app;
    GRANT EXECUTE ON FUNCTION public.class_progress(text) TO cyberdojo_app;
    GRANT EXECUTE ON FUNCTION public.portfolio_public(text) TO cyberdojo_app;
  END IF;
END
$$;
