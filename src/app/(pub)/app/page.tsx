import type { Metadata } from "next";
import Link from "next/link";
import { formatSize, readAppRelease } from "@/lib/app-release";
import { PageArt } from "@/components/page-art";

export const metadata: Metadata = {
  title: "Scarica l'app",
  description: "L'app Android di CyberDojo: come scaricarla, come verificarla e le differenze con il sito.",
};

const ROWS = [
  ["Come si ottiene", "Apri il sito", "«Installa l'app» dal browser", "File APK da questa pagina", "Cerca «CyberDojo» sullo store"],
  ["Si aggiorna", "Da sola", "Da sola", "Da sola (è il sito)", "Da sola"],
  ["Notifiche", "Se il browser le permette", "Sì (Android e PC)", "Sì", "Sì"],
  ["Studio senza internet", "Lezioni già aperte", "Lezioni già aperte", "Lezioni già aperte", "Lezioni già aperte"],
  ["Barra del browser", "Visibile", "Nascosta", "Nascosta", "Nascosta"],
  ["Disponibile", "Ora", "Ora", "Ora, su Android", "In futuro"],
] as const;

export default function AppPage() {
  const r = readAppRelease();
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-8 px-4 py-10">
      <header className="relative grid gap-2 pr-20">
        <PageArt art="app" priority />
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">App Android</p>
        <h1 className="font-display text-3xl font-bold">Scarica CyberDojo sul telefono</h1>
        <p className="text-lg text-muted">
          Gratis, senza account da creare altrove e senza pubblicità. L&apos;app è il sito di CyberDojo a schermo intero:
          quando aggiorniamo il sito, si aggiorna anche lei.
        </p>
      </header>

      {r.available ? (
        <section aria-label="Download" className="grid gap-4 rounded-lg border-2 border-primary bg-surface p-5">
          <div>
            <p className="font-display text-xl font-bold">Versione {r.version}</p>
            <p className="text-sm text-muted">
              {formatSize(r.sizeBytes)} · pubblicata il {r.date} · solo Android
            </p>
          </div>
          <a href={r.file} download className="btn btn-primary min-h-14 text-base">
            Scarica l&apos;APK
          </a>
          <details className="rounded-md border border-border bg-background p-3">
            <summary className="cursor-pointer font-semibold">Verifica che il file sia autentico</summary>
            <div className="mt-3 grid gap-3 text-sm">
              <p>
                Ogni versione ha un&apos;impronta (SHA-256). Se quella del file che hai scaricato è uguale a questa, il file è
                esattamente quello pubblicato da noi.
              </p>
              <p className="break-all rounded bg-surface-muted p-2 font-mono text-xs">{r.sha256}</p>
              <p>
                Su Windows: apri PowerShell nella cartella dei download e scrivi{" "}
                <code>Get-FileHash cyberdojo.apk</code>. Su Android: app «Hash Droid» o simili.
              </p>
              {r.certSha256 ? (
                <>
                  <p>L&apos;app è firmata con la nostra chiave. Impronta del certificato di firma:</p>
                  <p className="break-all rounded bg-surface-muted p-2 font-mono text-xs">{r.certSha256}</p>
                </>
              ) : null}
            </div>
          </details>
        </section>
      ) : (
        <section aria-label="Download" className="grid gap-2 rounded-lg border border-border bg-surface p-5">
          <p className="font-display text-xl font-bold">In arrivo</p>
          <p className="text-muted">
            Stiamo finendo di preparare l&apos;app. Intanto puoi usare CyberDojo come app senza scaricare niente: apri il sito
            nel browser e scegli «Installa l&apos;app» (su iPhone: Condividi, poi «Aggiungi a Home»).
          </p>
        </section>
      )}

      <section aria-label="Come installare" className="grid gap-3">
        <h2 className="font-display text-2xl font-bold">Come installarla</h2>
        <ol className="grid list-decimal gap-2 pl-6">
          <li>Dal telefono Android apri questa pagina e tocca «Scarica l&apos;APK».</li>
          <li>Apri il file scaricato (lo trovi nelle notifiche o nella cartella «Download»).</li>
          <li>
            Android ti chiede il permesso di installare app da questa fonte: tocca «Impostazioni», attiva il permesso per il
            browser che stai usando e torna indietro. Lo puoi spegnere subito dopo.
          </li>
          <li>Se compare un avviso di Google Play Protect, tocca «Dettagli» e poi «Installa comunque»: succede con tutte le app che non vengono dallo store.</li>
          <li>Tocca «Installa», poi «Apri». Accedi con il tuo account di CyberDojo.</li>
        </ol>
        <p className="text-sm text-muted">
          Prima di installare, controlla l&apos;impronta del file qui sopra: è il modo per essere sicuri che nessuno lo abbia
          modificato. Scarica l&apos;app solo da questa pagina.
        </p>
      </section>

      <section aria-label="Differenze" className="grid gap-3">
        <h2 className="font-display text-2xl font-bold">Che differenza c&apos;è?</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="bg-surface-muted">
              <tr>
                <th className="p-2" scope="col"></th>
                <th className="p-2" scope="col">Sito</th>
                <th className="p-2" scope="col">Sito installato</th>
                <th className="p-2" scope="col">App APK</th>
                <th className="p-2" scope="col">Play Store</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, ...cells]) => (
                <tr key={label} className="border-t border-border">
                  <th scope="row" className="p-2 font-semibold">{label}</th>
                  {cells.map((c, i) => (
                    <td key={i} className="p-2">{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted">
          In breve: l&apos;APK non è un&apos;app «nativa» scritta a parte. È il sito dentro un contenitore, per questo
          è leggera, sempre aggiornata e ha gli stessi contenuti. Il vantaggio è la comodità: icona, schermo intero e notifiche.
        </p>
      </section>

      <section aria-label="Play Store" className="grid gap-2 rounded-lg border border-border bg-surface p-5">
        <h2 className="font-display text-xl font-bold">E il Play Store?</h2>
        <p className="text-muted">
          Arriverà. Google chiede un periodo di prova con un gruppo di persone che testano l&apos;app prima di pubblicarla.
          Quando avremo abbastanza tester la mandiamo allo store e te lo diciamo negli{" "}
          <Link href="/aggiornamenti" className="font-semibold text-primary underline">aggiornamenti</Link>. Se vuoi fare il
          tester, scrivici da <Link href="/contatti" className="font-semibold text-primary underline">Contatti</Link>.
        </p>
      </section>
    </div>
  );
}
