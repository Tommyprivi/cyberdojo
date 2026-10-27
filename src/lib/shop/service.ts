import { and, eq, sql } from "drizzle-orm";
import { schema } from "../db";
import { withUser, type Tx } from "../db/scoped";
import { checkEquip, checkPurchase, coinBalance } from "./rules";

export type ShopState = {
  xp: number;
  coins: number;
  owned: string[];
  equipped: string[];
};
export type ShopResult = { ok: true } | { ok: false; error: string };

async function load(tx: Tx, userId: string) {
  const [{ total }] = await tx
    .select({
      total: sql<number>`coalesce(sum(${schema.xpEvents.amount}), 0)::int`,
    })
    .from(schema.xpEvents)
    .where(eq(schema.xpEvents.userId, userId));
  const rows = await tx
    .select({
      itemId: schema.shopPurchases.itemId,
      equipped: schema.shopPurchases.equipped,
    })
    .from(schema.shopPurchases)
    .where(eq(schema.shopPurchases.userId, userId));
  return {
    xp: total,
    owned: rows.map((r) => r.itemId),
    equipped: rows.filter((r) => r.equipped).map((r) => r.itemId),
  };
}

/** Saldo e oggetti dell'utente. Il saldo si calcola qui, sul server. */
export async function getShopState(userId: string): Promise<ShopState> {
  return withUser(userId, async (tx) => {
    const s = await load(tx, userId);
    return { ...s, coins: coinBalance(s.xp, s.owned) };
  });
}

/** Solo gli oggetti equipaggiati (per mostrare il Sensei nel profilo). */
export async function getEquippedIds(userId: string): Promise<string[]> {
  try {
    return await withUser(userId, async (tx) =>
      (
        await tx
          .select({ itemId: schema.shopPurchases.itemId })
          .from(schema.shopPurchases)
          .where(
            and(
              eq(schema.shopPurchases.userId, userId),
              eq(schema.shopPurchases.equipped, true),
            ),
          )
      ).map((r) => r.itemId),
    );
  } catch {
    // Il profilo deve aprirsi anche se la tabella del negozio non c'è ancora (migrazione 0008 non applicata).
    return [];
  }
}

export async function buyItem(
  userId: string,
  itemId: string,
): Promise<ShopResult> {
  return withUser(userId, async (tx) => {
    // Blocca le richieste parallele dello stesso utente: niente doppio acquisto né saldo negativo.
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtext(${"shop:" + userId}))`,
    );
    const s = await load(tx, userId);
    const check = checkPurchase(s.xp, s.owned, itemId);
    if (!check.ok) return check;
    await tx
      .insert(schema.shopPurchases)
      .values({ userId, itemId, equipped: false });
    return { ok: true };
  });
}

export async function toggleEquip(
  userId: string,
  itemId: string,
): Promise<ShopResult> {
  return withUser(userId, async (tx) => {
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtext(${"shop:" + userId}))`,
    );
    const s = await load(tx, userId);
    const check = checkEquip(s.owned, s.equipped, itemId);
    if (!check.ok) return check;
    const wanted = new Set(check.equipped);
    for (const id of s.owned) {
      const eq2 = wanted.has(id);
      if (eq2 !== s.equipped.includes(id)) {
        await tx
          .update(schema.shopPurchases)
          .set({ equipped: eq2 })
          .where(
            sql`${schema.shopPurchases.userId} = ${userId} and ${schema.shopPurchases.itemId} = ${id}`,
          );
      }
    }
    return { ok: true };
  });
}
