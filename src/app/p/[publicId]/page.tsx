import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { SITE } from "@/lib/config";
import { getPublicPortfolio } from "@/lib/portfolio/service";

// Pagina pubblica ma sempre non indicizzata: l'utente la mostra a chi vuole, i motori di ricerca non la elencano.
export const metadata: Metadata = { title: "Portfolio", robots: { index: false, follow: false } };

// Gli identificativi stanno nel database e non si conoscono in anticipo: niente generateStaticParams.
// La pagina è dinamica e legge i dati dentro Suspense, come /verifica/[codice].
export default function PortfolioPage({ params }: PageProps<"/p/[publicId]">) {
  return (
    <Suspense fallback={<p className="p-6 font-mono text-sm text-muted">Carico il portfolio…</p>}>
      <Portfolio params={params} />
    </Suspense>
  );
}

async function Portfolio({ params }: { params: PageProps<"/p/[publicId]">["params"] }) {
  const res = await getPublicPortfolio((await params).publicId);
  if (res.status === "not-found") notFound();
  return (
    <main className="mx-auto grid w-full max-w-xl gap-5 p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-6">
      {res.status === "ok" ? (
        <PortfolioCard p={res.portfolio} />
      ) : (
        <p role="status" className="rounded-lg border border-border p-4">
          Il portfolio non è ancora disponibile. Riprova più tardi.
        </p>
      )}
      <footer className="border-t border-border pt-4 text-sm text-muted">
        Pagina scelta e gestita dalla persona stessa su {SITE.name}.{" "}
        <Link href="/" className="font-semibold text-primary underline underline-offset-2">
          Scopri {SITE.name}
        </Link>
      </footer>
    </main>
  );
}
