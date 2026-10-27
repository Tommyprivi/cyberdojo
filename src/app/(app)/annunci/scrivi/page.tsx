import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { StaffEditor, type EditableAnnouncement } from "@/components/announcements/staff-editor";
import { checkStaff, getAllAnnouncements } from "@/lib/community/service";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = { title: "Scrivi un annuncio", robots: { index: false } };

export default function ScriviPage() {
  return (
    <Suspense fallback={<div className="mx-auto h-96 max-w-3xl rounded-lg bg-surface-muted" aria-busy="true" aria-label="Carico il pannello" />}>
      <ScriviContent />
    </Suspense>
  );
}

/** Pannello dello staff. Chi non è staff vede una pagina «non trovata»: il controllo vero è comunque in ogni azione. */
async function ScriviContent() {
  const user = await getSessionUser();
  if (!user) redirect("/accedi?next=%2Fannunci%2Fscrivi");
  if (!(await checkStaff(user))) notFound();
  const list = await getAllAnnouncements(user.id);
  const items: EditableAnnouncement[] = list
    .filter((a) => a.source === "db")
    .map((a) => ({ id: a.id, title: a.title, summary: a.summary, body: a.body, tags: a.tags, pinned: a.pinned, date: a.date }));
  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <header className="grid gap-1 border-b-2 border-border pb-4">
        <h1 className="font-display text-3xl font-bold">Scrivi un annuncio</h1>
        <p className="text-muted">Testo semplice o Markdown semplice (## titoletti, - elenchi, **grassetto**, _corsivo_, link https). Niente HTML. Gli annunci dei file restano come archivio e non si cambiano da qui.</p>
        <Link href="/annunci" className="w-fit text-sm font-semibold text-primary underline">
          Torna agli annunci
        </Link>
      </header>
      <StaffEditor items={items} />
    </div>
  );
}
