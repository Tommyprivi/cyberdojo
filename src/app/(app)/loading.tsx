/** Scheletro mostrato mentre una pagina dell'area riservata si carica: niente salti bianchi, nessun movimento. */
export default function Loading() {
  return (
    <div className="grid gap-4" aria-busy="true" aria-label="Carico la pagina" role="status">
      <div className="h-9 w-2/3 rounded-md bg-surface-muted" />
      <div className="h-24 rounded-lg bg-surface-muted" />
      <div className="h-40 rounded-lg bg-surface-muted" />
      <div className="h-24 rounded-lg bg-surface-muted" />
    </div>
  );
}
