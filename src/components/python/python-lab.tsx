"use client";

import { PythonWorkbench } from "./python-workbench";

const STARTER = `# Scrivi il tuo codice Python qui, poi premi Esegui (o Ctrl + Invio).
nome = input("Come ti chiami? ")
print("Ciao,", nome)

for i in range(1, 4):
    print("Giro numero", i)
`;

/** Strumento a tutto schermo: codice a sinistra, terminale a destra. */
export function PythonLab() {
  return <PythonWorkbench storageKey="cyberdojo:python:lab" initialCode={STARTER} layout="split" />;
}
