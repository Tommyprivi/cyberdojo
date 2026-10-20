/** Avviso gentile per chi apre gli strumenti pratici da un telefono. */
export function PhoneNotice({ className = "" }: { className?: string }) {
  return (
    <aside role="note" className={`dossier flex gap-3 p-4 ${className}`}>
      <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-md border border-border font-mono text-sm font-bold">PC</span>
      <p>
        <strong>Gli esercizi pratici e il laboratorio si fanno da computer o tablet.</strong>{" "}
        <span className="text-muted">Servono molto spazio e una tastiera. Da telefono puoi ripassare con i quiz.</span>
      </p>
    </aside>
  );
}
