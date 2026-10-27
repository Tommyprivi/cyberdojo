import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCourseCertificate, issueCertificate } from "@/app/actions/certificate";
import { PrintButton } from "@/components/print-button";
import { SITE } from "@/lib/config";
import { COURSES } from "@/lib/content/courses";
import { siteUrl } from "@/lib/site-url";
import { requireMember } from "@/lib/session";

export const metadata: Metadata = { title: "Certificato", robots: { index: false } };

export default function CertificatoPage({ params }: PageProps<"/certificato/[corso]">) {
  return (
    <Suspense fallback={<p className="p-6 font-mono text-sm text-muted">Preparo il certificato…</p>}>
      <Certificato params={params} />
    </Suspense>
  );
}

async function Certificato({ params }: { params: PageProps<"/certificato/[corso]">["params"] }) {
  const { corso } = await params;
  if (!COURSES.some((c) => c.id === corso)) notFound();
  await requireMember(`/certificato/${corso}`);
  const data = await getCourseCertificate(corso);
  if (!data) notFound();
  const { course, completion, certificate, holder } = data;

  // Corso non finito: nessun certificato, e si dice quanto manca.
  if (!completion.complete) {
    return (
      <main className="mx-auto grid max-w-xl gap-4 p-6">
        <h1 className="font-display text-3xl font-bold">Certificato: {course.title}</h1>
        <p>
          Il certificato si ottiene completando <strong>tutte</strong> le lezioni del corso. Per ora ne hai completate {completion.done} su {completion.total}.
        </p>
        <Link href="/percorso" className="btn btn-primary min-h-12 w-fit">
          Torna al Percorso
        </Link>
      </main>
    );
  }

  // Corso finito ma certificato non ancora emesso.
  if (!certificate) {
    return (
      <main className="mx-auto grid max-w-xl gap-4 p-6">
        <h1 className="font-display text-3xl font-bold">Hai finito {course.title}</h1>
        <p>Hai completato tutte le {completion.total} lezioni del corso. Puoi ottenere il tuo certificato, con un codice che chiunque può controllare.</p>
        <form action={issueCertificate}>
          <input type="hidden" name="corso" value={course.id} />
          <button type="submit" className="btn btn-primary min-h-12">
            Ottieni il certificato
          </button>
        </form>
      </main>
    );
  }

  const date = new Intl.DateTimeFormat("it-IT", { dateStyle: "long", timeZone: "Europe/Rome" }).format(certificate.issuedAt);
  const verifyUrl = `${siteUrl()}/verifica/${certificate.publicCode}`;

  return (
    <main className="mx-auto grid max-w-3xl gap-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <PrintButton />
        <Link href="/percorso" className="text-sm font-semibold underline">
          Torna al Percorso
        </Link>
      </div>

      <article
        aria-label="Certificato di fine corso"
        className="grid gap-5 border-4 border-double border-[#1a1a1a] bg-white p-8 text-center text-[#1a1a1a] sm:p-12 print:border-black print:shadow-none"
      >
        <p className="font-mono text-sm font-bold uppercase tracking-[0.3em]">{SITE.name}</p>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Attestato di completamento</h1>
        <p>si certifica che</p>
        <p className="font-display text-3xl font-bold sm:text-4xl">{holder}</p>
        <p>
          ha completato tutte le {completion.total} lezioni del corso
          <br />
          <strong className="text-xl">«{course.title}»</strong>
        </p>
        <p>Data di emissione: {date}</p>
        <div className="mx-auto grid max-w-md gap-1 border-t border-[#1a1a1a]/30 pt-4 text-sm">
          <p>
            Codice di verifica: <span className="font-mono font-bold">{certificate.publicCode}</span>
          </p>
          <p className="break-all">
            Controllo pubblico: <span className="font-mono">{verifyUrl}</span>
          </p>
        </div>
        <p className="text-xs">Attestato di frequenza interno a {SITE.name}: non è un titolo di studio né una certificazione professionale.</p>
      </article>
    </main>
  );
}
