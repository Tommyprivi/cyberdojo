import { sql } from "drizzle-orm";
import { AGE_BANDS } from "../age-bands";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgPolicy,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/*
  Sicurezza dei dati, due barriere:
  1. ogni query lato server filtra per utente (vedi src/lib/db/scoped.ts);
  2. policy RLS su ogni tabella con dati personali. La sessione imposta
     `app.user_id` con set_config. ATTENZIONE: RLS non vale per il proprietario della
     tabella. L'app deve collegarsi con un ruolo NON proprietario (vedi docs/database.md).
*/

const ownRow = (column: string) =>
  pgPolicy("own_rows", {
    for: "all",
    using: sql.raw(`${column} = current_setting('app.user_id', true)`),
    withCheck: sql.raw(`${column} = current_setting('app.user_id', true)`),
  });

// ---------- Better Auth (nomi e colonne richiesti dalla libreria) ----------

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- Dati CyberDojo ----------


export const profiles = pgTable(
  "profiles",
  {
    id: text("id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    username: text("username").unique(),
    locale: text("locale").notNull().default("it"),
    timezone: text("timezone").notNull().default("Europe/Rome"),
    dailyGoal: integer("daily_goal").notNull().default(1), // 1, 2 o 3 lezioni
    // Solo la fascia, mai la data di nascita (minimizzazione GDPR).
    ageBand: text("age_band", { enum: AGE_BANDS }),
    confirmedAge14: boolean("confirmed_age_14").notNull().default(false),
    goal: text("goal"), // lavoro SOC, pentester, curiosità, sicurezza personale, scuola
    dailyMinutes: integer("daily_minutes"),
    placementDone: boolean("placement_done").notNull().default(false),
    // Promemoria di studio via email: spenti di default. Si attivano solo con il consenso esplicito
    // dell'utente, che sceglie l'ora (nel proprio fuso). `lastReminderDay` evita il doppio invio nello stesso giorno.
    reminderEmail: boolean("reminder_email").notNull().default(false),
    reminderHour: integer("reminder_hour").notNull().default(18),
    lastReminderDay: text("last_reminder_day"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  () => [ownRow("id")],
).enableRLS();

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id").notNull(),
    status: text("status", { enum: ["in_corso", "completata"] }).notNull(),
    completedAt: timestamp("completed_at"),
    attempts: integer("attempts").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId] }), ownRow("user_id")],
).enableRLS();

export const attempts = pgTable(
  "attempts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id"), // null per esercizi dell'area Pratica
    exerciseId: text("exercise_id"),
    seed: text("seed").notNull(),
    result: jsonb("result"),
    score: real("score").notNull(),
    passed: boolean("passed").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("attempts_user_idx").on(t.userId, t.createdAt), ownRow("user_id")],
).enableRLS();

export const xpEvents = pgTable(
  "xp_events",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    amount: integer("amount").notNull(),
    refId: text("ref_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    // Un evento XP per (utente, tipo, riferimento): niente XP doppi sulla stessa lezione.
    uniqueIndex("xp_once").on(t.userId, t.kind, t.refId),
    ownRow("user_id"),
  ],
).enableRLS();

export const streaks = pgTable(
  "streaks",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    current: integer("current").notNull().default(0),
    best: integer("best").notNull().default(0),
    lastDay: text("last_day"), // YYYY-MM-DD nel fuso dell'utente
    freezes: integer("freezes").notNull().default(0), // massimo 2
  },
  () => [ownRow("user_id")],
).enableRLS();

export const reviewItems = pgTable(
  "review_items",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    itemId: text("item_id").notNull(),
    box: integer("box").notNull().default(1), // scatole Leitner: 1, 3, 7, 21 giorni
    dueAt: timestamp("due_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.itemId] }), ownRow("user_id")],
).enableRLS();

export const exams = pgTable("exams", {
  id: text("id").primaryKey(),
  course: text("course").notNull(),
  module: integer("module"),
  kind: text("kind", { enum: ["modulo", "cintura"] }).notNull(),
  passPct: integer("pass_pct").notNull().default(80),
  minutes: integer("minutes").notNull(),
});

export const examAttempts = pgTable(
  "exam_attempts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    examId: text("exam_id")
      .notNull()
      .references(() => exams.id),
    seed: text("seed").notNull(),
    score: real("score").notNull(),
    passed: boolean("passed").notNull(),
    cooldownUntil: timestamp("cooldown_until"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  () => [ownRow("user_id")],
).enableRLS();

export const certificates = pgTable("certificates", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  course: text("course").notNull(),
  belt: text("belt").notNull(),
  issuedAt: timestamp("issued_at").notNull().defaultNow(),
  // Codice pubblico non indovinabile per il link di verifica.
  publicCode: text("public_code").notNull().unique(),
});

export const notes = pgTable(
  "notes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id").notNull(),
    body: text("body").notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId] }), ownRow("user_id")],
).enableRLS();

export const audioAssets = pgTable("audio_assets", {
  hash: text("hash").primaryKey(), // sha256(testo + voce + modello)
  lessonId: text("lesson_id").notNull(),
  screen: integer("screen").notNull(),
  voice: text("voice").notNull(),
  url: text("url").notNull(),
  durationS: real("duration_s"),
});
