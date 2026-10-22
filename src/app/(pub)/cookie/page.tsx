import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL_DOCS } from "@/lib/legal-docs";

export const metadata: Metadata = {
  title: "Cookie policy",
  description:
    "I cookie di CyberDojo sono pochi: uno serve a tenerti collegato, nessuno ti traccia. Ecco l'elenco.",
};

export default function CookiePage() {
  return (
    <LegalPage
      title={LEGAL_DOCS.cookie.title}
      updated={LEGAL_DOCS.cookie.updated}
      intro="Niente banner pieni di scareggiatori: qui ci sono due cookie tecnici e nient&apos;altro. Nessuna pubblicità, nessun tracciamento."
    >
      <h2>1. Che cosa sono i cookie</h2>
      <p>
        Sono piccoli file che il sito salva nel tuo browser. Servono a ricordare qualcosa tra una pagina e
        l&apos;altra: per esempio che sei già collegato. Alcuni cookie sono &quot;tecnici&quot; e servono al
        funzionamento del sito, altri possono essere usati per profilare la tua navigazione. Da noi ci
        sono solo i primi.
      </p>

      <h2>2. I cookie che usiamo</h2>
      <dl>
        <dt>
          <code>better-auth.session_token</code> (e la sua variante con prefisso <code>__Secure-</code>)
        </dt>
        <dd>
          Cookie tecnico, <strong>necessario</strong>. Tiene traccia della sessione: senza di esso, a ogni
          pagina ti verrebbe chiesto di accedere di nuovo. Viene cancellato quando chiudi il browser o
          quando la sessione scade. Non contiene dati personali leggibili da script, ma è comunque
          collegato al tuo account.
        </dd>
      </dl>
      <p>
        Non usiamo cookie di profilazione, pubblicitari, di social network, di statistica o di
        tracciamento tra siti. Non usiamo strumenti come Google Analytics o Matomo, e non condividiamo
        la tua navigazione con inserzionisti.
      </p>

      <h2>3. Preferenze salvate nel browser (non sono cookie)</h2>
      <p>
        Alcune impostazioni vivono nel <code>localStorage</code> del tuo browser: il tema chiaro o scuro,
        la modalità del laboratorio, il testo che hai scritto nei laboratori SQL e Python e la scelta che
        hai fatto nel banner sui cookie. Sono dati del tuo computer: non arrivano a noi e non vengono
        inviati da nessuna parte. Puoi cancellarli in qualsiasi momento svuotando i dati del sito nelle
        impostazioni del browser.
      </p>

      <h2>4. I video delle lezioni</h2>
      <p>
        Le lezioni citano un video di un canale esterno, spesso su YouTube. Il video <strong>non</strong> si
        carica finché non clicchi play: prima di quel momento non parte nessuna richiesta verso YouTube e
        il sito non riceve alcuna informazione su di te da quella parte.
      </p>
      <p>
        Se nel banner scegli di accettare i contenuti di terze parti, il video viene caricato dal dominio
        <code>youtube-nocookie.com</code>: anche in questo caso YouTube non riceve il tuo indirizzo email
        né il contenuto dei cookie di CyberDojo, ma applica comunque la sua propria cookie policy. Se
        invece scegli di restare con i soli cookie necessari, il video non si carica nella pagina: trovi
        comunque il link per aprirlo direttamente su YouTube.
      </p>

      <h2>5. Come cambiare idea</h2>
      <p>
        Puoi cambiare scelta in qualsiasi momento dal link <strong>&quot;Preferenze cookie&quot;</strong>{" "}
        nel piè di pagina del sito: si riapre il banner e la scelta viene aggiornata subito. Puoi
        cancellare i cookie e i dati locali dalle impostazioni del tuo browser.
      </p>

      <h2>6. Contatti</h2>
      <p>
        Domande sui cookie: <a href="/contatti">pagina Contatti</a>. Per la normativa di riferimento si
        vedano le linee guida del Garante su{" "}
        <a href="https://www.garanteprivacy.it" rel="noopener noreferrer" target="_blank">
          garanteprivacy.it
        </a>
        .
      </p>
    </LegalPage>
  );
}
