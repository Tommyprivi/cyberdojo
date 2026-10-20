"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { diagnoseBinaryToDecimal } from "@/lib/practice/generators";
import { explainIp, ipQuestions } from "@/lib/practice/ip";

const COUNT = 3;

export function IntruderExercise() {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  return isClient ? <Round /> : <p className="p-6">Apro il registro…</p>;
}

function Round() {
  const [seed, setSeed] = useState(() => crypto.randomUUID());
  const questions = useMemo(() => ipQuestions(seed, COUNT), [seed]);
  const [answers, setAnswers] = useState<string[][]>(() => questions.map(() => ["", "", "", ""]));
  const [verdicts, setVerdicts] = useState<(boolean | null)[]>(() => questions.map(() => null));

  const restart = () => {
    const s = crypto.randomUUID();
    setSeed(s);
    setAnswers(Array.from({ length: COUNT }, () => ["", "", "", ""]));
    setVerdicts(Array(COUNT).fill(null));
  };

  const caught = verdicts.filter((v, i) => v !== null && v === questions[i].private).length;
  const done = verdicts.every((v) => v !== null);

  return (
    <div className="grid h-full min-h-0 md:grid-cols-[minmax(0,1fr)_24rem]">
      <aside className="grid content-start gap-4 overflow-y-auto border-l border-border bg-surface p-6 md:order-2">
        <div>
          <p className="font-mono text-xs text-muted">REGISTRO FIREWALL · 03:12 · connessioni in uscita verso il server dei dati</p>
          <p className="mt-2">
            Tre connessioni sospette. Il registro mostra l&apos;indirizzo sorgente in bit grezzi. Decodificalo e decidi:
            arriva <strong>da dentro</strong> l&apos;azienda o <strong>da Internet</strong>?
          </p>
        </div>
        <div className="rounded-lg bg-surface-muted p-3">
          <p className="text-sm font-bold">Da ricordare</p>
          <p className="mt-1 font-mono text-sm">10.x · 172.16-31.x · 192.168.x</p>
          <p className="mt-1 text-sm text-muted">Sono le tre reti private: tutto il resto arriva da Internet.</p>
        </div>
        <p className="font-mono text-sm" aria-live="polite">
          Verdetti dati: {verdicts.filter((v) => v !== null).length} di {COUNT}
        </p>
        {done && (
          <div role="status" className="pop dossier grid gap-3 p-4">
            <p className="text-lg font-extrabold">
              {caught === COUNT ? "Caso chiuso. Nessun intruso ti è sfuggito." : `${caught} su ${COUNT}. Rileggi le tre reti private e riprova.`}
            </p>
            <button type="button" onClick={restart} className="btn btn-primary w-fit">
              Nuovo registro
            </button>
          </div>
        )}
      </aside>

      <ol className="grid min-h-0 content-start gap-4 overflow-y-auto p-6 md:order-1 xl:grid-cols-2 2xl:grid-cols-3">
        {questions.map((q, i) => {
          const octetOk = q.bits.map((b, k) => diagnoseBinaryToDecimal(b, answers[i][k]).ok);
          const decoded = octetOk.every(Boolean);
          const verdict = verdicts[i];
          return (
            <li key={`${seed}-${i}`} className="card grid gap-3 p-4">
              <p className="font-bold">Connessione {i + 1}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {q.bits.map((b, k) => {
                  const d = diagnoseBinaryToDecimal(b, answers[i][k]);
                  return (
                    <label key={k} className="grid gap-1">
                      <span className="font-mono text-sm tracking-wider">{b}</span>
                      <input
                        inputMode="numeric"
                        autoComplete="off"
                        aria-label={`Connessione ${i + 1}, ottetto ${k + 1}`}
                        value={answers[i][k]}
                        disabled={verdict !== null}
                        onChange={(e) =>
                          setAnswers((a) => a.map((row, r) => (r === i ? row.map((v, c) => (c === k ? e.target.value : v)) : row)))
                        }
                        className={`field font-mono text-lg ${d.ok ? "border-primary" : ""}`}
                      />
                      <span className={`min-h-5 text-xs font-semibold ${d.ok ? "text-primary" : "text-accent"}`}>
                        {d.ok ? "ok" : d.message}
                      </span>
                    </label>
                  );
                })}
              </div>
              <p className="font-mono text-lg" aria-live="polite">
                Sorgente: {decoded ? q.octets.join(".") : "?.?.?.?"}
              </p>
              {decoded && verdict === null && (
                <div className="flex flex-wrap gap-3">
                  <button type="button" className="btn btn-ghost" onClick={() => setVerdicts((v) => v.map((x, j) => (j === i ? true : x)))}>
                    Da dentro
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setVerdicts((v) => v.map((x, j) => (j === i ? false : x)))}>
                    Da Internet
                  </button>
                </div>
              )}
              {verdict !== null && (
                <p role="status" className={`pop rounded-lg bg-surface-muted p-3 ${verdict === q.private ? "" : "border-l-[6px] border-accent"}`}>
                  <strong>{verdict === q.private ? "Giusto. " : "No. "}</strong>
                  {explainIp(q.octets)}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
