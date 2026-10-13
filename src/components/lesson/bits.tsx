/** Schema statico di un numero binario: bit sopra, peso sotto, bit a 1 evidenziati e somma. */
export function BitGrid({ bits, showSum = true, caption }: { bits: string; showSum?: boolean; caption?: string }) {
  const n = bits.length;
  const weights = Array.from({ length: n }, (_, i) => 2 ** (n - 1 - i));
  const ones = weights.filter((_, i) => bits[i] === "1");
  const total = ones.reduce((a, b) => a + b, 0);

  return (
    <figure className="my-2 grid gap-2">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[20rem] table-fixed border-separate border-spacing-1.5 text-center font-mono">
          <tbody>
            <tr>
              <th scope="row" className="w-12 pr-1 text-left font-sans text-sm text-muted">Bit</th>
              {[...bits].map((b, i) => (
                <td
                  key={i}
                  className={`rounded-xl py-2 text-xl font-bold ${
                    b === "1" ? "bg-primary text-primary-fg" : "bg-surface-muted text-muted"
                  }`}
                >
                  {b}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className="pr-2 text-left font-sans text-sm text-muted">Peso</th>
              {weights.map((w, i) => (
                <td key={i} className={`py-1 text-sm ${bits[i] === "1" ? "font-bold text-primary" : "text-muted"}`}>
                  {w}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {showSum && (
        <figcaption className="text-center text-lg">
          {ones.length ? ones.join(" + ") : "nessun bit a 1"} = <strong className="text-primary">{total}</strong>
        </figcaption>
      )}
      {caption && <p className="text-center text-sm text-muted">{caption}</p>}
    </figure>
  );
}

/** Riquadri di spiegazione: una regola, un errore da evitare, un esempio. */
const KINDS = {
  regola: { label: "Regola", cls: "border-primary" },
  attenzione: { label: "Attenzione", cls: "border-accent" },
  esempio: { label: "Esempio", cls: "border-belt-blue" },
  trucco: { label: "Trucco per ricordarlo", cls: "border-belt-yellow" },
} as const;

export function Callout({ kind, children }: { kind: keyof typeof KINDS; children: React.ReactNode }) {
  const k = KINDS[kind];
  return (
    <div className={`my-1 rounded-2xl border-l-[6px] ${k.cls} bg-surface-muted px-4 py-3`}>
      <p className="text-sm font-extrabold uppercase tracking-wide">{k.label}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}
