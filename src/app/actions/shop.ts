"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSessionUser } from "@/lib/session";
import * as shop from "@/lib/shop/service";

/** Azioni del negozio: l'utente viene dalla sessione, il prezzo e il saldo dal server. Dal browser arriva solo l'id dell'oggetto. */

const idSchema = z.string().min(1).max(60);
type R = shop.ShopResult;
const NO_SESSION: R = { ok: false, error: "Devi accedere." };

async function run(raw: unknown, fn: (userId: string, id: string) => Promise<R>): Promise<R> {
  const user = await getSessionUser();
  if (!user) return NO_SESSION;
  const id = idSchema.safeParse(raw);
  if (!id.success) return { ok: false, error: "Oggetto non valido." };
  const r = await fn(user.id, id.data);
  if (r.ok) {
    revalidatePath("/negozio");
    revalidatePath("/profilo");
  }
  return r;
}

export async function buyItemAction(itemId: unknown): Promise<R> {
  return run(itemId, shop.buyItem);
}

export async function equipItemAction(itemId: unknown): Promise<R> {
  return run(itemId, shop.toggleEquip);
}
