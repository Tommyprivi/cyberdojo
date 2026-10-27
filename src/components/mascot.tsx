import type { SenseiLook } from "@/lib/shop/items";

/**
 * Il Sensei: la mascotte di CyberDojo. Un onigiri con la fascia da dojo, ispirato al sigillo
 * rosso (hanko) e alla calligrafia del marchio.
 *
 * Con `animate` fluttua piano, sbatte le palpebre e le code della fascia ondeggiano.
 * Le animazioni sono in globals.css (.mascot-*) e si fermano con "riduci movimento".
 */
export function Mascot({
  size = 120,
  mood = "happy",
  className = "",
  animate = false,
  look,
}: {
  size?: number;
  mood?: "happy" | "stern" | "attento";
  className?: string;
  animate?: boolean;
  /** Oggetti del negozio equipaggiati (colore fascia, cappello, sfondo). Senza, il Sensei è quello di sempre. */
  look?: SenseiLook;
}) {
  const band = look?.band ?? "#b8321c";
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label="Il Sensei, la mascotte di CyberDojo: un onigiri con la fascia rossa da dojo"
      className={`${animate ? "mascot-animated" : ""} ${className}`}
    >
      <MascotBackground kind={look?.background} />
      {/* corpo di riso */}
      <path
        d="M60 10 C78 10 106 78 106 96 C106 109 92 114 60 114 C28 114 14 109 14 96 C14 78 42 10 60 10 Z"
        fill="#f4efe6"
        stroke="#1a1612"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* alga nori, in indaco come il colore del sito */}
      <path d="M17 88 H103 C106 103 92 114 60 114 C28 114 14 103 17 88 Z" fill="#1f3a5f" />
      {/* fascia da dojo, in rosso come il sigillo */}
      <path
        d="M31 50 Q60 40 89 50 L90 63 Q60 53 30 63 Z"
        fill={band}
        stroke="#1a1612"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* hanko al centro della fascia */}
      <circle cx="60" cy="52" r="6.5" fill="#f4efe6" />
      <circle cx="60" cy="52" r="3.4" fill={band} />
      <g className="mascot-tail">
        <path d="M89 52 L108 44 L104 58 Z" fill={band} stroke="#1a1612" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M89 56 L109 62 L98 70 Z" fill={band} stroke="#1a1612" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <MascotHat kind={look?.hat} />
      {/* occhi (con riflesso): un solo gruppo, così sbattono insieme */}
      <g className="mascot-eye">
        <ellipse cx="46" cy="76" rx="5" ry="6" fill="#1a1612" />
        <circle cx="47.6" cy="74" r="1.8" fill="#f4efe6" />
      </g>
      <g className="mascot-eye">
        <ellipse cx="74" cy="76" rx="5" ry="6" fill="#1a1612" />
        <circle cx="75.6" cy="74" r="1.8" fill="#f4efe6" />
      </g>
      {/* guance */}
      <circle cx="36" cy="84" r="5" fill="#ff9e8f" opacity="0.7" />
      <circle cx="84" cy="84" r="5" fill="#ff9e8f" opacity="0.7" />
      {/* bocca */}
      {mood === "happy" ? (
        <path d="M52 86 Q60 94 68 86" fill="none" stroke="#1a1612" strokeWidth="3.5" strokeLinecap="round" />
      ) : mood === "stern" ? (
        <path d="M53 90 H67" fill="none" stroke="#1a1612" strokeWidth="3.5" strokeLinecap="round" />
      ) : (
        <circle cx="60" cy="88" r="3" fill="#1a1612" />
      )}
    </svg>
  );
}

/** Sfondi del negozio: restano dietro al Sensei e non cambiano la sua forma. */
function MascotBackground({ kind }: { kind?: SenseiLook["background"] }) {
  if (!kind) return null;
  const rect = (fill: string) => <rect x="0" y="0" width="120" height="120" rx="18" fill={fill} />;
  switch (kind) {
    case "alba":
      return (
        <g aria-hidden="true">
          {rect("#ffd9a8")}
          <circle cx="92" cy="30" r="14" fill="#ff9e5e" />
        </g>
      );
    case "bambu":
      return (
        <g aria-hidden="true">
          {rect("#cfe8c4")}
          <path d="M14 0 V120 M26 0 V120 M100 0 V120 M108 0 V120" stroke="#6fa56b" strokeWidth="5" />
          <path d="M10 40 H30 M96 70 H112" stroke="#4d8450" strokeWidth="3" />
        </g>
      );
    case "notte":
      return (
        <g aria-hidden="true">
          {rect("#1d2a4a")}
          <circle cx="96" cy="26" r="11" fill="#f4efe6" />
          <circle cx="101" cy="23" r="10" fill="#1d2a4a" />
          <circle cx="20" cy="22" r="2" fill="#f4efe6" />
          <circle cx="40" cy="12" r="1.5" fill="#f4efe6" />
          <circle cx="14" cy="60" r="1.5" fill="#f4efe6" />
        </g>
      );
    case "sakura":
      return (
        <g aria-hidden="true">
          {rect("#fde0e6")}
          <circle cx="18" cy="24" r="4" fill="#f4a6b8" />
          <circle cx="100" cy="40" r="4" fill="#f4a6b8" />
          <circle cx="24" cy="70" r="3" fill="#f4a6b8" />
          <circle cx="98" cy="84" r="3" fill="#f4a6b8" />
        </g>
      );
    default:
      return null;
  }
}

/** Cappelli del negozio: sopra la testa del Sensei. */
function MascotHat({ kind }: { kind?: SenseiLook["hat"] }) {
  const line = { stroke: "#1a1612", strokeWidth: 3, strokeLinejoin: "round" as const };
  switch (kind) {
    case "paglia":
      return (
        <g aria-hidden="true">
          <path d="M38 26 Q60 0 82 26 Z" fill="#e3c26b" {...line} />
          <ellipse cx="60" cy="27" rx="34" ry="7" fill="#d9b45a" {...line} />
        </g>
      );
    case "ninja":
      return (
        <g aria-hidden="true">
          <path d="M40 30 Q60 18 80 30 L82 38 Q60 28 38 38 Z" fill="#1a1612" {...line} />
        </g>
      );
    case "cuoco":
      return (
        <g aria-hidden="true">
          <circle cx="50" cy="14" r="9" fill="#ffffff" {...line} />
          <circle cx="70" cy="14" r="9" fill="#ffffff" {...line} />
          <circle cx="60" cy="8" r="9" fill="#ffffff" {...line} />
          <rect x="46" y="20" width="28" height="12" rx="2" fill="#ffffff" {...line} />
        </g>
      );
    case "corona":
      return (
        <g aria-hidden="true">
          <path d="M42 30 L44 10 L53 20 L60 6 L67 20 L76 10 L78 30 Z" fill="#e8b923" {...line} />
        </g>
      );
    default:
      return null;
  }
}
