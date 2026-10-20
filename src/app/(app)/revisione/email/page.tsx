import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { EmailReview } from "@/components/review/email-review";
import { emailKey, type EMAIL_REVIEW_IDS } from "@/lib/content/reviews";
import { readReviews } from "@/lib/content/reviews-store";
import { internalToolsEnabled } from "@/lib/internal";
import { magicLinkEmail, reminderEmail, verificationEmail, welcomeEmail } from "@/lib/mail/templates";

export const metadata: Metadata = { title: "Anteprima email", robots: { index: false, follow: false } };

/** Strumento interno: tutte le email del sito come le vedrebbe chi le riceve, con dati di prova. */
export default function EmailPreview() {
  return (
    <Suspense fallback={<p className="p-6">Carico le email…</p>}>
      <Emails />
    </Suspense>
  );
}

async function Emails() {
  await connection();
  if (!internalToolsEnabled()) notFound();
  const reviews = readReviews();

  const mails: { id: (typeof EMAIL_REVIEW_IDS)[number]; label: string; mail: ReturnType<typeof magicLinkEmail> }[] = [
    { id: "magic", label: "Link di accesso", mail: magicLinkEmail({ url: "https://cyberdojo.it/api/auth/magic-link/verify?token=prova" }) },
    { id: "verify", label: "Conferma email", mail: verificationEmail({ name: "Giulia Rossi", email: "giulia@example.com", url: "https://cyberdojo.it/api/auth/verify-email?token=prova" }) },
    { id: "welcome", label: "Benvenuto", mail: welcomeEmail({ name: "Giulia Rossi", email: "giulia@example.com" }) },
    {
      id: "remind-serie",
      label: "Promemoria (con una serie in corso)",
      mail: reminderEmail({ name: "Giulia Rossi", email: "giulia@example.com", streak: 6, nextLessonTitle: "Che cos'è un indirizzo IP", unsubscribeUrl: "https://cyberdojo.it/disiscrizione?token=prova" }),
    },
    {
      id: "remind-zero",
      label: "Promemoria (serie a zero)",
      mail: reminderEmail({ name: null, email: "marco@example.com", streak: 0, nextLessonTitle: null, unsubscribeUrl: "https://cyberdojo.it/disiscrizione?token=prova" }),
    },
  ];

  return (
    <div className="mx-auto grid max-w-5xl gap-8">
      <p><a href="/revisione" className="font-semibold text-primary underline">← Centro di revisione</a></p>
      <header className="grid gap-2">
        <h1 className="font-display text-3xl font-semibold">Anteprima delle email</h1>
        <p className="text-muted">Dati di prova. In produzione questa pagina è chiusa. Ogni email ha anche una versione solo testo, per chi non vede le immagini o i colori.</p>
      </header>
      {mails.map(({ id, label, mail }) => (
        <section key={id} className="card grid gap-3 p-5" aria-labelledby={id}>
          <h2 id={id} className="font-display text-xl font-semibold">{label}</h2>
          <p className="text-sm text-muted">Oggetto: <strong className="text-fg">{mail.subject}</strong></p>
          <iframe title={`Anteprima: ${label}`} sandbox="" srcDoc={mail.html} className="h-[560px] w-full rounded-lg border border-border bg-white" />
          <details>
            <summary className="cursor-pointer font-semibold">Versione solo testo</summary>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg bg-surface-muted p-3 text-sm">{mail.text}</pre>
          </details>
        <EmailReview id={id} seen={!!reviews[emailKey(id)]?.approved} note={reviews[emailKey(id)]?.note ?? ""} />
        </section>
      ))}
    </div>
  );
}
