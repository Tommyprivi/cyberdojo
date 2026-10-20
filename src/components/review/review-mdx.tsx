import type { ComponentPropsWithoutRef } from "react";
import { BitLab } from "@/components/lesson/bit-lab";
import { BitGrid, Callout, Envelope, Log } from "@/components/lesson/bits";
import { Recap, Say, Scene } from "@/components/lesson/blocks";
import { lessonComponents } from "@/components/lesson/mdx-components";
import { Video } from "@/components/lesson/video";
import { ALL_BANK_ITEMS } from "@/lib/practice/banks-all";
import { GENERATORS, isGeneratorId } from "@/lib/practice/generators";
import { ARP_BANK, ENCAPSULATION_BANK, OSI_BANK, PACKET_BASICS, type BankItem } from "@/lib/practice/banks";

/*
  Componenti della «anteprima di revisione»: mostrano TUTTO senza interazione e senza server
  (quiz con la risposta giusta, schede girate, passi tutti aperti, banca delle domande).
*/

const BANK_ITEMS: Record<string, readonly BankItem[]> = {
  "packet-basics": PACKET_BASICS,
  "arp-concepts": ARP_BANK,
  "osi-layers": OSI_BANK,
  encapsulation: ENCAPSULATION_BANK,
  ...ALL_BANK_ITEMS,
};

function ReviewQuiz({ question, options, answer, explain }: { question: string; options: string[]; answer: number; explain: string }) {
  return (
    <div className="my-2 grid gap-3">
      <p className="text-lg font-bold">{question}</p>
      <ul className="grid gap-2">
        {options.map((o, i) => (
          <li key={o} className={`flex items-center gap-3 rounded-md border-2 px-4 py-2 ${i === answer ? "border-success bg-surface-muted" : "border-border bg-surface"}`}>
            <span className="font-mono">{o}</span>
            {i === answer && <span className="ml-auto text-sm font-bold text-success">Risposta giusta</span>}
          </li>
        ))}
      </ul>
      <p className="text-sm">{explain}</p>
    </div>
  );
}

function ReviewFlashcards({ cards }: { cards: { q: string; a: string }[] }) {
  return (
    <ul className="my-2 grid gap-3 sm:grid-cols-2">
      {cards.map((c, i) => (
        <li key={i} className="grid gap-1 rounded-md border border-border bg-surface-muted p-4">
          <span className="font-bold">{c.q}</span>
          <span className="font-extrabold text-primary">{c.a}</span>
        </li>
      ))}
    </ul>
  );
}

function ReviewGuided({ steps }: { steps: (string | { text: string; bits?: string })[] }) {
  return (
    <ol className="my-2 grid gap-3">
      {steps.map((raw, i) => {
        const s = typeof raw === "string" ? { text: raw } : raw;
        return (
          <li key={i} className="grid gap-2 rounded-md border border-border bg-surface-muted p-3">
            <div className="flex gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-fg">{i + 1}</span>
              <span className="pt-0.5">{s.text}</span>
            </div>
            {s.bits && <BitGrid bits={s.bits} />}
          </li>
        );
      })}
    </ol>
  );
}

/** Elenco della banca di domande (o un campione, se la verifica genera le domande). */
function ReviewPractice({ generator, pass, retries, type }: { generator?: string; pass: string; retries: number; type: string }) {
  const items = generator ? BANK_ITEMS[generator] : undefined;
  const sample = !items && generator && isGeneratorId(generator) ? GENERATORS[generator].generate("revisione", 5) : [];
  return (
    <section aria-label="Verifica pratica" className="my-2 grid gap-3">
      <p className="flex flex-wrap gap-2 text-sm">
        <span className="chip">Tipo: {type}</span>
        <span className="chip">Per passare: {pass}</span>
        <span className="chip">Tentativi: {retries}</span>
        {generator && <span className="chip font-mono">{generator}</span>}
      </p>
      {items ? (
        <>
          <p className="text-sm text-muted">Banca di {items.length} domande: a ogni tentativo lo studente ne riceve alcune, mescolate. Ecco tutte, con la risposta giusta evidenziata.</p>
          <ol className="grid gap-3">
            {items.map((it, i) => (
              <li key={i} className="grid gap-2 rounded-md border border-border bg-surface p-3">
                <p className="font-semibold">{i + 1}. {it.q}</p>
                <ul className="grid gap-1 text-sm sm:grid-cols-2">
                  <li className="rounded border-2 border-success bg-surface-muted px-3 py-1.5 font-semibold">✓ {it.ok}</li>
                  {it.no.map((n) => (
                    <li key={n} className="rounded border border-border px-3 py-1.5 text-muted">{n}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </>
      ) : sample.length ? (
        <>
          <p className="text-sm text-muted">Le domande si generano a ogni tentativo. Ecco un campione di 5 con la risposta giusta.</p>
          <ol className="grid gap-3">
            {sample.map((q, i) => (
              <li key={i} className="grid gap-2 rounded-md border border-border bg-surface p-3">
                <p className="font-semibold">
                  {i + 1}. {q.data && <span className="mr-2 font-mono">{q.data}</span>}
                  {q.prompt}
                </p>
                {q.choices ? (
                  <ul className="grid gap-1 text-sm sm:grid-cols-2">
                    {q.choices.map((c, k) => (
                      <li key={c} className={`rounded px-3 py-1.5 ${k === q.answer ? "border-2 border-success bg-surface-muted font-semibold" : "border border-border text-muted"}`}>{k === q.answer ? "✓ " : ""}{c}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm font-semibold text-success">Risposta giusta: {q.answer}{generator === "decimal-to-binary" ? ` (${q.answer.toString(2).padStart(8, "0")})` : ""}</p>
                )}
              </li>
            ))}
          </ol>
        </>
      ) : (
        <p className="text-sm text-muted">Questa lezione non ha una banca di domande (tipo di verifica: {type}).</p>
      )}
    </section>
  );
}

type P<T extends keyof React.JSX.IntrinsicElements> = ComponentPropsWithoutRef<T>;

/** Mappa dei componenti MDX per la revisione di una lezione. */
export function reviewComponents(v: { generator?: string; pass: string; retries: number; type: string }) {
  return {
    ...lessonComponents,
    Scene,
    Say,
    Recap,
    BitGrid,
    BitLab,
    Callout,
    Envelope,
    Log,
    Quiz: ReviewQuiz,
    Flashcards: ReviewFlashcards,
    Guided: ReviewGuided,
    Practice: () => <ReviewPractice {...v} />,
    Video: () => (
      <div id="video" className="scroll-mt-24">
        <Video />
      </div>
    ),
    p: (p: P<"p">) => <p {...p} className="leading-relaxed" />,
  };
}
