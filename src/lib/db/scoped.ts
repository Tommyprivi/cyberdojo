import { sql } from "drizzle-orm";
import { getDb } from "./index";

type Tx = Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0];

/**
 * Esegue `fn` in una transazione in cui `app.user_id` vale l'utente corrente.
 * Le policy RLS leggono quel valore, quindi anche una query dimenticata senza filtro
 * non può toccare righe di altri utenti (se l'app usa un ruolo non proprietario).
 * `set_config(..., true)` vale solo per la transazione.
 */
export async function withUser<T>(userId: string, fn: (tx: Tx) => Promise<T>): Promise<T> {
  if (!userId) throw new Error("withUser richiede un userId.");
  return getDb().transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.user_id', ${userId}, true)`);
    return fn(tx);
  });
}
