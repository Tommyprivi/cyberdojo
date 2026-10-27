import Image from "next/image";
import { Mascot } from "@/components/mascot";
import { previewLayers } from "@/lib/shop/items";

/**
 * Il Sensei con gli oggetti del negozio addosso.
 * Il riquadro è crema (#f4efe4, come le altre immagini, per il tema scuro); lo sfondo comprato lo copre (object-cover).
 * Il Sensei sta in un quadrato interno e ogni oggetto è posizionato in percentuale di quel quadrato:
 * i valori (x, y, w, rotate) stanno nel catalogo, in `fit` di ogni oggetto (src/lib/shop/items.ts).
 *
 * `className` decide dimensione e proporzioni del riquadro (es. "size-28" oppure "aspect-[4/3] w-full").
 */
export function SenseiPreview({
  equipped,
  mood = "happy",
  animate = false,
  className = "size-28",
}: {
  /** Id degli oggetti da mostrare. */
  equipped: readonly string[];
  mood?: "happy" | "stern" | "attento";
  animate?: boolean;
  className?: string;
}) {
  const { background, worn } = previewLayers(equipped);
  const names = [...worn, ...(background ? [background] : [])].map(
    (i) => i.name,
  );
  const label = names.length
    ? `Il tuo Sensei, con: ${names.join(", ")}`
    : "Il tuo Sensei, senza oggetti addosso";

  return (
    <div
      role="img"
      aria-label={label}
      className={`relative shrink-0 overflow-hidden rounded-xl bg-[#f4efe4] ${className}`}
    >
      {background ? (
        <Image
          src={background.img.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 24rem, 100vw"
          className="object-cover"
        />
      ) : null}
      {/* quadrato del Sensei: alto l'80% del riquadro, centrato, un po' in basso per lasciare posto ai cappelli. Con animate fluttua col suo equipaggiamento (le palpebre e le code si muovono da sole) */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 flex justify-center"
        style={{ top: "18%", height: "80%" }}
      >
        <div
          className={`relative aspect-square h-full ${animate ? "mascot-animated" : ""}`}
        >
          <Mascot mood={mood} className="h-full w-full" />
          {worn.map((item) => {
            const fit = item.fit!;
            return (
              <Image
                key={item.id}
                src={item.img.src}
                alt=""
                width={item.img.width}
                height={item.img.height}
                sizes="20rem"
                className="pointer-events-none absolute h-auto max-w-none"
                style={{
                  left: `${fit.x}%`,
                  top: `${fit.y}%`,
                  width: `${fit.w}%`,
                  transform: `translateX(-50%)${fit.rotate ? ` rotate(${fit.rotate}deg)` : ""}`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
