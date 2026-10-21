/**
 * Anteprime illustrate degli strumenti: disegni semplici, solo decorativi (aria-hidden).
 * Usano i colori dell'app tramite variabili CSS, quindi seguono chiaro e scuro.
 */
export type PreviewKind = "calc" | "binary" | "intruder" | "terminal" | "packets" | "logs" | "sql";

const ink = "var(--foreground)";
const muted = "var(--foreground-muted)";
const line = "var(--border)";
const primary = "var(--primary)";
const accent = "var(--accent)";
const surface = "var(--surface)";

function Bits({ x, y, n, lit }: { x: number; y: number; n: number; lit: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <rect x={x + i * 20} y={y} width={16} height={20} rx={2} fill={i < lit ? primary : surface} stroke={i < lit ? primary : line} />
          <text x={x + i * 20 + 8} y={y + 14} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={i < lit ? "var(--primary-fg)" : ink}>
            {(i * 7 + 3) % 2}
          </text>
        </g>
      ))}
    </>
  );
}

export function ToolPreview({ kind, className = "" }: { kind: PreviewKind; className?: string }) {
  return (
    <svg viewBox="0 0 240 120" role="presentation" aria-hidden className={`block w-full ${className}`} preserveAspectRatio="xMidYMid slice">
      <rect width={240} height={120} fill="var(--surface-muted)" />
      <rect x={0} y={0} width={240} height={18} fill={surface} />
      <line x1={0} y1={18} x2={240} y2={18} stroke={line} />
      {[10, 22, 34].map((cx) => (
        <circle key={cx} cx={cx} cy={9} r={3} fill={line} />
      ))}

      {kind === "calc" && (
        <g>
          <text x={14} y={38} fontSize={9} fontFamily="monospace" fill={muted}>192.168.1.66 /24</text>
          <Bits x={14} y={46} n={8} lit={8} />
          <Bits x={14} y={72} n={8} lit={8} />
          <Bits x={180} y={46} n={2} lit={0} />
          <rect x={14} y={100} width={96} height={6} rx={1} fill={line} />
          <rect x={120} y={100} width={60} height={6} rx={1} fill={primary} />
        </g>
      )}

      {kind === "binary" && (
        <g>
          <text x={14} y={44} fontSize={20} fontFamily="monospace" fill={ink} letterSpacing={3}>1100 0000</text>
          <text x={14} y={64} fontSize={9} fontFamily="monospace" fill={muted}>128 64 32 16 8 4 2 1</text>
          <rect x={14} y={78} width={74} height={24} rx={3} fill={surface} stroke={primary} strokeWidth={2} />
          <text x={22} y={95} fontSize={15} fontFamily="monospace" fill={primary}>192</text>
          <text x={104} y={95} fontSize={12} fontFamily="monospace" fill={muted}>= 128 + 64</text>
        </g>
      )}

      {kind === "intruder" && (
        <g fontFamily="monospace" fontSize={8.5}>
          <text x={12} y={34} fill={muted}>03:12:08 DENY 11000000.10101000...</text>
          <text x={12} y={48} fill={muted}>03:12:09 ALLOW 00001010.00000000...</text>
          <text x={12} y={62} fill={accent}>03:12:09 ALLOW 10110011.01000111...</text>
          <rect x={8} y={53} width={224} height={13} rx={2} fill="none" stroke={accent} />
          <text x={12} y={76} fill={muted}>03:12:11 DENY 11000000.10101000...</text>
          <rect x={12} y={90} width={70} height={20} rx={3} fill={surface} stroke={ink} />
          <text x={22} y={104} fontSize={10} fill={ink}>Da dentro</text>
          <rect x={92} y={90} width={80} height={20} rx={3} fill={surface} stroke={ink} />
          <text x={100} y={104} fontSize={10} fill={ink}>Da Internet</text>
        </g>
      )}

      {kind === "terminal" && (
        <g fontFamily="monospace" fontSize={10}>
          <rect x={0} y={18} width={240} height={102} fill="var(--deep)" />
          <text x={12} y={38} fill="var(--deep-fg)">$ ls -l /var/log</text>
          <text x={12} y={52} fill="var(--deep-fg)" opacity={0.7}>-rw-r----- auth.log</text>
          <text x={12} y={66} fill="var(--deep-fg)" opacity={0.7}>-rw-r----- syslog</text>
          <text x={12} y={84} fill="var(--deep-fg)">$ grep Failed auth.log</text>
          <rect x={12} y={92} width={7} height={12} fill="var(--deep-fg)" />
        </g>
      )}

      {kind === "sql" && (
        <g fontFamily="monospace" fontSize={9}>
          <text x={12} y={36} fill={primary} fontWeight={700}>SELECT <tspan fill={ink} fontWeight={400}>nome, citta</tspan></text>
          <text x={12} y={49} fill={primary} fontWeight={700}>FROM <tspan fill={ink} fontWeight={400}>clienti;</tspan></text>
          <rect x={8} y={60} width={224} height={14} fill="var(--surface-muted)" stroke={line} />
          <text x={14} y={70} fill={ink} fontWeight={700}>nome          citta</text>
          <text x={14} y={85} fill={ink}>Giulia        Milano</text>
          <text x={14} y={98} fill={ink}>Marco         Roma</text>
          <text x={14} y={111} fill={muted}>12 righe · 2 ms</text>
        </g>
      )}

      {kind === "packets" && (
        <g fontFamily="monospace" fontSize={8.5}>
          {[0, 1, 2, 3, 4].map((r) => (
            <g key={r}>
              <rect x={8} y={26 + r * 14} width={224} height={13} fill={r === 2 ? primary : r % 2 ? surface : "transparent"} />
              <text x={12} y={36 + r * 14} fill={r === 2 ? "var(--primary-fg)" : ink}>
                {r + 1}  10.0.0.{r + 4} → 93.184.216.34  TCP  443
              </text>
            </g>
          ))}
          <rect x={8} y={100} width={224} height={14} fill="none" stroke={line} />
          <text x={12} y={110} fill={muted}>Ethernet › IP › TCP › dati</text>
        </g>
      )}

      {kind === "logs" && (
        <g fontFamily="monospace" fontSize={8.5}>
          {[0, 1, 2, 3, 4, 5].map((r) => (
            <g key={r}>
              <text x={12} y={34 + r * 14} fill={r === 3 ? accent : muted}>
                {`Oct 20 03:1${r} fw DROP SRC=185.220.${r + 1}.9 DPT=22`}
              </text>
            </g>
          ))}
          <rect x={8} y={59} width={224} height={13} rx={2} fill="none" stroke={accent} />
        </g>
      )}
    </svg>
  );
}
