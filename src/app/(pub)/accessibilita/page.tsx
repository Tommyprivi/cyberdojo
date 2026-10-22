import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Dichiarazione di accessibilità",
  description:
    "CyberDojo vuole essere usabile da chiunque: come è costruito il sito e dove ci sono ancora ostacoli.",
};

export default function AccessibilitaPage() {
  return (
    <LegalPage
      title="Dichiarazione di accessibilità"
      updated="21 ottobre 2026"
      intro="Un sito didattico che esclude qualcuno esclude metà delle persone che potrebbero imparare. Ecco a che punto siamo."
    >
      <h2>1. Il riferimento</h2>
      <p>
        Questa dichiarazione descrive lo stato di accessibilità del sito rispetto alle{" "}
        <strong>WCAG 2.2, livello AA</strong> (Web Content Accessibility Guidelines), ai sensi del
        D.lgs. 13 maggio 2018, n. 287 e del D.M. 20 maggio 2022.
      </p>

      <h2>2. Lo stato di conformità</h2>
      <p>
        <strong>Conformità parziale.</strong> Il sito è costruito tenendo conto dei requisiti di
        accessibilità e gran parte dei contenuti è accessibile, ma non è ancora pienamente
        conforme. L&apos;obiettivo dichiarato è arrivare alla conformità completa.
      </p>

      <h2>3. Cosa facciamo per l&apos;accessibilità</h2>
      <ul>
        <li>
          <strong>Tastiera prima.</strong> Tutte le funzioni si usano senza mouse: sfogliare il
          percorso, rispondere alle verifiche, usare i laboratori, aprire il menu. L&apos;ordine di
          lettura segue quello visivo.
        </li>
        <li>
          <strong>Il focus si vede.</strong> Ogni elemento interattivo ha un contorno ben visibile,
          verificato anche in modalità scura.
        </li>
        <li>
          <strong>Contrasto misurato.</strong> Il sito ha una palette pensata per il contrasto: ogni
          coppia testo e sfondo viene controllata da uno script automatico che impedisce a una
          combinazione di scendere sotto il rapporto richiesto.
        </li>
        <li>
          <strong>Rispetto per &quot;riduci movimento&quot;.</strong> Se il sistema operativo chiede di
          ridurre le animazioni, le animazioni si fermano e il sito resta comunque comprensibile.
        </li>
        <li>
          <strong>Etichette dichiarative.</strong> Icone e controlli che da soli non si spiegano hanno
          un testo alternativo o un&apos;etichetta per chi usa uno screen reader.
        </li>
        <li>
          <strong>Struttura semantica.</strong> Titoli in ordine, liste vere, tabelle con intestazioni,
          moduli con etichette collegate ai campi e messaggi d&apos;errore annunciati.
        </li>
        <li>
          <strong>Lingua dichiarata.</strong> Ogni pagina è in italiano (<code>lang="it"</code>), anche
          quando contiene un video in inglese: in quel caso lo si dice.
        </li>
        <li>
          <strong>Testo selezionabile.</strong> Il contenuto delle lezioni è testo vero, non immagini:
          si può copiare, cercare, tradurre con lo strumento che preferisci.
        </li>
      </ul>

      <h2>4. Ostacoli noti</h2>
      <p>
        Lo stato di conformità è parziale per questi motivi, che stiamo correggendo:
      </p>
      <ul>
        <li>
          I video delle lezioni vengono da YouTube: il lettore è di YouTube e non è sottoposto al
          nosto controllo. Chi non può usare il video trova la stessa spiegazione scritta nella lezione.
        </li>
        <li>
          Alcuni esercizi di analisi dei log richiedono di leggere righe di testo fitte: l&apos;interfaccia
          consente lo zoom e lo scorrimento orizzontale, ma la lettura resta impegnativa.
        </li>
        <li>
          Il laboratorio Python e quello SQL caricano il proprio motore nel browser: la prima esecuzione
          può risultare lenta su connessioni lente o su dispositivi poco potenti.
        </li>
      </ul>
      <p>
        Se incontri un ostacolo che non è in questa lista, segnalacelo: lo aggiungiamo e lo sistemiamo.
      </p>

      <h2>5. Come segnalare un problema di accessibilità</h2>
      <p>
        Scrivi dalla pagina <a href="/contatti">Contatti</a> scegliendo &quot;Accessibilità&quot;. Ti
        rispondiamo entro trenta giorni. Le segnalazioni anonime non ci permettono di chiederti
        chiarimenti, quindi un&apos;email qualsiasi va benissimo: non serve il tuo nome.
      </p>

      <h2>6. Contenuti di terze parti</h2>
      <p>
        Le pagine possono includere contenuti di terze parti (i video delle lezioni). Per questi
        contenuti l&apos;accessibilità dipende dal servizio esterno: lo segnaliamo qui perché è un
        punto che non controlliamo.
      </p>
    </LegalPage>
  );
}
