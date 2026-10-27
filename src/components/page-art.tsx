import Image from "next/image";

/** Illustrazioni delle pagine: dimensioni vere dei file in public/img. */
export const ART = {
  ctf: { src: "/img/funzioni/ctf-copertina.png", width: 362, height: 458 },
  duello: { src: "/img/funzioni/duello.png", width: 312, height: 228 },
  eventi: { src: "/img/funzioni/eventi-dal-vivo.png", width: 350, height: 280 },
  mappa: { src: "/img/funzioni/mappa-sapere.png", width: 320, height: 296 },
  cerca: { src: "/img/funzioni/cerca.png", width: 172, height: 172 },
  glossario: { src: "/img/funzioni/glossario.png", width: 196, height: 158 },
  ripasso: { src: "/img/funzioni/ripasso.png", width: 320, height: 296 },
  padronanza: { src: "/img/funzioni/prova-padronanza.png", width: 320, height: 296 },
  ingresso: { src: "/img/funzioni/test-ingresso.png", width: 320, height: 296 },
  segnalibro: { src: "/img/funzioni/segnalibro.png", width: 102, height: 164 },
  notifiche: { src: "/img/funzioni/notifiche.png", width: 240, height: 246 },
  portfolio: { src: "/img/funzioni/portfolio.png", width: 330, height: 272 },
  docente: { src: "/img/funzioni/docente.png", width: 304, height: 280 },
  app: { src: "/img/funzioni/installa-app.png", width: 168, height: 284 },
  senseiLente: { src: "/img/mascotte/sensei-lente.png", width: 380, height: 372 },
  senseiStudia: { src: "/img/mascotte/sensei-studia.png", width: 336, height: 366 },
  senseiMicrofono: { src: "/img/mascotte/sensei-microfono.png", width: 346, height: 412 },
  senseiFelice: { src: "/img/mascotte/sensei-felice.png", width: 414, height: 396 },
  senseiCelebra: { src: "/img/mascotte/sensei-celebra.png", width: 382, height: 424 },
  senseiTriste: { src: "/img/mascotte/sensei-triste.png", width: 336, height: 472 },
  vuotoAppunti: { src: "/img/stati/vuoto-appunti.png", width: 316, height: 444 },
  vuotoSegnalibri: { src: "/img/stati/vuoto-segnalibri.png", width: 248, height: 444 },
  moneta: { src: "/img/negozio/moneta.png", width: 220, height: 220 },
  negozio: { src: "/img/negozio/negozio.png", width: 790, height: 610 },
} as const;

export type ArtKey = keyof typeof ART;

/**
 * Immagine illustrata su riquadro crema (così il contorno scuro si vede anche nel tema scuro).
 * Decorativa di default (alt vuoto). `size` è il lato del riquadro in pixel.
 * Con `inline` sta nel flusso; altrimenti si posiziona in alto a destra dell'intestazione (padre `relative`).
 */
export function PageArt({
  art,
  size = 64,
  alt = "",
  priority = false,
  inline = false,
  className = "",
}: {
  art: ArtKey;
  size?: number;
  alt?: string;
  priority?: boolean;
  inline?: boolean;
  className?: string;
}) {
  const a = ART[art];
  return (
    <span
      aria-hidden={alt === "" ? true : undefined}
      className={`${inline ? "inline-grid shrink-0" : "absolute right-0 top-0 grid"} place-items-center rounded-xl bg-[#f4efe4] p-1.5 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image src={a.src} alt={alt} width={a.width} height={a.height} sizes={`${size}px`} priority={priority} className="h-full w-full object-contain" />
    </span>
  );
}

/**
 * Come PageArt ma per un file qualsiasi (leghe, medaglie, cinture, oggetti del negozio).
 * Il riquadro crema tiene visibile il contorno scuro anche nel tema scuro. `muted` = grigio e spento (bloccato).
 */
export function ArtImage({
  src,
  width,
  height,
  size = 48,
  alt = "",
  muted = false,
  wide = false,
  className = "",
}: {
  src: string;
  width: number;
  height: number;
  /** Altezza del riquadro in pixel. */
  size?: number;
  alt?: string;
  muted?: boolean;
  /** Riquadro largo il doppio (per le cinture e gli oggetti orizzontali). */
  wide?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-xl bg-[#f4efe4] p-1.5 ${muted ? "opacity-50 grayscale" : ""} ${className}`}
      style={{ height: size, width: wide ? size * 2 : size }}
    >
      <Image src={src} alt={alt} width={width} height={height} sizes={`${wide ? size * 2 : size}px`} className="h-full w-full object-contain" />
    </span>
  );
}
