import type { Metadata } from "next";
import { Suspense } from "react";
import { verifyCertificate } from "@/app/actions/certificate";
import { publicHolderName } from "@/lib/certificate/certificate-core";
import { SITE } from "@/lib/config";
import { COURSES } from "@/lib/content/courses";

export const metadata: Metadata = { title: "Verifica certificato", robots: { index: false } };

export default function VerificaPage({ params }: PageProps<"/verifica/[codice]">) {
  return (
    <Suspense fallback={<p className="p-6 font-mono text-sm text-muted">Controllo il codice…</p>}>
      <Verifica params={params} />
    </Suspense>
  );
}

async function Verifica({ params }: { params: PageProps<"/verifica/[codice]">["params"] }) {
  const code = decodeURIComponent((await params).codice).toUpperCase().slice(0, 40);
  const res = await verifyCertificate(code);
  const course = res.status === "ok" ? COURSES.find((c) => c.id === res.course) : undefined;

  return (
    <main className="mx-auto grid max-w-xl gap-4 p-6">
      <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">{SITE.name} · verifica pubblica</p>
      <h1 className="font-display text-3xl font-bold">Controllo del certificato</h1>
      <p className="font-mono text-sm">{code.replace(/[^A-Z0-9-]/g, "")}</p>
      {res.status === "ok" ? (
        <div role="status" className="grid gap-1 rounded-lg border border-success p-4">
          <p className="font-bold text-success">Certificato valido</p>
          <p>
            {publicHolderName(res.holder)} ha completato tutte le lezioni del corso «{course?.title ?? res.course}».
          </p>
          <p className="text-sm text-muted">
            Emesso il {new Intl.DateTimeFormat("it-IT", { dateStyle: "long", timeZone: "Europe/Rome" }).format(new Date(res.issuedAt))}.
          </p>
        </div>
      ) : res.status === "not-found" ? (
        <p role="status" className="rounded-lg border border-accent p-4 font-semibold">
          Nessun certificato con questo codice. Controlla di averlo copiato bene.
        </p>
      ) : (
        <p role="status" className="rounded-lg border border-border p-4">
          La verifica pubblica non è ancora attiva. Riprova più tardi.
        </p>
      )}
    </main>
  );
}
