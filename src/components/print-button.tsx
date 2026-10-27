"use client";

/** Apre la stampa del browser: da lì si può anche salvare in PDF. */
export function PrintButton({ label = "Stampa o salva in PDF" }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-primary min-h-12 print:hidden">
      {label}
    </button>
  );
}
