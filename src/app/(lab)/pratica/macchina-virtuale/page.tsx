import type { Metadata } from "next";
import { Workspace } from "@/components/lab/workspace";
import { VirtualMachine } from "@/components/linux/virtual-machine";
import { VM_ASSETS, VM_MEGABYTES } from "@/lib/linux/vm-config";

export const metadata: Metadata = { title: "Laboratorio: macchina virtuale (sperimentale)" };

const host = (u: string) => new URL(u).host;

export default function MacchinaVirtualePage() {
  return (
    <Workspace tool="Sperimentale" title="Macchina virtuale Linux">
      <div className="grid h-full grid-cols-[minmax(0,1fr)_22rem] overflow-hidden">
        <div className="min-h-0 overflow-y-auto p-4">
          <VirtualMachine goal="Esplora un vero Linux: guarda i file, i processi e il kernel." height="h-[62dvh]" />
        </div>
        <aside aria-label="Tutor" className="min-h-0 overflow-y-auto border-l border-border bg-surface p-4">
          <div className="grid gap-5">
            <p role="note" className="dossier p-3 text-sm">
              <strong>Funzione sperimentale.</strong> Può essere lenta, e alcuni comandi di un Linux completo non ci sono. Per imparare i comandi usa anche il{" "}
              <a className="underline" href="/pratica/terminale">terminale simulato</a>.
            </p>
            <section className="grid gap-2">
              <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Per cominciare</h2>
              <ol className="grid list-decimal gap-1 pl-5 text-sm">
                <li>Premi «Avvia» e aspetta il prompt (pochi secondi dopo il download).</li>
                <li>Clicca sullo schermo nero e digita, oppure usa i comandi di partenza sotto lo schermo.</li>
                <li>Prova <code className="font-mono">uname -a</code>, <code className="font-mono">ls /</code>, <code className="font-mono">ps</code>.</li>
                <li>Crea un file con <code className="font-mono">echo ciao &gt; /tmp/prova.txt</code> e rileggilo con <code className="font-mono">cat</code>.</li>
                <li>Prova <code className="font-mono">ping -c 1 8.8.8.8</code>: non funziona, e va bene così. La rete è isolata.</li>
              </ol>
              <p className="text-sm text-muted">«Riavvia» riaccende la macchina. «Ripristina» la ricrea da zero. Tutto ciò che crei sparisce chiudendo la pagina.</p>
            </section>
            <section className="grid gap-2 text-sm">
              <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Cosa scarica ({VM_MEGABYTES} MB)</h2>
              <ul className="grid gap-1 text-muted">
                <li>Emulatore <a className="underline" href="https://github.com/copy/v86">v86</a> (licenza BSD-2-Clause) da {host(VM_ASSETS.lib.url)}.</li>
                <li>Linux di prova (Buildroot, kernel Linux, licenza GPL-2.0) da {host(VM_ASSETS.kernel.url)}, pubblicato dall&apos;autore di v86.</li>
                <li>Ogni file viene controllato con la sua impronta SHA-256 prima dell&apos;uso.</li>
                <li>Nessuna scheda di rete collegata: niente Internet, nessun dato esce.</li>
              </ul>
            </section>
          </div>
        </aside>
      </div>
    </Workspace>
  );
}
