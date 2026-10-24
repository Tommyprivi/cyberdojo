import { sql } from "drizzle-orm";
import { boolean, check, index, pgPolicy, pgTable, primaryKey, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { user } from "./schema";

/*
  Tabelle del lato social (vedi docs/social.md). Stesse due barriere del resto del database:
  filtro per utente lato server + RLS. In più:
  - i dati degli ALTRI utenti (classifiche, amici, gruppi) si leggono SOLO tramite funzioni
    SECURITY DEFINER in sola lettura (drizzle/0005_*.sql), che restituiscono solo soprannome,
    avatar e punti di chi ha dato il consenso;
  - trigger nel database ripetono le regole di età e i limiti (seconda barriera).
  Questo file è riesportato da schema.ts, perché drizzle-kit legge un solo file di schema.
*/

const me = sql.raw("current_setting('app.user_id', true)");
const ownRow = (column: string) =>
  pgPolicy("own_rows", { for: "all", using: sql`${sql.raw(column)} = ${me}`, withCheck: sql`${sql.raw(column)} = ${me}` });

/** Un profilo social per utente. Esiste solo dopo che l'utente ha scelto un soprannome. */
export const socialProfiles = pgTable(
  "social_profiles",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    // Identificativo pubblico opaco: è l'unico che gli altri vedono (mai l'id dell'account).
    publicId: text("public_id").notNull().unique(),
    nickname: text("nickname"),
    // Soprannome senza maiuscole né separatori: garantisce l'unicità ("Ninja_1" = "ninja1").
    nicknameKey: text("nickname_key").unique(),
    avatar: text("avatar").notNull().default("sensei"),
    // Fotografia della fascia d'età dichiarata: minori (14-17) o adulti. Se la fascia cambia, il social si azzera.
    ageGroup: text("age_group", { enum: ["minori", "adulti"] }).notNull(),
    // Tre consensi separati, spenti di default.
    joinLeaderboard: boolean("join_leaderboard").notNull().default(false),
    showToFriends: boolean("show_to_friends").notNull().default(false),
    acceptRequests: boolean("accept_requests").notNull().default(false),
    friendCode: text("friend_code").unique(),
    nicknameChangedAt: timestamp("nickname_changed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  () => [ownRow("user_id")],
).enableRLS();

/** Amicizia tra due utenti: la crea chi inserisce il codice, la accetta chi lo ha generato. */
export const friendships = pgTable(
  "friendships",
  {
    id: text("id").primaryKey(),
    requesterId: text("requester_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    addresseeId: text("addressee_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: text("status", { enum: ["pending", "accepted"] }).notNull().default("pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    acceptedAt: timestamp("accepted_at"),
  },
  (t) => [
    // Una sola riga per coppia, in qualunque direzione.
    uniqueIndex("friendships_pair").on(sql`least(${t.requesterId}, ${t.addresseeId})`, sql`greatest(${t.requesterId}, ${t.addresseeId})`),
    index("friendships_requester_idx").on(t.requesterId),
    index("friendships_addressee_idx").on(t.addresseeId),
    check("friendships_not_self", sql`${t.requesterId} <> ${t.addresseeId}`),
    pgPolicy("friend_select", { for: "select", using: sql`${t.requesterId} = ${me} or ${t.addresseeId} = ${me}` }),
    pgPolicy("friend_insert", { for: "insert", withCheck: sql`${t.requesterId} = ${me} and ${t.status} = 'pending'` }),
    // Solo chi riceve la richiesta può accettarla.
    pgPolicy("friend_accept", { for: "update", using: sql`${t.addresseeId} = ${me}`, withCheck: sql`${t.addresseeId} = ${me} and ${t.status} = 'accepted'` }),
    pgPolicy("friend_delete", { for: "delete", using: sql`${t.requesterId} = ${me} or ${t.addresseeId} = ${me}` }),
  ],
).enableRLS();

/** Gruppo di studio o classe. Il nome è composto da elenchi chiusi (nessun testo libero). */
export const studyGroups = pgTable(
  "study_groups",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    // A chi è aperto: solo ai ragazzi 14-17 (con l'adulto responsabile come creatore) oppure solo agli adulti.
    audience: text("audience", { enum: ["minori", "adulti"] }).notNull(),
    joinCode: text("join_code").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("study_groups_owner_idx").on(t.ownerId), ownRow("owner_id")],
).enableRLS();

export const groupMembers = pgTable(
  "group_members",
  {
    groupId: text("group_id")
      .notNull()
      .references(() => studyGroups.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.groupId, t.userId] }), index("group_members_user_idx").on(t.userId), ownRow("user_id")],
).enableRLS();

/** Blocchi di chi segnala (o blocca): utenti o gruppi, per identificativo pubblico. */
export const socialBlocks = pgTable(
  "social_blocks",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    kind: text("kind", { enum: ["user", "group"] }).notNull(),
    targetId: text("target_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.kind, t.targetId] }), ownRow("user_id")],
).enableRLS();

/**
 * Segnalazioni: SOLO identificativo dell'elemento, motivo (elenco chiuso) e data. Nessun dato di chi
 * segnala, nessun testo libero. L'app può solo inserire: non può leggerle (nessuna policy di lettura).
 */
export const socialReports = pgTable(
  "social_reports",
  {
    id: text("id").primaryKey(),
    kind: text("kind", { enum: ["user", "group"] }).notNull(),
    targetId: text("target_id").notNull(),
    reason: text("reason", { enum: ["offensivo", "molestie", "personale", "sicurezza", "altro"] }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  () => [pgPolicy("report_insert_only", { for: "insert", withCheck: sql`true` })],
).enableRLS();

/** Iscrizioni volontarie alle sfide settimanali. Lo stato di avanzamento si calcola, non si salva. */
export const challengeEntries = pgTable(
  "challenge_entries",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    challengeId: text("challenge_id").notNull(),
    weekStart: text("week_start").notNull(), // lunedì della settimana, YYYY-MM-DD (ora italiana)
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.weekStart, t.challengeId] }), ownRow("user_id")],
).enableRLS();
