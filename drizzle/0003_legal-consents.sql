CREATE TABLE "legal_consents" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"doc" text NOT NULL,
	"version" text NOT NULL,
	"accepted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "legal_consents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "certificates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "legal_consents" ADD CONSTRAINT "legal_consents_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "consents_user_idx" ON "legal_consents" USING btree ("user_id");--> statement-breakpoint
CREATE POLICY "own_rows" ON "certificates" AS PERMISSIVE FOR ALL TO public USING (user_id = current_setting('app.user_id', true)) WITH CHECK (user_id = current_setting('app.user_id', true));--> statement-breakpoint
CREATE POLICY "own_rows" ON "legal_consents" AS PERMISSIVE FOR ALL TO public USING (user_id = current_setting('app.user_id', true)) WITH CHECK (user_id = current_setting('app.user_id', true));