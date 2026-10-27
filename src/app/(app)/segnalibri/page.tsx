import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { desc, eq } from "drizzle-orm";
import { schema } from "@/lib/db";
import { withUser } from "@/lib/db/scoped";
import { loadCatalog } from "@/lib/content/catalog";
import { getRawLesson, splitScreens } from "@/lib/content/load";
import { canOpenLesson } from "@/lib/progress/unlock";
import { requireMember } from "@/lib/session";

export const metadata: Metadata = { title: "Segnalibri" };

export default function Segnalibri() {
  return (
    <Suspense fallback={<div className="h-64 rounded-2xl bg-surface-muted" aria-busy="true" aria-label="Carico i segnalibri" />}>
      <SegnalibriContent />
    </Suspense>
  );
}

function screenTitle(lessonId: string, screen: number): string {
  const raw = getRawLesson(lessonId);
  const source = raw ? splitScreens(raw.body)[screen] : undefined;
  return (source && /<Scene\s+title="([^"]+)"/.exec(source)?.[1]) || `Schermata ${screen + 1}`;
}

async function SegnalibriContent() {
  const { user, completed, mastered } = await requireMember("/segnalibri");
  let rows: { lessonId: string; screen: number; createdAt: Date }[] | null = null;
  try {
    rows = await withUser(user.id, (tx) =>
      tx
        .select({ lessonId: schema.lessonBookmarks.lessonId, screen: schema.lessonBookmarks.screen, createdAt: schema.lessonBookmarks.createdAt })
        .from(schema.lessonBookmarks)
        .where(eq(schema.lessonBookmarks.userId, user.id))
        .orderBy(desc(schema.lessonBookmarks.createdAt))
        .limit(200),
    );
  } catch {
    rows = null;
  }
  const catalog = new Map(loadCatalog().map((l) => [l.id, l]));
  const items = (rows ?? []).flatMap((r) => {
    const lesson = catalog.get(r.lessonId);
    if (!lesson) return [];
    // «Nessun salto»: se la lezione è bloccata il link porta al Percorso.
    const open = mastered.has(lesson.id) || canOpenLesson(lesson, { completed, mastered });
    return [{ key: `${r.lessonId}-${r.screen}`, title: lesson.title, screen: screenTitle(r.lessonId, r.screen), n: r.screen + 1, href: open ? `/lezione/${lesson.id}` : "/percorso", locked: !open }];
  });

  return (
    <div className="mx-auto grid max-w-2xl gap-5">
      <header className="grid gap-1">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Segnalibri</p>
        <h1 className="font-display text-3xl font-bold">I punti che vuoi ritrovare</h1>
        <p className="text-muted">Dentro una lezione tocca «Segnalibro» per segnare la schermata che stai leggendo.</p>
      </header>
      {rows === null ? (
        <p className="rounded-2xl border-2 border-border bg-surface p-5 text-muted">I segnalibri non sono disponibili in questo momento. Riprova tra poco.</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border-2 border-border bg-surface p-5 text-muted">Non hai ancora nessun segnalibro.</p>
      ) : (
        <ul className="grid gap-3">
          {items.map((i) => (
            <li key={i.key}>
              <Link href={i.href} className="block min-h-14 rounded-2xl border-2 border-border bg-surface p-4 hover:bg-surface-muted">
                <span className="block font-semibold">{i.title}</span>
                <span className="block text-sm text-muted">
                  Schermata {i.n}: {i.screen}
                  {i.locked ? " · lezione ancora bloccata, ti porto al Percorso" : ""}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
