import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL_DOCS } from "@/lib/legal-docs";

export const metadata: Metadata = {
  title: "Disclaimer dei laboratori",
  description:
    "Dove puoi esercitarti con CyberDojo e cosa non devi mai fare: la regola è semplice, si prova solo ciò che è tuo.",
};

export default function LaboratorioPage() {
  return (
    <LegalPage
      title={LEGAL_DOCS.laboratorio.title}
      updated={LEGAL_DOCS.laboratorio.updated}
      intro="Questa pagina vale più di qualsiasi avviso: se non ti è chiaro cosa puoi fare, fermati e chiedi."
    >
      <h2>1. La regola</h2>
      <p>
        <strong>Si prova solo ciò che è tuo.</strong> Puoi esercitarti sui sistemi che possiedi, su
        macchine virtuali che hai creato tu e su ambienti costruiti apposta per la pratica (CTF,
        sandbox). Non puoi esercitarti su sistemi di terzi, nemmeno per provare, nemmeno per una
        ricerca, nemmeno se ti sembra che &quot;non ci sia nessuno a guardare&quot;.
      </p>

      <h2>2. Cosa succede tecnicamente, se violare una legge</h2>
      <p>
        In Italia l&apos;accesso abusivo a un sistema informatico è reato: l&apos;articolo 615-ter del Codice
        Penale punisce chi&quot;aggira o viola una misura di sicurezza o un&apos;accesso senza autorizzazione
        &quot;per introdurre o eseguire un codice informatico&quot;. Il 615-quater punisce l&apos;uso di
        chiavi, codici o credenziali per aggirare i controlli. Se ci metti mano, i danni si distinguono
        in reati e in obbligo di risarcimento, anche se non hai&quot;danneggiato&quot; nulla.
      </p>
      <p>
        Non è una questione di buone intenzioni: la legge non distingue fra chi vuole imparare e chi
        vuole fare danni, guarda quello che hai fatto. Chi vuole provare cose del genere ha a
        disposizione ambienti costruiti apposta, gratuiti e perfettamente legali.
      </p>

      <h2>3. I laboratori dentro CyberDojo sono sicuri per definizione</h2>
      <ul>
        <li>
          <strong>Laboratorio SQL</strong>: PostgreSQL compilato in WebAssembly, gira dentro il tuo
          browser. Nessuna connessione, nessun server, nessun dato che esce dal computer.
        </li>
        <li>
          <strong>Laboratorio Python</strong>: l&apos;interprete gira in un worker del browser. Stessa
          cosa: nulla viene inviato a macchine esterne.
        </li>
        <li>
          <strong>Calcolatore di reti</strong> e <strong>analisi dei log</strong>: calcoli e letture
          guidate, senza traffico di rete.
        </li>
        <li>
          <strong>La lezione &quot;home lab&quot;</strong> ti guida a costruire il tuo laboratorio personale
          con macchine virtuali isolate. È l&apos;unica parte in cui esci dal browser, e lo fai solo
          tu, sul tuo computer, con il tuo permesso.
        </li>
      </ul>

      <h2>4. Se costruisci il tuo laboratorio, fallo come si deve</h2>
      <ul>
        <li>Usa una macchina virtuale (VirtualBox, VMware o equivalente) con rete &quot;host-only&quot; o una rete virtuale isolata: niente NAT, niente bridge verso la rete di casa.</li>
        <li>Non condividere cartelle con l&apos;host, non montare dischi condivisi, non usare cartelle di rete.</li>
        <li>Non esporre la macchina virtuale su Internet: niente porte aperte, niente forwarding.</li>
        <li>Fai uno snapshot prima di ogni esercizio: se il sistema si blocca, torni indietro in un minuto.</li>
        <li>Usa password solo per la macchina virtuale, mai quelle di account reali.</li>
        <li>Per il post-it: dentro la macchina virtuale puoi fare quello che vuoi, fuori no.</li>
      </ul>

      <h2>5. Se il laboratorio non è tuo</h2>
      <p>
        Vuoi provare su un&apos;azienda, su un&apos;scuola o su un sistema di un cliente? Allora serve
        un accordo scritto, che dica chiaramente:
      </p>
      <ul>
        <li>quali indirizzi e quali sistemi sono in scope;</li>
        <li>quali tecniche sono consentite e quali no;</li>
        <li>quando inizia e quando finisce il test;</li>
        <li>a chi chiamare se qualcosa va storto, e come;</li>
        <li>cosa fare dei dati trovati (di solito: non si copiano, si segnalano).</li>
      </ul>
      <p>
        Se non hai un accordo di questo tipo, non c&apos;è un test da fare: c&apos;è solo una violazione.
      </p>

      <h2>6. Ambienti alternativi, gratuiti e legali</h2>
      <ul>
        <li>
          <strong>CTF</strong>: competizioni organizzate, con sistemi fatti apposta per essere attaccati
          e liberati solo durante l&apos;evento.
        </li>
        <li>
          <strong>Macchine virtuali ufficiali</strong> pubblicate dai fornitori e dai produttori, con
          licenza per l&apos;uso formativo.
        </li>
        <li>
          <strong>Ambienti di pratica</strong> messi a disposizione da entità del settore, pensati per
          l&apos;addestramento e per le certificazioni.
        </li>
        <li>
          <strong>Il tuo laboratorio</strong>: macchine virtuali isolate, con la rete staccata. È
          l&apos;ambiente migliore in assoluto, perché non tocca nessuno.
        </li>
      </ul>

      <h2>7. Cosa fare se hai già sbagliato</h2>
      <p>
        Se hai avuto un accesso non autorizzato: non tentare di coprire, continua e arrangiarti da solo.
        Lascia le tracce, non usare il sistema per cancellare i log, e fai sapere subito a chi
        amministra il sistema. In molti casi la tempestività cambia la valutazione della vicenda.
      </p>

      <h2>8. Il dojo e i tuoi dati</h2>
      <p>
        Nei laboratori del sito si usano dati finti, costruiti apposta: log inventati, indirizzi di
        esempio, traffico simulato. <strong>Non</strong> caricare qui log aziendali, dati di clienti,
        chiavi o credenziali vere. Se ti serve analizzare un caso reale, fallo sulla tua macchina
        virtuale.
      </p>
    </LegalPage>
  );
}
