"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { completeTutorial } from "@/app/actions/tutorial";
import Image from "next/image";

const STEPS = [
  { img: "/img/funzioni/tutorial-1-porta.png", title: "Benvenuto nel dojo", body: "Qui impari la sicurezza informatica un caso alla volta. Ogni lezione dura pochi minuti e finisce con una verifica." },
  { img: "/img/funzioni/tutorial-2-sentiero.png", title: "Si va in ordine", body: "Una lezione si apre quando hai finito quelle prima. Gli XP, la serie di giorni e le cinture raccontano i tuoi progressi." },
  { img: "/img/funzioni/test-ingresso.png", title: "Sai già qualcosa?", body: "Puoi fare il test d'ingresso di un corso e le prove di padronanza dei moduli. Se le superi, le lezioni risultano «padroneggiate»: si aprono le successive, ma senza XP." },
  { img: "/img/funzioni/ripasso.png", title: "Ripassa quello che dimentichi", body: "Le domande sbagliate tornano nel ripasso, a intervalli sempre più lunghi. Pochi minuti al giorno bastano. Buono studio!" },
];

/** Benvenuto di 4 schermate al primo accesso. Si può saltare in ogni momento; il server ricorda che è stato visto. */
export function Tutorial() {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, [step]);

  if (!open) return null;
  const last = step === STEPS.length - 1;
  const close = () => {
    setOpen(false);
    startTransition(async () => {
      await completeTutorial();
    });
  };

  return (
    <div data-overlay="tutorial" className="fixed inset-0 z-50 grid place-items-end bg-black/50 p-4 sm:place-items-center" role="presentation">
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
        onKeyDown={(e) => e.key === "Escape" && close()}
        className="grid w-full max-w-md gap-4 rounded-2xl border-2 border-border bg-surface p-5 shadow-xl outline-none"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent" aria-live="polite">
            {step + 1} di {STEPS.length}
          </p>
          <button type="button" onClick={close} disabled={pending} className="min-h-11 px-2 font-semibold text-muted underline hover:text-foreground">
            Salta
          </button>
        </div>
        <Image src={STEPS[step].img} alt="" width={156} height={148} className="h-28 w-auto justify-self-center rounded-lg object-contain" priority={step === 0} />
        <h2 id="tutorial-title" className="font-display text-2xl font-bold">
          {STEPS[step].title}
        </h2>
        <p className="text-muted">{STEPS[step].body}</p>
        <div className="flex gap-3">
          {step > 0 && (
            <button type="button" className="btn btn-ghost min-h-14" onClick={() => setStep(step - 1)}>
              Indietro
            </button>
          )}
          <button type="button" className="btn btn-primary min-h-14 flex-1" onClick={() => (last ? close() : setStep(step + 1))}>
            {last ? "Iniziamo" : "Avanti"}
          </button>
        </div>
      </div>
    </div>
  );
}
