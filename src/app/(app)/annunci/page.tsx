import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AnnouncementFeed } from "@/components/announcements/feed";
import { MarkAnnouncementsRead } from "@/components/announcements/unread";
import { checkStaff, getAllAnnouncements, getEngagement } from "@/lib/community/service";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = { title: "Annunci", description: "Gli aggiornamenti di CyberDojo, dal più recente." };

/** Canale annunci in stile chat: i messaggi li scrive lo staff (pannello o file in content/announcements), gli utenti leggono e reagiscono. */
export default function AnnunciPage() {
  return (
    <Suspense fallback={<div className="mx-auto h-96 max-w-3xl rounded-lg bg-surface-muted" aria-busy="true" aria-label="Carico gli annunci" />}>
      <AnnunciContent />
    </Suspense>
  );
}

async function AnnunciContent() {
  const user = await getSessionUser();
  const list = await getAllAnnouncements(user?.id ?? null);
  const engagement = user ? await getEngagement(user.id, list.map((a) => a.id)) : undefined;
  const staff = user ? await checkStaff(user) : false;
  const latest = list.find((a) => !a.pinned) ?? list[0];
  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <header className="rise grid gap-1 border-b-2 border-border pb-4">
        <h1 className="font-display text-3xl font-bold"># annunci</h1>
        <p className="text-muted">Qui lo staff scrive gli aggiornamenti di CyberDojo: novità, nuovi corsi, cose che cambiano. Si legge, e si può reagire con una emoji o una frase a scelta.</p>
        {staff ? (
          <Link href="/annunci/scrivi" className="btn btn-primary mt-2 w-fit">
            Scrivi un annuncio
          </Link>
        ) : null}
      </header>
      <AnnouncementFeed list={list} engagement={engagement} />
      <p className="border-t border-border pt-4 text-sm text-muted">
        Hai un&apos;idea o un problema? Scrivilo nella{" "}
        <Link href="/social" className="font-semibold text-primary underline">
          Community
        </Link>
        , in fondo alla pagina c&apos;è «Lascia un feedback».
      </p>
      <MarkAnnouncementsRead latestId={latest?.id ?? ""} />
    </div>
  );
}
