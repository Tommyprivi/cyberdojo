"use client";

import { useId } from "react";
import { classifyAddress, describeNetwork, formatIpv4, parseIpv4 } from "@/lib/netcalc";
import type { CalcState } from "@/lib/tutor/engine";

const PRESETS = [8, 16, 24, 30];

const SCOPE_STYLE = {
  privato: "bg-primary text-primary-fg",
  pubblico: "bg-belt-blue text-belt-blue-fg",
  speciale: "bg-belt-yellow text-belt-yellow-fg",
} as const;

/**
 * Calcolatore di rete. Controllato dall'esterno: lo stato (indirizzo e prefisso) vive nel laboratorio,
 * così il tutor può leggerlo e sapere cosa ha fatto l'utente.
 */
export function Calculator({ state, onChange }: { state: CalcState; onChange: (s: CalcState) => void }) {
  const ipId = useId();
  const prefixId = useId();
  const ip = parseIpv4(state.ip);
  const info = ip ? describeNetwork(ip, state.prefix) : null;
  const kind = ip ? classifyAddress(ip) : null;

  const rows: [string, string][] = info
    ? [
        ["Maschera", `${formatIpv4(info.mask)}  (/${info.prefix})`],
        ["Wildcard", formatIpv4(info.wildcard)],
        ["Rete", formatIpv4(info.network)],
        ["Broadcast", formatIpv4(info.broadcast)],
        ["Primo dispositivo", formatIpv4(info.firstHost)],
        ["Ultimo dispositivo", formatIpv4(info.lastHost)],
        ["Dispositivi", info.hosts.toLocaleString("it-IT")],
      ]
    : [];

  return (
    <section aria-label="Calcolatore di rete" className="dossier grid gap-5 p-5">
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Strumento</p>
        <h2 className="font-display text-2xl font-semibold">Calcolatore di rete</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <label htmlFor={ipId} className="grid gap-1.5">
          <span className="font-semibold">Indirizzo IPv4</span>
          <input
            id={ipId}
            className="field font-mono text-lg"
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            placeholder="192.168.1.66"
            value={state.ip}
            onChange={(e) => onChange({ ...state, ip: e.target.value })}
            aria-invalid={state.ip.trim() !== "" && !ip}
          />
        </label>
        <div className="grid gap-1.5">
          <label htmlFor={prefixId} className="font-semibold">
            Prefisso: <span className="font-mono">/{state.prefix}</span>
          </label>
          <input
            id={prefixId}
            type="range"
            min={0}
            max={32}
            value={state.prefix}
            onChange={(e) => onChange({ ...state, prefix: Number(e.target.value) })}
            className="w-full accent-[var(--primary)] sm:w-56"
            aria-valuetext={`prefisso ${state.prefix}`}
          />
          <div className="flex gap-1.5" role="group" aria-label="Prefissi comuni">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onChange({ ...state, prefix: p })}
                className={`chip min-h-8 px-2.5 text-xs ${state.prefix === p ? "border-primary bg-primary text-primary-fg" : ""}`}
              >
                /{p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {state.ip.trim() !== "" && !ip && (
        <p role="alert" className="font-semibold text-accent">
          Indirizzo non valido: servono quattro numeri da 0 a 255 separati da punti.
        </p>
      )}

      {info && kind && (
        <div className="grid gap-4" aria-live="polite">
          <div>
            <p className="mb-1.5 font-semibold">Binario</p>
            <p className="sr-only">
              {info.bits.join(" ")}. I primi {info.prefix} bit sono della rete, gli altri dei dispositivi.
            </p>
            <div className="grid gap-2 font-mono sm:grid-cols-4" aria-hidden>
              {info.bits.map((octet, o) => (
                <div key={o} className="flex justify-center gap-0.5 rounded-xl bg-surface-muted p-1.5">
                  {[...octet].map((bit, i) => {
                    const isNetwork = o * 8 + i < info.prefix;
                    return (
                      <span
                        key={i}
                        className={`grid size-6 place-items-center rounded text-sm font-bold sm:size-5 ${
                          isNetwork ? "bg-primary text-primary-fg" : "bg-surface text-foreground"
                        }`}
                      >
                        {bit}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5"><i className="inline-block size-3 rounded bg-primary" /> bit della rete ({info.prefix})</span>
              <span className="inline-flex items-center gap-1.5"><i className="inline-block size-3 rounded border border-border bg-surface" /> bit dei dispositivi ({32 - info.prefix})</span>
            </p>
          </div>

          <div className="rounded-2xl border-2 border-border p-3">
            <p className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">Tipo</span>
              <span className={`rounded-full px-3 py-0.5 text-sm font-bold ${SCOPE_STYLE[kind.scope]}`}>{kind.label}</span>
            </p>
            <p className="mt-1.5 text-muted">{kind.explanation}</p>
          </div>

          <dl className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {rows.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-3 border-b border-border pb-1.5">
                <dt className="text-muted">{k}</dt>
                <dd className="font-mono font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {!ip && state.ip.trim() === "" && (
        <p className="text-muted">Scrivi un indirizzo per vederlo scomposto in bit.</p>
      )}
    </section>
  );
}
