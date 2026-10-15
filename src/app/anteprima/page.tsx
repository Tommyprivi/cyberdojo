import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DevicePreview } from "@/components/device-preview";
import { internalToolsEnabled } from "@/lib/internal";

export const metadata: Metadata = { title: "Le due interfacce", robots: { index: false, follow: false } };

/** Strumento interno: la stessa pagina vista come su PC e come su telefono, affiancate. */
export default function AnteprimaPage() {
  if (!internalToolsEnabled()) notFound();
  return (
    <main className="mx-auto grid max-w-[1500px] gap-6 px-4 py-8 sm:px-8">
      <header className="grid gap-2">
        <h1 className="font-display text-3xl font-semibold">Le due interfacce</h1>
        <p className="text-muted">
          Sono pagine vere, non immagini: scegli una pagina e vedi come si presenta su PC (barra laterale) e su telefono (barra in basso).
          Le pagine «serve l&apos;accesso» mostrano l&apos;accesso se non hai fatto login in questo browser.
        </p>
      </header>
      <DevicePreview />
    </main>
  );
}
