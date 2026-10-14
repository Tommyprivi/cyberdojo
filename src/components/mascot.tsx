/**
 * PLACEHOLDER GENERATO: mascotte "Onigiri Sensei", disegnata in SVG come bozza.
 * Da sostituire con l'illustrazione definitiva (vedi DECISIONS.md, sezione Asset).
 *
 * Con `animate` fluttua piano, sbatte le palpebre e le code della fascia ondeggiano.
 * Le animazioni sono in globals.css (.mascot-*) e si fermano con "riduci movimento".
 */
export function Mascot({
  size = 120,
  mood = "happy",
  className = "",
  animate = false,
}: {
  size?: number;
  mood?: "happy" | "stern";
  className?: string;
  animate?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label="Il Sensei, una mascotte a forma di onigiri con la fascia rossa"
      className={`${animate ? "mascot-animated" : ""} ${className}`}
    >
      {/* corpo */}
      <path
        d="M60 10 C78 10 106 78 106 96 C106 109 92 114 60 114 C28 114 14 109 14 96 C14 78 42 10 60 10 Z"
        fill="#ffffff"
        stroke="#16301c"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* alga nori */}
      <path d="M17 88 H103 C106 103 92 114 60 114 C28 114 14 103 17 88 Z" fill="#1d2b22" />
      {/* fascia da dojo */}
      <path d="M31 50 Q60 40 89 50 L90 63 Q60 53 30 63 Z" fill="#c0301c" stroke="#16301c" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="60" cy="52" r="6.5" fill="#ffffff" />
      <circle cx="60" cy="52" r="3.4" fill="#c0301c" />
      <g className="mascot-tail">
        <path d="M89 52 L108 44 L104 58 Z" fill="#c0301c" stroke="#16301c" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M89 56 L109 62 L98 70 Z" fill="#c0301c" stroke="#16301c" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      {/* occhi (con riflesso): un solo gruppo, così sbattono insieme */}
      <g className="mascot-eye">
        <ellipse cx="46" cy="76" rx="5" ry="6" fill="#16301c" />
        <circle cx="47.6" cy="74" r="1.8" fill="#fff" />
      </g>
      <g className="mascot-eye">
        <ellipse cx="74" cy="76" rx="5" ry="6" fill="#16301c" />
        <circle cx="75.6" cy="74" r="1.8" fill="#fff" />
      </g>
      {/* guance */}
      <circle cx="36" cy="84" r="5" fill="#ff9e8f" opacity="0.7" />
      <circle cx="84" cy="84" r="5" fill="#ff9e8f" opacity="0.7" />
      {/* bocca */}
      {mood === "happy" ? (
        <path d="M52 86 Q60 94 68 86" fill="none" stroke="#16301c" strokeWidth="3.5" strokeLinecap="round" />
      ) : (
        <path d="M53 90 H67" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
      )}
    </svg>
  );
}
