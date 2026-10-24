import { BoltIcon, BookIcon, BulbIcon, FlameIcon, TargetIcon } from "../icons";

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
                  className={`rounded-md py-2 text-xl font-bold ${
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

/**
 * Righe di un registro (log). I campi separati da due spazi; quelli del tipo chiave=valore
 * mostrano la chiave attenuata e il valore in evidenza, così si impara a leggerli.
 */
export function Log({ lines, caption }: { lines: string[]; caption?: string }) {
  return (
    <figure className="my-2 grid gap-2">
      <div className="overflow-x-auto rounded-lg bg-deep p-4 font-mono text-sm leading-relaxed text-deep-fg sm:text-base">
        {lines.map((line, i) => (
          <p key={i} className="mb-3 last:mb-0">
            {line.split(/ {2,}/).map((token, k) => {
              const eq = token.indexOf("=");
              return (
                <span key={k} className="mr-4 inline-block max-w-full align-top">
                  {eq > 0 ? (
                    <>
                      <span className="opacity-70">{token.slice(0, eq + 1)}</span>
                      <strong>{token.slice(eq + 1)}</strong>
                    </>
                  ) : (
                    <span className="opacity-90">{token}</span>
                  )}
                </span>
              );
            })}
          </p>
        ))}
      </div>
      {caption && <figcaption className="text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}

/** Le quattro buste di un pacchetto, una dentro l'altra: Ethernet ⊃ IP ⊃ TCP ⊃ dati. */
export function Envelope() {
  return (
    <figure className="my-2" aria-label="Un pacchetto: busta Ethernet, dentro busta IP, dentro busta TCP, dentro i dati">
      <div className="rounded-lg border-2 border-belt-blue bg-surface-muted p-3">
        <p className="text-sm font-extrabold">
          Busta Ethernet <span className="font-normal text-muted">· indirizzi MAC · livello 2</span>
        </p>
        <div className="mt-2 rounded-lg border-2 border-belt-orange bg-surface p-3">
          <p className="text-sm font-extrabold">
            Busta IP <span className="font-normal text-muted">· indirizzi IP · livello 3</span>
          </p>
          <div className="mt-2 rounded-md border-2 border-primary bg-surface-muted p-3">
            <p className="text-sm font-extrabold">
              Busta TCP <span className="font-normal text-muted">· porte · livello 4</span>
            </p>
            <div className="mt-2 rounded-lg border border-dashed border-border bg-surface p-3">
              <p className="text-sm font-extrabold">
                Dati <span className="font-normal text-muted">· ciò che vuole l&apos;applicazione</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-2 text-sm text-muted">
        Chi invia aggiunge le buste da dentro verso fuori. Chi riceve le toglie da fuori verso dentro.
      </figcaption>
    </figure>
  );
}

/** Riquadri di spiegazione: una regola, un errore da evitare, un esempio. Ognuno ha il suo colore e la sua icona. */
const KINDS = {
  regola: { label: "Regola", color: "var(--primary)", Icon: BookIcon },
  attenzione: { label: "Attenzione", color: "var(--accent)", Icon: FlameIcon },
  esempio: { label: "Esempio", color: "var(--sky)", Icon: TargetIcon },
  trucco: { label: "Trucco per ricordarlo", color: "var(--sun)", Icon: BulbIcon },
  curiosita: { label: "Lo sapevi?", color: "var(--belt-orange)", Icon: BoltIcon },
} as const;

export function Callout({ kind, children }: { kind: keyof typeof KINDS; children: React.ReactNode }) {
  const { label, color, Icon } = KINDS[kind];
  return (
    <div
      className="my-1 flex max-w-[70ch] gap-3 rounded-2xl border-2 px-4 py-3.5"
      style={{ borderColor: color, background: `color-mix(in srgb, ${color} 10%, var(--surface))` }}
    >
      <span aria-hidden className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full text-foreground" style={{ background: color }}>
        <Icon width={20} height={20} style={{ color: kind === "trucco" ? "var(--sun-fg)" : "#fff" }} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-extrabold uppercase tracking-wide">{label}</p>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}
