import { getItem, type ShopSlot } from "./items";

/** 10 XP = 1 moneta (si arrotonda per difetto). */
export const XP_PER_COIN = 10;

export const coinsEarned = (totalXp: number): number => Math.floor(Math.max(0, totalXp) / XP_PER_COIN);

/** Monete spese: somma dei prezzi (dal catalogo) degli oggetti posseduti. Id sconosciuti non contano. */
export function coinsSpent(ownedIds: readonly string[]): number {
  let total = 0;
  for (const id of new Set(ownedIds)) total += getItem(id)?.price ?? 0;
  return total;
}

export const coinBalance = (totalXp: number, ownedIds: readonly string[]): number =>
  Math.max(0, coinsEarned(totalXp) - coinsSpent(ownedIds));

export type PurchaseCheck = { ok: true; price: number; balanceAfter: number } | { ok: false; error: string };

/** Regole d'acquisto: oggetto del catalogo, mai due volte, mai sotto zero. Il prezzo viene dal catalogo, non dal browser. */
export function checkPurchase(totalXp: number, ownedIds: readonly string[], itemId: string): PurchaseCheck {
  const item = getItem(itemId);
  if (!item) return { ok: false, error: "Oggetto non trovato." };
  if (ownedIds.includes(itemId)) return { ok: false, error: "Ce l'hai già." };
  const balance = coinBalance(totalXp, ownedIds);
  if (balance < item.price) {
    const missing = item.price - balance;
    return { ok: false, error: `Ti ${missing === 1 ? "manca 1 moneta" : `mancano ${missing} monete`}.` };
  }
  return { ok: true, price: item.price, balanceAfter: balance - item.price };
}

export type EquipResult = { ok: true; equipped: string[]; changed: "on" | "off" } | { ok: false; error: string };

/**
 * Equipaggia (o toglie) un oggetto posseduto. Per ogni tipo (fascia, cappello, sfondo) ne vale uno solo:
 * equipaggiarne un altro dello stesso tipo sostituisce il precedente.
 */
export function checkEquip(ownedIds: readonly string[], equippedIds: readonly string[], itemId: string): EquipResult {
  const item = getItem(itemId);
  if (!item) return { ok: false, error: "Oggetto non trovato." };
  if (!ownedIds.includes(itemId)) return { ok: false, error: "Prima devi comprarlo." };
  if (equippedIds.includes(itemId)) return { ok: true, equipped: equippedIds.filter((i) => i !== itemId), changed: "off" };
  const slot: ShopSlot = item.slot;
  const kept = equippedIds.filter((i) => getItem(i)?.slot !== slot);
  return { ok: true, equipped: [...kept, itemId], changed: "on" };
}
