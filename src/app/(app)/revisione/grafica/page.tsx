import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense, type ReactNode } from "react";
import * as Icons from "@/components/icons";
import { Callout } from "@/components/lesson/bits";
import { Mascot } from "@/components/mascot";
import * as NavIcons from "@/components/nav-icons";
import { VoteBox } from "@/components/review/vote-box";
import { Seal } from "@/components/seal";
import { gfxCatalog, loadColors, loadImages } from "@/lib/content/graphics";
import { gfxKey, summarizeGfx, type Reviews } from "@/lib/content/reviews";
import { readReviews } from "@/lib/content/reviews-store";
import { internalToolsEnabled } from "@/lib/internal";

export const metadata: Metadata = { title: "Revisione della grafica", robots: { index: false, follow: false } };

export default function GraphicsReview() {
  return (
    <Suspense fallback={<p className="p-6">Carico la grafica…</p>}>
      <Graphics />
    </Suspense>
  );
}

function Block({ id, label, reviews, children, wide }: { id: string; label: string; reviews: Reviews; children: ReactNode; wide?: boolean }) {
  return (
    <article className={`card grid content-start gap-3 p-4 ${wide ? "lg:col-span-2" : ""}`} aria-label={label}>
      <h3 className="break-all font-semibold">{label}</h3>
      <div className="min-w-0">{children}</div>
      <VoteBox target={{ kind: "gfx", id }} label={label} entry={reviews[gfxKey(id)]} />
    </article>
  );
}

async function Graphics() {
  await connection();
  if (!internalToolsEnabled()) notFound();
  const reviews = readReviews();
  const sum = summarizeGfx(gfxCatalog().length, reviews);

  const colors = loadColors();
  const images = loadImages();
  const icons = Object.entries({ ...Icons, ...NavIcons }).filter(([, v]) => typeof v === "function") as [
    string,
    (p: { width?: number; height?: number }) => ReactNode,
  ][];

  return (
    <div className="grid gap-10">
      <header className="dossier grid gap-3 p-6">
        <h1 className="font-display text-3xl font-semibold">Revisione della grafica</h1>
        <p className="max-w-3xl text-muted">
          Guida di stile viva: tutto ciò che compone l&apos;aspetto del sito. Per ogni elemento: «Mi piace» o «Da cambiare», un voto da 1
          a 5 e una nota.
        </p>
        <p className="font-mono text-sm">Visti {sum.seen} / {sum.total} · Approvati {sum.approved} · Da cambiare {sum.toChange}</p>
      </header>

      <section aria-labelledby="g-colori" className="grid gap-4">
        <h2 id="g-colori" className="font-display text-2xl font-semibold">Colori</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {colors.map((c) => (
            <Block reviews={reviews} key={c.name} id={`colore:${c.name}`} label={c.label}>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(
                  [
                    ["Chiaro", c.light],
                    ["Scuro", c.dark],
                  ] as const
                ).map(([tema, hex]) => (
                  <div key={tema} className="grid gap-1">
                    <div className="h-14 rounded-md border border-border" style={{ background: hex }} role="img" aria-label={`${tema}: ${hex}`} />
                    <span className="font-mono">{tema} {hex}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 font-mono text-xs text-muted">--{c.name}</p>
            </Block>
          ))}
        </div>
      </section>

      <section aria-labelledby="g-font" className="grid gap-4">
        <h2 id="g-font" className="font-display text-2xl font-semibold">Font</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <Block reviews={reviews} id="font:titoli" label="Titoli (display)">
            <p className="font-display text-4xl font-semibold">Regole d&apos;ingaggio</p>
            <p className="font-display text-2xl">Il caso del log sospetto</p>
          </Block>
          <Block reviews={reviews} id="font:testo" label="Testo">
            <p>Il Sensei guarda il log e nota subito l&apos;indirizzo che non torna. 0123456789</p>
            <p className="text-sm text-muted">Testo secondario più piccolo, per note e spiegazioni.</p>
          </Block>
          <Block reviews={reviews} id="font:mono" label="Mono (etichette, codice)">
            <p className="font-mono text-sm font-bold uppercase tracking-widest">Etichetta · C.08.001</p>
            <p className="font-mono">192.168.1.10 → 10.0.0.5:443</p>
          </Block>
        </div>
      </section>

      <section aria-labelledby="g-comp" className="grid gap-4">
        <h2 id="g-comp" className="font-display text-2xl font-semibold">Componenti</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <Block reviews={reviews} id="componente:bottoni" label="Pulsanti">
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary">Principale</button>
              <button type="button" className="btn btn-ghost">Secondario</button>
              <button type="button" className="btn btn-primary" disabled>Disattivato</button>
              <button type="button" className="btn bg-accent text-accent-fg">Accento</button>
            </div>
          </Block>
          <Block reviews={reviews} id="componente:chip" label="Chip (etichette)">
            <div className="flex flex-wrap gap-2">
              <span className="chip">Cintura blu</span>
              <span className="chip font-bold text-success">Giusta</span>
              <span className="chip font-bold text-accent">Sbagliata</span>
              <span className="chip font-mono">C.08.001</span>
            </div>
          </Block>
          <Block reviews={reviews} id="componente:campi" label="Campi di testo">
            <div className="grid gap-2">
              <label className="grid gap-1 text-sm font-bold">Email<input className="field font-normal" placeholder="nome@esempio.it" /></label>
              <label className="grid gap-1 text-sm font-bold">Scelta<select className="field font-normal"><option>Prima voce</option></select></label>
            </div>
          </Block>
          <Block reviews={reviews} id="componente:schede" label="Schede e fascicoli">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="card p-4">Scheda semplice</div>
              <div className="dossier p-4">Fascicolo con filetto scuro</div>
            </div>
          </Block>
          <Block reviews={reviews} id="componente:tabelle" label="Tabelle">
            <div className="card overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
                  <tr><th className="px-3 py-2">ID</th><th className="px-3 py-2">Titolo</th><th className="px-3 py-2">Stato</th></tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border"><td className="px-3 py-2 font-mono">F.05.001</td><td className="px-3 py-2">Il pacchetto</td><td className="px-3 py-2 font-semibold text-success">✓ approvata</td></tr>
                  <tr><td className="px-3 py-2 font-mono">C.08.001</td><td className="px-3 py-2">Regole d&apos;ingaggio</td><td className="px-3 py-2 font-semibold text-accent">da approvare</td></tr>
                </tbody>
              </table>
            </div>
          </Block>
          <Block reviews={reviews} id="componente:callout" label="Riquadri Regola / Attenzione / Esempio">
            <div className="grid gap-3">
              <Callout kind="regola">Si prova solo ciò che è <strong>tuo</strong>.</Callout>
              <Callout kind="attenzione">Un «sì» a voce non basta.</Callout>
              <Callout kind="esempio">Un esempio concreto.</Callout>
              <Callout kind="trucco">Un trucco per ricordarlo.</Callout>
              <Callout kind="curiosita">Una curiosità vera.</Callout>
            </div>
          </Block>
          <Block reviews={reviews} id="componente:avanzamento" label="Barra di avanzamento">
            <div className="grid gap-3">
              {[25, 60, 100].map((p) => (
                <div key={p} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={p} aria-label={`Avanzamento ${p}%`} className="h-3 overflow-hidden rounded-sm border border-border bg-surface-muted">
                  <div className="h-full bg-primary" style={{ width: `${p}%` }} />
                </div>
              ))}
            </div>
          </Block>
          <Block reviews={reviews} id="componente:mascotte" label="Mascotte (Sensei)">
            <div className="flex flex-wrap items-end gap-4">
              <Mascot size={96} mood="happy" />
              <Mascot size={96} mood="stern" />
              <Mascot size={96} animate />
            </div>
          </Block>
          <Block reviews={reviews} id="componente:sigillo" label="Sigillo">
            <div className="flex flex-wrap items-center gap-4"><Seal size={40} /><Seal size={72} /></div>
          </Block>
          <Block reviews={reviews} id="componente:icone" label="Icone" wide>
            <ul className="flex flex-wrap gap-4">
              {icons.map(([name, Icon]) => (
                <li key={name} className="grid w-24 justify-items-center gap-1 text-center text-xs">
                  <Icon width={32} height={32} />
                  <span className="font-mono">{name.replace(/Icon$/, "")}</span>
                </li>
              ))}
            </ul>
          </Block>
        </div>
      </section>

      <section aria-labelledby="g-img" className="grid gap-4">
        <h2 id="g-img" className="font-display text-2xl font-semibold">Illustrazioni, copertine ed email</h2>
        <p className="text-sm text-muted">
          Clicca su un&apos;immagine per ingrandirla in una nuova scheda. Sono {images.length} file in{" "}
          <span className="font-mono">public/img</span> e <span className="font-mono">public/email</span>.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((src) => (
            <Block reviews={reviews} key={src} id={`immagine:${src}`} label={src}>
              <a href={src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-md border border-border" aria-label={`Ingrandisci ${src}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Immagine ${src}`} loading="lazy" className="h-48 w-full bg-surface-muted object-contain" />
              </a>
              <a href={src} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-primary underline">Ingrandisci</a>
            </Block>
          ))}
        </div>
      </section>
    </div>
  );
}
