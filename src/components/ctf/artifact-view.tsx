"use client";

import { useId, useMemo, useState } from "react";
import type { Artifact } from "@/lib/ctf/types";
import { SqlForm } from "./sql-form";

const box = "overflow-x-auto rounded-lg border-2 border-border bg-surface-muted p-3 font-mono text-sm leading-relaxed";

/** Righe da 16 byte con offset: così si contano i byte (0, 1, 2...) senza sbagliare. */
function hexRows(hex: string): { offset: string; bytes: string[] }[] {
  const all = hex.trim().split(/\s+/);
  const out: { offset: string; bytes: string[] }[] = [];
  for (let i = 0; i < all.length; i += 16) out.push({ offset: i.toString(16).padStart(4, "0"), bytes: all.slice(i, i + 16) });
  return out;
}

function LogView({ lines }: { lines: string[] }) {
  const id = useId();
  const [q, setQ] = useState("");
  const shown = useMemo(() => (q ? lines.filter((l) => l.toLowerCase().includes(q.toLowerCase())) : lines), [lines, q]);
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="grid gap-1 text-sm font-semibold">
        Filtro (mostra solo le righe che contengono…)
        <input id={id} value={q} onChange={(e) => setQ(e.target.value)} autoCapitalize="off" spellCheck={false} className="min-h-11 rounded-md border-2 border-border bg-background px-3 font-mono text-base" placeholder="es. Accepted" />
      </label>
      <p className="text-sm text-muted" aria-live="polite">
        {shown.length} righe su {lines.length}
      </p>
      <div className={`${box} max-h-96 overflow-y-auto`} role="region" aria-label="Registro" tabIndex={0}>
        {shown.map((l, i) => (
          <div key={i} className="whitespace-pre">
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ArtifactView({ artifact, challengeId }: { artifact: Artifact; challengeId: string }) {
  return (
    <section aria-label={artifact.title} className="grid gap-2">
      <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">{artifact.title}</h2>
      {artifact.kind === "text" && (
        <pre className={`${box} whitespace-pre-wrap break-words`} tabIndex={0}>
          {artifact.body}
        </pre>
      )}
      {artifact.kind === "log" && <LogView lines={artifact.lines} />}
      {artifact.kind === "hex" && (
        <div className={box} role="region" aria-label="Byte del pacchetto" tabIndex={0}>
          <p className="mb-1 text-xs text-muted">Offset (esadecimale) e byte: il primo byte è il numero 0.</p>
          {hexRows(artifact.hex).map((r) => (
            <div key={r.offset} className="whitespace-pre">
              <span className="text-muted">{r.offset}  </span>
              {r.bytes.join(" ")}
            </div>
          ))}
        </div>
      )}
      {artifact.kind === "table" && (
        <div className="overflow-x-auto rounded-lg border-2 border-border" role="region" aria-label={artifact.title} tabIndex={0}>
          <table className="w-full min-w-max text-left text-sm">
            <thead className="bg-surface-muted">
              <tr>
                {artifact.columns.map((c) => (
                  <th key={c} scope="col" className="px-3 py-2 font-bold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {artifact.rows.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  {r.map((cell, j) => (
                    <td key={j} className="px-3 py-2 font-mono">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {artifact.kind === "posts" && (
        <ul className="grid gap-2">
          {artifact.items.map((p, i) => (
            <li key={i} className="rounded-lg border-2 border-border bg-surface p-3">
              <p className="text-xs font-bold text-muted">
                {p.who.replace("_", " ")} · {p.when}
              </p>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>
      )}
      {artifact.kind === "sqlform" && <SqlForm challengeId={challengeId} variant={artifact.variant} schema={artifact.schema} />}
    </section>
  );
}
