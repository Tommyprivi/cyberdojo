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
    role: text("role", { enum: ["staff", "admin", "docente"] }).notNull().default("staff"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [pgPolicy("own_staff_row", { for: "select", using: sql`${t.userId} = ${me}` })],
).enableRLS();

// Solo staff e admin scrivono gli annunci: il docente (altro ruolo) no.
const isStaff = sql`exists (select 1 from staff_roles s where s.user_id = ${me} and s.role in ('staff', 'admin'))`;

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

/** Oggetti del negozio (colori e accessori del Sensei) comprati con le monete guadagnate studiando. Niente soldi veri. */
export const shopPurchases = pgTable(
  "shop_purchases",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    itemId: text("item_id").notNull(),
    equipped: boolean("equipped").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.itemId] }), ownRow("user_id")],
).enableRLS();

/** Segnalibri: una schermata di una lezione da ritrovare. */
export const lessonBookmarks = pgTable(
  "lesson_bookmarks",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id").notNull(),
    screen: integer("screen").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId, t.screen] }), ownRow("user_id")],
).enableRLS();

/** Duello a turni tra due amici: stesse domande (dal seme), si risponde entro 24 ore, vince il punteggio più alto. */
export const duels = pgTable(
  "duels",
  {
    id: text("id").primaryKey(),
    challengerId: text("challenger_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    opponentId: text("opponent_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    seed: text("seed").notNull(),
    course: text("course"),
    status: text("status", { enum: ["pending", "active", "done", "declined", "expired"] }).notNull().default("pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (t) => [
    index("duels_challenger_idx").on(t.challengerId),
    index("duels_opponent_idx").on(t.opponentId),
    check("duels_not_self", sql`${t.challengerId} <> ${t.opponentId}`),
    pgPolicy("duel_select", { for: "select", using: sql`${t.challengerId} = ${me} or ${t.opponentId} = ${me}` }),
    // Si sfida solo un amico (amicizia accettata).
    pgPolicy("duel_insert", {
      for: "insert",
      withCheck: sql`${t.challengerId} = ${me} and exists (select 1 from friendships f where f.status = 'accepted' and ((f.requester_id = ${me} and f.addressee_id = ${t.opponentId}) or (f.addressee_id = ${me} and f.requester_id = ${t.opponentId})))`,
    }),
    pgPolicy("duel_update", { for: "update", using: sql`${t.challengerId} = ${me} or ${t.opponentId} = ${me}`, withCheck: sql`${t.challengerId} = ${me} or ${t.opponentId} = ${me}` }),
  ],
).enableRLS();

/** Il risultato di ciascuno nel duello. L'avversario vede il tuo punteggio solo a duello concluso (funzione duel_detail). */
export const duelResults = pgTable(
  "duel_results",
  {
    duelId: text("duel_id").notNull().references(() => duels.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    total: integer("total").notNull(),
    finishedAt: timestamp("finished_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.duelId, t.userId] }), ownRow("user_id")],
).enableRLS();

/** Pagina pubblica facoltativa (portfolio): spenta di default. Mostra solo soprannome, avatar, cintura e certificati. Solo adulti. */
export const portfolioPages = pgTable(
  "portfolio_pages",
  {
    userId: text("user_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
    enabled: boolean("enabled").notNull().default(false),
    showCertificates: boolean("show_certificates").notNull().default(true),
    showBelt: boolean("show_belt").notNull().default(true),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  () => [ownRow("user_id")],
).enableRLS();
