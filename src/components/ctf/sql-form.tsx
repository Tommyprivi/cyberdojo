"use client";

import { useState, useTransition } from "react";
import { trySql, type SqlTry } from "@/app/actions/ctf";

const input = "min-h-12 rounded-md border-2 border-border bg-background px-3 font-mono text-base";

/** Form finto: il testo va a un simulatore sul server (nessun database vero, nessun sistema reale). */
export function SqlForm({ challengeId, variant, schema }: { challengeId: string; variant: "login" | "search"; schema: string }) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [out, setOut] = useState<SqlTry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const send = () => {
    setError(null);
    start(async () => {
      try {
        setOut(await trySql(challengeId, variant === "login" ? [a, b] : [a]));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Qualcosa è andato storto.");
      }
    });
  };

  return (
    <div className="grid gap-3">
      <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-deep p-3 font-mono text-sm text-deep-fg">{schema}</pre>
      <form
        className="grid gap-3 rounded-lg border-2 border-border bg-surface p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <label className="grid gap-1 text-sm font-semibold">
          {variant === "login" ? "Nome utente" : "Cerca un prodotto"}
          <input value={a} onChange={(e) => setA(e.target.value)} maxLength={80} autoCapitalize="off" autoCorrect="off" spellCheck={false} className={input} />
        </label>
        {variant === "login" && (
          <label className="grid gap-1 text-sm font-semibold">
            Password
            <input value={b} onChange={(e) => setB(e.target.value)} maxLength={80} autoCapitalize="off" autoCorrect="off" spellCheck={false} className={input} />
          </label>
        )}
        <button type="submit" className="btn btn-primary min-h-12" disabled={pending}>
          {pending ? "Un momento…" : variant === "login" ? "Entra" : "Cerca"}
        </button>
      </form>
      <div aria-live="polite" className="grid gap-2">
        {error && (
          <p role="alert" className="font-semibold text-accent">
            {error}
          </p>
        )}
        {out && (
          <>
            <p className="text-sm text-muted">Frase SQL costruita dal sito di prova:</p>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-surface-muted p-3 font-mono text-sm">{out.query}</pre>
            {out.error && <p className="font-semibold text-accent">{out.error}</p>}
            {out.welcome && <p className="rounded-lg border-2 border-primary p-3 font-semibold">{out.welcome}</p>}
            {variant === "login" && !out.error && !out.welcome && <p className="text-muted">Nome o password sbagliati.</p>}
            {variant === "search" &&
              !out.error &&
              (out.rows.length === 0 ? (
                <p className="text-muted">Nessun prodotto trovato.</p>
              ) : (
                <ul className="grid gap-1">
                  {out.rows.map((r, i) => (
                    <li key={i} className="rounded-md border border-border p-2 text-sm">
                      <strong>{r.nome}</strong> · {r.prezzo} €{r.note ? ` · ${r.note}` : ""}
                    </li>
                  ))}
                </ul>
              ))}
          </>
        )}
      </div>
    </div>
  );
}
