import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Contatti",
  description: "Scrivici: domande, segnalazioni di bug, problemi di accessibilità e richieste sui tuoi dati.",
};

export default function ContattiPage() {
  return (
    <LegalPage
      title="Contatti"
      updated="21 ottobre 2026"
      intro="Chi c&apos;è dietro CyberDojo risponde alle email. Non c&apos;è un servizio clienti: scriviamo noi, in italiano."
    >
      <h2>1. Scrivici</h2>
      <p>
        Il modulo qui sotto arriva direttamente nella casella di CyberDojo. Rispondiamo entro qualche
        giorno, dal lunedì al venerdì.
      </p>

      <div className="not-prose my-6">
        <ContactForm />
      </div>

      <h2>2. Se preferisci scrivere</h2>
      <p>
        Il modulo è la via più semplice, perché non devi indovinare l&apos;indirizzo. Se vuoi scrivere
        direttamente, l&apos;indirizzo di contatto è quello indicato in fondo a questa pagina: le
        richieste sui dati personali, quelle sui minori e quelle relative a violazioni di sicurezza
        hanno la stessa posta.
      </p>

      <h2>3. Che cosa scrivere, in breve</h2>
      <ul>
        <li>
          <strong>Un bug:</strong> cosa hai fatto, cosa ti aspettavi, cosa è successo. Se puoi,
          scrivi la lezione o la pagina dove l&apos;hai visto. Uno screenshot aiuta più di un paragrafo.
        </li>
        <li>
          <strong>Una domanda sul contenuto:</strong> qualcosa non torna nel calendario, nel codice o
          nella spiegazione? Siamo felici che ci si faccia notare.
        </li>
        <li>
          <strong>Una richiesta sui tuoi dati:</strong> scrivi dall&apos;email con cui ti sei
          registrato. Se vuoi i dati o vuoi chiudere l&apos;account, puoi farlo anche da solo dal
          profilo, senza aspettare: è più veloce.
        </li>
        <li>
          <strong>Un problema di accessibilità:</strong> dicci cosa hai provato a fare e cosa non ha
          funzionato. Se hai usato lo screen reader, diccelo: aiuta a capire.
        </li>
        <li>
          <strong>Una violazione di sicurezza:</strong> scrivi subito, senza attendere. Non
          sfruttiamo mai i dati che ci invii e non chiediamo nulla in cambio.
        </li>
      </ul>

      <h2>4. Chi risponde</h2>
      <p>
        CyberDojo è un progetto di una sola persona: la stessa che ha scritto le lezioni legge le
        email. Se la risposta richiede tempo, te lo diciamo: preferiamo dirlo che sparire.
      </p>
    </LegalPage>
  );
}
