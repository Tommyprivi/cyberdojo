import Image from "next/image";
import Link from "next/link";
import { Seal } from "@/components/seal";

/**
 * Pagina 404. Il Sensei accoglie chi ha sbagliato l'indirizzo e ripiega verso la strada giusta.
 */
export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-16">
      <div className="grid max-w-md justify-items-center gap-5 text-center">
        <Image src="/img/stati/errore-404.png" alt="Il Sensei con una mappa, un po' perso" width={296} height={188} priority className="h-auto w-64" />
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">Errore 404</p>
        <h1 className="font-display text-3xl font-bold">Questa pagina non esiste</h1>
        <p className="text-muted">
          Il collegamento è sbagliato oppure la pagina è stata spostata. Niente panico: il percorso è ancora qui.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">Torna alla home</Link>
          <Link href="/corsi" className="btn btn-ghost">Vedi i corsi</Link>
        </div>
        <p className="flex items-center gap-2 text-sm text-muted">
          <Seal size={28} />
          CyberDojo
        </p>
      </div>
    </main>
  );
}
