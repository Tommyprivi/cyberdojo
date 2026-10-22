import type { Metadata } from "next";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Mascot } from "@/components/mascot";
import { readAnnouncements } from "@/lib/announcements";

export const metadata: Metadata = {
  title: "Aggiornamenti",
  description: "Che cosa cambia in CyberDojo, aggiornamento per aggiornamento.",
};

export default function AggiornamentiPage() {
  const list = readAnnouncements();
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="flex items-start gap-4">
        <Mascot size={72} mood="happy" className="shrink-0" />
        <div>
          <h1 className="font-display text-3xl font-bold">Aggiornamenti</h1>
          <p className="mt-2 text-muted">
            Qui scriviamo che cosa è cambiato nel dojo, ogni volta che qualcosa cambia davvero. Niente
            novità di faccia: solo cose che si vedono.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-10">
        {list.length === 0 ? (
          <p className="text-muted">Non ci sono ancora aggiornamenti. Torna dopo il primo caso.</p>
        ) : (
          list.map((a) => <Announcement key={a.id} announcement={a} />)
        )}
      </div>

      <p className="mt-12 border-t border-border pt-6 text-sm text-muted">
        Hai trovato un problema o vuoi che segnaliamo qualcosa?{" "}
        <Link href="/contatti" className="font-semibold text-primary underline">
          Scrivici
        </Link>
        .
      </p>
    </div>
  );
}

async function Announcement({ announcement }: { announcement: ReturnType<typeof readAnnouncements>[number] }) {
  const { content } = await compileMDX({
    source: announcement.body,
    options: { blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm] } },
  });
  const date = new Date(`${announcement.date}T00:00:00Z`).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return (
    <article className="grid gap-4">
      <header className="grid gap-2">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">{date}</p>
        <h2 className="font-display text-2xl font-bold">{announcement.title}</h2>
        {announcement.summary ? <p className="text-muted">{announcement.summary}</p> : null}
      </header>
      <div className="legal-body">{content}</div>
    </article>
  );
}
