import Link from "next/link";

const LINKS = [
  ["/revisione", "Centro"],
  ["/revisione/lezioni", "Lezioni (stato)"],
  ["/revisione/domande", "Domande"],
  ["/revisione/grafica", "Grafica"],
  ["/revisione/ux", "Schermate e UX"],
  ["/revisione/video", "Video"],
  ["/revisione/email", "Email"],
  ["/revisione/lavori", "Lavori da fare"],
  ["/anteprima", "Le due interfacce"],
] as const;

/** Barra di navigazione del centro di revisione (in cima a ogni pagina). */
export function ReviewNav() {
  return (
    <nav aria-label="Centro di revisione" className="mb-6 flex flex-wrap gap-2 border-b border-border pb-4">
      {LINKS.map(([href, label]) => (
        <Link key={href} href={href} className="chip min-h-10 text-sm font-semibold hover:bg-surface-muted">
          {label}
        </Link>
      ))}
    </nav>
  );
}
