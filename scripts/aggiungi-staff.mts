/**
 * Mette una persona nello staff (può scrivere gli annunci). Si usa dal proprietario del database:
 *   npx tsx --env-file=.env.local scripts/aggiungi-staff.mts nome@esempio.it
 *   ... --togli  per toglierla.
 *   ... --ruolo docente  per dare il ruolo DOCENTE (classi e progressi degli studenti consenzienti). Senza opzione: staff.
 * Il docente NON scrive gli annunci; lo staff non vede le classi. Per cambiare ruolo rilancia con l'altro.
 * L'app non può farlo da sola: la regola di sicurezza del database lo vieta apposta.
 */
import { Pool } from "@neondatabase/serverless";
import { parseRoleArg } from "../src/lib/docente/rules";

const email = process.argv.slice(2).find((a, i, all) => !a.startsWith("--") && all[i - 1] !== "--ruolo")?.trim().toLowerCase();
const parsedRole = parseRoleArg(process.argv.slice(2));
if (!parsedRole.ok) {
  console.error(parsedRole.error);
  process.exit(1);
}
const role = parsedRole.role;
const remove = process.argv.includes("--togli");
if (!email || !email.includes("@")) {
  console.error("Scrivi l'email dell'account: npx tsx --env-file=.env.local scripts/aggiungi-staff.mts nome@esempio.it");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  const found = await pool.query<{ id: string; email_verified: boolean }>(
    `select id, email_verified from "user" where lower(email) = $1`,
    [email],
  );
  if (found.rowCount === 0) {
    console.error(`Nessun account con l'email ${email}.`);
    process.exit(1);
  }
  const { id, email_verified } = found.rows[0];
  if (remove) {
    await pool.query(`delete from staff_roles where user_id = $1`, [id]);
    console.log(`${email} non è più nello staff.`);
  } else {
    // La verifica delle email non è ancora attiva (serve il dominio): qui scegli tu, dal tuo computer, a chi dare il ruolo.
    if (!email_verified) console.warn("Attenzione: l'email di questo account non è verificata. Procedo perché sei tu a sceglierlo.");
    // Una riga sola per persona: se esiste già, il ruolo viene aggiornato (staff <-> docente).
    await pool.query(`insert into staff_roles (user_id, role) values ($1, $2) on conflict (user_id) do update set role = excluded.role`, [id, role]);
    console.log(role === "docente" ? `${email} ora è docente verificato.` : `${email} ora è nello staff.`);
  }
} finally {
  await pool.end();
}
