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
  return isClient ? <Round /> : <p className="mt-6">Apro il registro…</p>;
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
    <div className="mt-5 grid gap-5">
      <div className="dossier p-5">
        <p className="font-mono text-xs text-muted">REGISTRO FIREWALL · 03:12 · connessioni in uscita verso il server dei dati</p>
        <p className="mt-2">
          Tre connessioni sospette. Il registro mostra l&apos;indirizzo sorgente in bit grezzi. Decodificalo e decidi:
          arriva <strong>da dentro</strong> l&apos;azienda o <strong>da Internet</strong>?
        </p>
      </div>

      <ol className="grid gap-4">
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
                <p role="status" className={`pop rounded-2xl bg-surface-muted p-3 ${verdict === q.private ? "" : "border-l-[6px] border-accent"}`}>
                  <strong>{verdict === q.private ? "Giusto. " : "No. "}</strong>
                  {explainIp(q.octets)}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {done && (
        <div role="status" className="pop dossier grid gap-3 p-5">
          <p className="text-xl font-extrabold">
            {caught === COUNT ? "Caso chiuso. Nessun intruso ti è sfuggito." : `${caught} su ${COUNT}. Rileggi le tre reti private e riprova.`}
          </p>
          <p className="text-sm text-muted">Reti private da ricordare: 10.x · 172.16-31.x · 192.168.x</p>
          <button type="button" onClick={restart} className="btn btn-primary w-fit">
            Nuovo registro
          </button>
        </div>
      )}
    </div>
  );
}
