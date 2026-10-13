/**
 * Sigillo rosso (hanko) con 道場, "dōjō": il luogo dove si pratica la via.
 * Usato come timbro di identità e di conferma (es. lezione superata).
 */
export function Seal({ size = 44, label = "道場", className = "" }: { size?: number; label?: string; className?: string }) {
  return (
    <span
      role="img"
      aria-label="Sigillo del dojo"
      className={`inline-grid shrink-0 place-items-center rounded-[22%] border-[3px] border-accent bg-accent font-bold leading-none text-accent-fg [writing-mode:vertical-rl] ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.34, boxShadow: "inset 0 0 0 2px var(--accent-fg)" }}
    >
      {label}
    </span>
  );
}
