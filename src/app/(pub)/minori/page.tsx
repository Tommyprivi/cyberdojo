import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL_DOCS } from "@/lib/legal-docs";

export const metadata: Metadata = {
  title: "Per i minori e le famiglie",
  description:
    "Come funziona CyberDojo per chi ha fra 14 e 17 anni, cosa raccogliamo e come può fare un genitore.",
};

export default function MinoriPage() {
  return (
    <LegalPage
      title={LEGAL_DOCS.minori.title}
      updated={LEGAL_DOCS.minori.updated}
      intro="CyberDojo è aperto a chi ha almeno 14 anni. Se sei più giovane, niente account: è una regola fissa, non una discussione."
    >
      <h2>1. Chi può registrarsi</h2>
      <ul>
        <li>
          <strong>Con almeno 14 anni</strong> puoi creare un account da solo, dichiarando la tua fascia
          d&apos;età. È quello che chiede il regolamento: si tratta di un servizio pensato per la
          formazione, e a partire da quell&apos;età il consenso è sufficiente.
        </li>
        <li>
          <strong>Con meno di 14 anni</strong> non puoi creare un account. Il form di registrazione
          chiede la conferma dell&apos;età e si rifiuta di proseguire.
        </li>
        <li>
          <strong>Se hai fra 14 e 17 anni</strong>, è bene che un genitore o chi ti tutela sappia che
          stai usando il servizio: puoi dirgliene tu, oppure chiedere a chiunque l&apos;uso di un account
          gli permetta di vedere i progressi del tuo figlio. Nella pagina{" "}
          <a href="/minori#come-funziona-per-i-genitori">questo paragrafo</a> spieghiamo come fare.
        </li>
      </ul>

      <h2>2. Cosa raccogliamo da chi ha meno di 18 anni</h2>
      <ul>
        <li>
          <strong>La fascia d&apos;età, mai la data di nascita.</strong> Ti chiediamo &quot;quanti anni
          hai&quot; come fascia (14–17, 18–24, e così via) e lo teniamo così com&apos;è: nessuna data,
          nessun anno di nascita, nessun documento.
        </li>
        <li>Nome, email e password, come per chiunque altro.</li>
        <li>I progressi di studio, per far funzionare il percorso.</li>
      </ul>
      <p>
        <strong>Niente</strong> profilaggio, <strong>niente</strong> pubblicità, <strong>niente</strong> acquisti
        in-app, <strong>niente</strong> chat (né con adulti né con altri minori). Nessun dato viene venduto o ceduto.
      </p>

      <h3>Il Social, per chi ha 14-17 anni</h3>
      <p>
        Classifica, amici, gruppi e sfide sono <strong>facoltativi e spenti di default</strong>. Per i
        minori valgono regole in più:
      </p>
      <ul>
        <li>Niente chat, niente messaggi privati, niente foto, niente testo libero visibile ad altri, niente ricerca di utenti, niente nomi reali: ci si riconosce solo con un soprannome e un avatar scelto da un elenco.</li>
        <li>I minori vedono e sono visti <strong>solo da altri minori</strong>: classifica e amicizie sono separate dagli adulti.</li>
        <li>Si diventa amici solo con un codice invito che ci si scambia fuori dal sito, e serve l&apos;accettazione di entrambi.</li>
        <li>I minori non possono creare gruppi: entrano solo con un codice, in gruppi creati da un adulto responsabile (un insegnante, un genitore). Il gruppo dice sempre che è visibile ai membri.</li>
        <li>Ogni soprannome e ogni gruppo ha il pulsante «Segnala», che blocca subito per chi segnala.</li>
        <li>Tutto si spegne con un tocco, e cancellando l&apos;account sparisce ogni dato del Social.</li>
      </ul>

      <h2>3. Come funziona per i genitori</h2>
      <div id="come-funziona-per-i-genitori" />
      <p>
        CyberDojo è un servizio individuale: l&apos;account è di chi lo usa. Ecco cosa possono fare un
        genitore o chi tutela un minore:
      </p>
      <ul>
        <li>
          <strong>Chiedere che l&apos;account venga chiuso</strong> e che i dati vengano cancellati:
          scrivici dalla pagina <a href="/contatti">Contatti</a> indicando l&apos;email dell&apos;account. La
          cancellazione è immediata e definitiva.
        </li>
        <li>
          <strong>Chiedere copia dei dati</strong> dell&apos;account del figlio: si può fare dalla pagina{" "}
          <a href="/contatti">Contatti</a>, indicando l&apos;email dell&apos;account.
        </li>
        <li>
          <strong>Guardare i progressi</strong>: se tuo figlio ti ha dato accesso al suo account (condividendo
          le credenziali o l&apos;accesso con Google sul suo profilo), puoi vedere dove è arrivato. Chi
          condivide le credenziali può però anche leggere i messaggi della chat: è il caso di valutare
          prima di farlo.
        </li>
      </ul>
      <p>
        Se ritieni che un contenuto non sia adatto a un minore, segnalacelo: lo rimuoviamo e lo
        revisioniamo.
      </p>

      <h2>4. Sicurezza e benessere</h2>
      <ul>
        <li>
          Il servizio è didattico e difensivo: si studia come si difende un&apos;azienda, non come si attacca
          qualcuno. La regola del dojo vale per tutti, minori compresi.
        </li>
        <li>
          Nei laboratori si pratica su macchine virtuali isolate, dentro il browser. Nessuno dei
          laboratori tocca una rete esterna. Vedi la pagina <a href="/laboratorio">Disclaimer dei
          laboratori</a>.
        </li>
        <li>Se trovi un contenuto che ti mette in difficoltà, parla con un adulto di cui ti fidi.</li>
      </ul>

      <h2>5. Contatti</h2>
      <p>
        Per qualsiasi questione su minori, dati e cancellazioni: <a href="/contatti">pagina Contatti</a>.
      </p>
    </LegalPage>
  );
}
