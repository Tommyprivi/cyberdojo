"use client";

import { usePathname } from "next/navigation";
import { CodeEditor } from "./code-editor";
import { PythonWorkbench } from "./python-workbench";

function hash(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/**
 * Terminale Python per le lezioni: <PythonTerminal code="print('ciao')" height={320} />
 * Da 768px in su si può eseguire il codice; sotto, solo lettura con un avviso.
 * Il codice dello studente si salva nel browser, per lezione e per terminale (se il browser lo permette).
 */
export function PythonTerminal({ code = "", height = 320 }: { code?: string; height?: number }) {
  const pathname = usePathname();
  const storageKey = `cyberdojo:python:${pathname}:${hash(code)}`;
  return (
    <div className="not-prose my-4">
      <div className="hidden md:block">
        <PythonWorkbench storageKey={storageKey} initialCode={code} layout="stacked" height={height} />
      </div>
      <div className="grid gap-2 md:hidden">
        <div className="overflow-hidden rounded-lg border border-border">
          <CodeEditor value={code} onChange={() => {}} readOnly label="Codice Python (sola lettura)" className="max-h-80" />
        </div>
        <p role="note" className="dossier p-3 text-sm">
          <strong>Per eseguire Python usa un computer o un tablet.</strong>
        </p>
      </div>
    </div>
  );
}
