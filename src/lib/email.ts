import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Mail } from "./mail/templates";

export type Outgoing = {
  to: string;
  mail: Mail;
  /** Intestazioni extra, ad esempio List-Unsubscribe per i promemoria. */
  headers?: Record<string, string>;
};

/**
 * Con RESEND_API_KEY ed EMAIL_FROM invia via Resend. Senza (sviluppo) non spedisce nulla: stampa il
 * messaggio nel terminale e ne salva l'HTML in .outbox/, da aprire nel browser per vederlo com'è.
 * In produzione, senza configurazione, è un errore: meglio fallire che far finta di aver mandato.
 */
export async function sendMail({ to, mail, headers }: Outgoing): Promise<{ delivered: boolean }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!key || !from) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Invio email non configurato (RESEND_API_KEY, EMAIL_FROM).");
    }
    console.log(`\n[email di sviluppo] a: ${to}\noggetto: ${mail.subject}\n${mail.text}\n`);
    try {
      const dir = path.join(process.cwd(), ".outbox");
      mkdirSync(dir, { recursive: true });
      const safe = to.replace(/[^a-z0-9@._-]/gi, "_");
      writeFileSync(path.join(dir, `${Date.now()}-${safe}.html`), mail.html);
    } catch {
      /* la copia su disco è solo una comodità */
    }
    return { delivered: false };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject: mail.subject, html: mail.html, text: mail.text, ...(headers ? { headers } : {}) }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Resend ha risposto ${res.status}`);
  return { delivered: true };
}
