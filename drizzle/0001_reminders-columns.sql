ALTER TABLE "profiles" ADD COLUMN "reminder_email" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "reminder_hour" integer DEFAULT 18 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "last_reminder_day" text;