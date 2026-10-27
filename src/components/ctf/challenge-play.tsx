"use client";

import { useState, useTransition } from "react";
import { submitFlag, type FlagResult } from "@/app/actions/ctf";
import { LEVEL_LABEL } from "@/lib/ctf/core";
import { CATEGORY_LABEL, type PublicChallenge } from "@/lib/ctf/types";
import { ArtifactView } from "./artifact-view";
import { Toolbox } from "./toolbox";

type Info = { explanation: string; defense: string };

export function ChallengePlay({ challenge, initiallySolved, info }: { challenge: PublicChallenge; initiallySolved: boolean; info: Info | null }) {
  const [shownHints, setShownHints] = useState(0);
  const [flag, setFlag] = useState("");
  const [result, setResult] = useState<FlagResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const solved = initiallySolved || result?.status === "solved";
  const reveal: Info | null = result?.status === "solved" ? result : info;

  const send = () => {
    setError(null);
    start(async () => {
      try {
        setResult(await submitFlag(challenge.id, flag));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Qualcosa è andato storto.");
      }
    });
  };

  return (
    <div className="grid gap-5">
      <header className="grid gap-2">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
          {CATEGORY_LABEL[challenge.category]} · {LEVEL_LABEL[challenge.level]}
        </p>
        <h1 className="font-display text-3xl font-bold">{challenge.title}</h1>
        <p>{challenge.story}</p>
        <p className="rounded-lg border-2 border-primary p-3 font-semibold">{challenge.goal}</p>
        <p className="text-sm text-muted">Sfida simulata e didattica: tutto è inventato e resta dentro questa pagina, nessun sistema reale è coinvolto.</p>
      </header>

      <ArtifactView artifact={challenge.artifact} challengeId={challenge.id} />
      <Toolbox />

      <section aria-labelledby="indizi" className="grid gap-2">
        <h2 id="indizi" className="font-display text-xl font-bold">
          Indizi
        </h2>
        {shownHints > 0 && (
          <ol className="grid gap-2">
            {challenge.hints.slice(0, shownHints).map((h, i) => (
              <li key={i} className="rounded-lg bg-surface-muted p-3">
                <strong>Indizio {i + 1}.</strong> {h}
              </li>
            ))}
          </ol>
        )}
        {shownHints < 3 && (
          <button type="button" className="btn btn-ghost min-h-12" onClick={() => setShownHints(shownHints + 1)}>
            Mostra l&apos;indizio {shownHints + 1} di 3
          </button>
        )}
      </section>

      <section aria-labelledby="bandiera" className="grid gap-3">
        <h2 id="bandiera" className="font-display text-xl font-bold">
          La bandiera
        </h2>
        {solved ? (
          <p className="rounded-lg border-2 border-success p-3 font-semibold" role="status">
            Sfida risolta.{result?.status === "solved" ? (result.xpGained > 0 ? ` Hai guadagnato ${result.xpGained} XP.` : " Gli XP li avevi già presi.") : ""}
          </p>
        ) : (
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <label className="grid gap-1 text-sm font-semibold">
              Scrivi la bandiera (formato CYBERDOJO&#123;...&#125;)
              <input
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                maxLength={120}
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="CYBERDOJO{...}"
                className="min-h-12 rounded-md border-2 border-border bg-background px-3 font-mono text-base"
              />
            </label>
            <button type="submit" className="btn btn-primary min-h-14" disabled={pending || flag.trim().length === 0}>
              {pending ? "Controllo…" : "Invia la bandiera"}
            </button>
          </form>
        )}
        <div aria-live="polite" className="grid gap-1">
          {error && (
            <p role="alert" className="font-semibold text-accent">
              {error}
            </p>
          )}
          {result?.status === "wrong" && <p className="font-semibold text-accent">Non è questa. Riprova (tentativi rimasti in questi 10 minuti: {result.left}).</p>}
          {result?.status === "blocked" && <p className="font-semibold text-accent">Troppi tentativi: aspetta circa {result.minutes} minuti e riprova.</p>}
        </div>
      </section>

      {solved && reveal && (
        <section aria-labelledby="soluzione" className="grid gap-3 rounded-2xl border-2 border-border bg-surface p-4">
          <h2 id="soluzione" className="font-display text-xl font-bold">
            Come si risolve
          </h2>
          <p>{reveal.explanation}</p>
          <h3 className="font-bold">Come ci si difende</h3>
          <p>{reveal.defense}</p>
        </section>
      )}
    </div>
  );
}
