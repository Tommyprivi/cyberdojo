import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { UxCard } from "@/components/review/ux-card";
import { summarize, UX_PAGES, uxKey } from "@/lib/content/reviews";
import { readReviews } from "@/lib/content/reviews-store";
import { internalToolsEnabled } from "@/lib/internal";

export const metadata: Metadata = { title: "Schermate e UX", robots: { index: false, follow: false } };

export default function UxReview() {
  return (
    <Suspense fallback={<p className="p-6">Carico le schermate…</p>}>
      <Ux />
    </Suspense>
  );
}

async function Ux() {
  await connection();
  if (!internalToolsEnabled()) notFound();
  const reviews = readReviews();
  const s = summarize([], reviews);
  const groups = [...new Set(UX_PAGES.map((p) => p.group))];

  return (
    <div className="grid gap-8">
      <header className="dossier grid gap-3 p-6">
        <h1 className="font-display text-3xl font-semibold">Schermate e UX</h1>
        <p className="max-w-3xl text-muted">
          Ogni pagina del sito, viva, su PC (1440 × 900) e su telefono (390 × 844). Per ognuna: «Mi piace» o «Da cambiare», un voto da
          1 a 5 su cinque aspetti, e cosa cambiare.
        </p>
        <p role="note" className="max-w-3xl rounded-md border border-border bg-surface-muted p-3 text-sm">
          <strong>Attenzione:</strong> le pagine con l&apos;etichetta «serve l&apos;accesso» mostrano la pagina di accesso se in questo
          browser non hai fatto login. Per vederle davvero, accedi prima (anche in un&apos;altra scheda) e poi ricarica.
        </p>
        <p className="font-mono text-sm">Viste {s.uxSeen} / {s.uxTotal} · Mi piacciono {s.uxApproved}</p>
      </header>
      {groups.map((g) => (
        <section key={g} className="grid gap-4" aria-label={g}>
          <h2 className="font-display text-2xl font-semibold">{g}</h2>
          {UX_PAGES.filter((p) => p.group === g).map((p) => (
            <UxCard key={p.path} path={p.path} label={p.label} login={p.login} entry={reviews[uxKey(p.path)] ?? {}} />
          ))}
        </section>
      ))}
    </div>
  );
}
