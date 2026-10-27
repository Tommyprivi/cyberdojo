import type { Metadata } from "next";
import { Suspense } from "react";
import { CtfList } from "@/components/ctf/ctf-list";
import { listing } from "@/lib/ctf/catalog";
import { withUser } from "@/lib/db/scoped";
import { solvedIds } from "@/lib/ctf/server";
import { requireMember } from "@/lib/session";

export const metadata: Metadata = { title: "Laboratori di hacking guidati (CTF)" };

export default function CtfPage() {
  return (
    <Suspense fallback={<div className="h-80 rounded-2xl bg-surface-muted" aria-busy="true" aria-label="Carico le sfide" />}>
      <CtfContent />
    </Suspense>
  );
}

async function CtfContent() {
  const { user } = await requireMember("/ctf");
  const solved = await withUser(user.id, (tx) => solvedIds(tx, user.id));
  const items = listing().map((c) => ({ ...c, solved: solved.has(c.id) }));

  return (
    <div className="mx-auto grid max-w-4xl gap-5">
      <header className="grid gap-1">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Trova la bandiera</p>
        <h1 className="font-display text-3xl font-bold lg:text-4xl">Laboratori di hacking guidati</h1>
        <p className="text-muted">
          Sfide in cui cerchi una «bandiera» nascosta (CYBERDOJO&#123;...&#125;). Sono tutte simulate: dati inventati, dentro questa pagina, mai contro sistemi veri. Ogni sfida ha 3 indizi
          a richiesta e, quando la risolvi, la spiegazione e come ci si difende. XP una sola volta per sfida.
        </p>
      </header>
      <CtfList items={items} />
    </div>
  );
}
