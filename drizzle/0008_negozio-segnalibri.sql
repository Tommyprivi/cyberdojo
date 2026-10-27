CREATE TABLE "lesson_bookmarks" (
	"user_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"screen" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "lesson_bookmarks_user_id_lesson_id_screen_pk" PRIMARY KEY("user_id","lesson_id","screen")
);
--> statement-breakpoint
ALTER TABLE "lesson_bookmarks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "shop_purchases" (
	"user_id" text NOT NULL,
	"item_id" text NOT NULL,
	"equipped" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shop_purchases_user_id_item_id_pk" PRIMARY KEY("user_id","item_id")
);
--> statement-breakpoint
ALTER TABLE "shop_purchases" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "lesson_bookmarks" ADD CONSTRAINT "lesson_bookmarks_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shop_purchases" ADD CONSTRAINT "shop_purchases_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "own_rows" ON "lesson_bookmarks" AS PERMISSIVE FOR ALL TO public USING (user_id = current_setting('app.user_id', true)) WITH CHECK (user_id = current_setting('app.user_id', true));--> statement-breakpoint
CREATE POLICY "own_rows" ON "shop_purchases" AS PERMISSIVE FOR ALL TO public USING (user_id = current_setting('app.user_id', true)) WITH CHECK (user_id = current_setting('app.user_id', true));
--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cyberdojo_app') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.shop_purchases, public.lesson_bookmarks TO cyberdojo_app;
  END IF;
END
$$;
