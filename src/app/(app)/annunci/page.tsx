import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementFeed } from "@/components/announcements/feed";
import { MarkAnnouncementsRead } from "@/components/announcements/unread";
import { readAnnouncements } from "@/lib/announcements";

export const metadata: Metadata = { title: "Annunci", description: "Gli aggiornamenti di CyberDojo, dal più recente." };

/** Canale annunci in stile chat: i messaggi li scrive lo staff (file in content/announcements), gli utenti leggono. */
export default function AnnunciPage() {
  const list = readAnnouncements();
  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <header className="rise grid gap-1 border-b-2 border-border pb-4">
        <h1 className="font-display text-3xl font-bold"># annunci</h1>
        <p className="text-muted">Qui lo staff scrive gli aggiornamenti di CyberDojo: novità, nuovi corsi, cose che cambiano. Si legge soltanto.</p>
      </header>
      <AnnouncementFeed list={list} />
      <p className="border-t border-border pt-4 text-sm text-muted">
        Hai un&apos;idea o un problema? Scrivilo nella{" "}
        <Link href="/social" className="font-semibold text-primary underline">
          Community
        </Link>
        , in fondo alla pagina c&apos;è «Lascia un feedback».
      </p>
      <MarkAnnouncementsRead latestId={list[0]?.id ?? ""} />
    </div>
  );
}
