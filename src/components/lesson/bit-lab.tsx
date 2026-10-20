"use client";

import { useState } from "react";

/**
 * Laboratorio interattivo: accendi e spegni gli 8 bit e guarda il valore cambiare.
 * Con `target` diventa una mini-sfida ("componi il numero 168").
 */
export function BitLab({ target }: { target?: number }) {
  const [bits, setBits] = useState<number[]>(Array(8).fill(0));
  const weights = [128, 64, 32, 16, 8, 4, 2, 1];
  const total = bits.reduce((sum, b, i) => sum + b * weights[i], 0);
  const hit = target !== undefined && total === target;

  return (
    <div className="my-2 grid gap-4 rounded-lg border border-border bg-surface-muted p-4">
      {target !== undefined && (
        <p className="text-lg">
          Sfida: accendi i bit giusti per ottenere <strong className="font-mono text-primary">{target}</strong>.
        </p>
      )}
      <div className="grid grid-cols-8 gap-1.5 sm:gap-2" role="group" aria-label="Otto bit da accendere o spegnere">
        {weights.map((w, i) => (
          <div key={w} className="grid gap-1 text-center">
            <button
              type="button"
              aria-pressed={bits[i] === 1}
              aria-label={`Bit di peso ${w}: ${bits[i] ? "acceso" : "spento"}`}
              onClick={() => setBits((b) => b.map((v, j) => (j === i ? 1 - v : v)))}
              className={`aspect-square rounded-lg font-mono text-2xl font-bold transition-colors sm:text-3xl ${
                bits[i]
                  ? "bg-primary text-primary-fg"
                  : "border border-border bg-surface text-muted"
              }`}
            >
              {bits[i]}
            </button>
            <span className="font-mono text-xs text-muted sm:text-sm">{w}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-lg" aria-live="polite">
        <span className="font-mono">{bits.join("")}</span> ={" "}
        <strong className="text-2xl text-primary">{total}</strong>
        {hit && <span className="pop ml-2 font-extrabold text-primary">Esatto!</span>}
      </p>
      <button type="button" onClick={() => setBits(Array(8).fill(0))} className="chip mx-auto text-sm">
        Spegni tutto
      </button>
    </div>
  );
}
