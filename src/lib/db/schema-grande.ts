import { sql } from "drizzle-orm";
import { boolean, check, index, integer, jsonb, pgPolicy, pgTable, primaryKey, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { user } from "./schema";

/*
  Tabelle dell'aggiornamento «CyberDojo 2.0» (migrazione 0006). Stesse due barriere del resto del database:
  filtro per utente lato server + RLS. Le letture che coinvolgono dati di ALTRI utenti (conteggi delle reazioni,
  classifica per corso, destinatari delle notifiche) passano da funzioni SECURITY DEFINER in sola lettura
  (drizzle/0006_*.sql). Riesportato da schema.ts, perché drizzle-kit legge un solo file di schema.
*/

const me = sql.raw("current_setting('app.user_id', true)");
const ownRow = (column: string) =>
  pgPolicy("own_rows", { for: "all", using: sql`${sql.raw(column)} = ${me}`, withCheck: sql`${sql.raw(column)} = ${me}` });

/** Chi è dello staff: può scrivere gli annunci. Si assegna dal database (nessuna policy di scrittura per l'app). */
export const staffRoles = pgTable(
  "staff_roles",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["staff", "admin"] }).notNull().default("staff"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [pgPolicy("own_staff_row", { for: "select", using: sql`${t.userId} = ${me}` })],
).enableRLS();

const isStaff = sql`exists (select 1 from staff_roles s where s.user_id = ${me})`;

/** Gli annunci (prima solo file in content/announcements). Testo semplice o Markdown, mai MDX. */
export const announcements = pgTable(
  "announcements",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    summary: text("summary").notNull().default(""),
    body: text("body").notNull().default(""),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    pinned: boolean("pinned").notNull().default(false),
    authorId: text("author_id").references(() => user.id, { onDelete: "set null" }),
    publishedAt: timestamp("published_at").notNull().defaultNow(),
  },
  (t) => [
    index("announcements_published_idx").on(t.publishedAt),
    pgPolicy("announcements_read", { for: "select", using: sql`true` }),
    pgPolicy("announcements_staff_insert", { for: "insert", withCheck: isStaff }),
    pgPolicy("announcements_staff_update", { for: "update", using: isStaff, withCheck: isStaff }),
    pgPolicy("announcements_staff_delete", { for: "delete", using: isStaff }),
  ],
).enableRLS();

/** Una reazione (emoji da elenco chiuso) per persona e per annuncio. */
export const announcementReactions = pgTable(
  "announcement_reactions",
  {
    // Senza chiave esterna: gli annunci possono arrivare da content/announcements (file) oltre che dalla tabella.
    announcementId: text("announcement_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    emoji: text("emoji").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.announcementId, t.userId] }),
    check("announcement_reactions_emoji", sql`${t.emoji} in ('👍','🔥','🎉','❤️','🤯','👏')`),
    ownRow("user_id"),
  ],
).enableRLS();

/** Commenti «a frasi»: elenco chiuso, nessun testo libero (utenti dai 14 anni). Si vedono solo i conteggi. */
export const announcementPhrases = pgTable(
  "announcement_phrases",
  {
    // Senza chiave esterna: gli annunci possono arrivare da content/announcements (file) oltre che dalla tabella.
    announcementId: text("announcement_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    phraseKey: text("phrase_key").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.announcementId, t.userId, t.phraseKey] }),
    check(
      "announcement_phrases_key",
      sql`${t.phraseKey} in ('grazie','bellissimo','non-vedo-lora','ottimo-lavoro','ho-una-domanda','funziona-bene','ho-unidea')`,
    ),
    ownRow("user_id"),
  ],
).enableRLS();

/** Prove di padronanza (un test per modulo) e test d'ingresso (uno per corso). `scope`: «modulo:F.05» o «ingresso:F». */
export const masteryAttempts = pgTable(
  "mastery_attempts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    scope: text("scope").notNull(),
    score: integer("score").notNull(),
    total: integer("total").notNull(),
    passed: boolean("passed").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("mastery_user_scope_idx").on(t.userId, t.scope), ownRow("user_id")],
).enableRLS();

/** Un dispositivo che ha acconsentito alle notifiche. `kinds`: studio, novita, sfide. */
export const pushSubscriptions = pgTable(
  "push_subscriptions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    endpoint: text("endpoint").notNull(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    kinds: jsonb("kinds").$type<string[]>().notNull().default(["studio", "novita", "sfide"]),
    hour: integer("hour").notNull().default(18),
    lastStudyDay: text("last_study_day"),
    lastNewsId: text("last_news_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("push_endpoint").on(t.endpoint), index("push_user_idx").on(t.userId), ownRow("user_id")],
).enableRLS();
