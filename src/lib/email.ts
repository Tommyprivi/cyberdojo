type Mail = { to: string; subject: string; text: string };

/** Con RESEND_API_KEY invia via Resend; senza (sviluppo) stampa in console. */
export async function sendEmail({ to, subject, text }: Mail): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Invio email non configurato (RESEND_API_KEY, EMAIL_FROM).");
    }
    console.log(`\n[email di sviluppo] a: ${to}\noggetto: ${subject}\n${text}\n`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, text }),
  });
  if (!res.ok) throw new Error(`Resend ha risposto ${res.status}`);
}
