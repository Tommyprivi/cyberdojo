import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL_DOCS } from "@/lib/legal-docs";

export const metadata: Metadata = {
  title: "Termini e condizioni",
  description: "Le regole del dojo: cosa offre CyberDojo, cosa chiede in cambio e come si esce.",
};

export default function TerminiPage() {
  return (
    <LegalPage
      title={LEGAL_DOCS.termini.title}
      updated={LEGAL_DOCS.termini.updated}
      intro="CyberDojo è una scuola gratuita: non ci sono abbonamenti, non si compra niente, e puoi andartene quando vuoi. Queste sono le regole del gioco."
    >
      <h2>1. Il servizio</h2>
      <p>
        CyberDojo offre corsi gratuiti di cybersecurity, in italiano, organizzati in lezioni brevi con
        video, verifica pratica, ripasso automatico e un tutor che spiega gli errori. Il servizio è
        offerto <strong>gratuitamente</strong> e senza abbonamenti: se in futuro ci fossero
        acquisti, ci sarebbero solo per il servizio e mai per mettere al centro i tuoi dati.
      </p>
      <p>
        Le lezioni, le verifiche e i materiali scritti da CyberDojo sono protetti dalla licenza MIT
        (vedi <a href="/crediti">Crediti, fonti e licenze</a>): puoi studiarle, riutilizzarle e
        condividerne i link, ma non puoi rivenderle come se fossero tue.
      </p>

      <h2>2. L&apos;account</h2>
      <ul>
        <li>Per registrarti devi avere almeno 14 anni. Sotto i 14 anni non si crea un account: valgono le regole della pagina <a href="/minori">Per i minori e le famiglie</a>.</li>
        <li>Un account per persona. Non condividere le credenziali: chi entra con il tuo account sta facendo il percorso al posto tuo.</li>
        <li>I dati che inserisci devono essere veritieri: una fascia d&apos;età sbagliata fa saltare gli avvisi che servono a chi ha meno di 18 anni.</li>
        <li>Se sei minorenne, il consenso di un genitore o di chi ti tutela è necessario per iscriverti.</li>
        <li>Puoi chiudere l&apos;account quando vuoi, senza dover spiegare perché.</li>
      </ul>

      <h3>Il Social (facoltativo)</h3>
      <ul>
        <li>Classifica, amici, gruppi e sfide sono opzionali e spenti di default. Per usarli scegli un soprannome di fantasia: non usare il tuo nome vero né dati personali, e niente nomi offensivi, illeciti o che imitano altri o il dojo.</li>
        <li>Non esistono chat né messaggi: non cercare di scambiare contatti o contenuti con altri utenti attraverso il soprannome o il codice invito.</li>
        <li>I codici invito servono a invitare persone che conosci: non pubblicarli. Chi crea un gruppo deve avere almeno 18 anni e ne è responsabile.</li>
        <li>Possiamo rimuovere un soprannome o un gruppo, o limitare il Social, dopo una segnalazione. Puoi segnalare quando vuoi con il pulsante «Segnala».</li>
      </ul>

      <h2>3. La regola del dojo</h2>
      <p>
        Il dojo ha una regola sola, ed è scritta in ogni lezione:{" "}
        <strong>si prova solo ciò che è tuo</strong>. Chiude le porte a una serie di abusi:
      </p>
      <ul>
        <li>
          <strong>Non usare le tecniche di attacco su sistemi che non sono tuoi</strong>, anche se
          l&apos;obiettivo è solo studiare. Non è una questione di permesso implicito o di
          buone intenzioni: è illecito. Vedi la pagina <a href="/laboratorio">Disclaimer dei
          laboratori</a>.
        </li>
        <li>
          <strong>Non scansionare, non sfruttare e non alterare</strong> reti, server, account o
          dispositivi altrui, nemmeno per un minuto, nemmeno &quot;per vedere che cosa succede&quot;.
        </li>
        <li>
          <strong>Non usare CyberDojo</strong> per preparare attacchi, per recitare, per socializzare
          tecniche offensive verso terzi o per fare intake a servizi di hacking.
        </li>
        <li>
          <strong>Non caricare</strong> nel sito dati sensibili di altri: log aziendali, dati di
          clienti, credenziali, chiavi, elenchi di indirizzi email.
        </li>
        <li>
          <strong>Non automatizzare</strong> l&apos;uso del servizio in modo che danneggi il funzionamento
          per tutti (per esempio scaricando il sito a raffica o usando il tutor come macchina).
        </li>
      </ul>
      <p>
        Chi non rispetta queste regole può vedere il proprio account sospeso o chiuso, senza preavviso e
        senza rimborso (il servizio è gratuito).
      </p>

      <h2>4. I contenuti: tuoi e nostri</h2>
      <ul>
        <li>
          Le lezioni, gli schemi, le verifiche e il codice scritti da CyberDojo sono nostri e sono
          rilasciati con licenza MIT. Puoi usarli anche per insegnare o studiare, citando la fonte.
        </li>
        <li>
          I video sono di altri canali, che citiamo sempre in lezione (nome del canale e autore). Li
          incorporiamo su YouTube senza modificarli: la responsabilità dei video è di chi li ha
          pubblicati.
        </li>
        <li>
          Le tue <strong>note, i tuoi appunti e i tuoi progressi sono tuoi</strong>. Puoi esportarli
          in un file e cancellarli quando vuoi. Non li rivendiamo e non li usiamo per addestrare
          modelli.
        </li>
        <li>
          Il materiale che pubblichi sul sito (per esempio le risposte alle verifiche) resta tuo, ma
          con una licenza semplice: ci permetti di mostrarlo, con il tuo nome pubblico, come esempio
          per altri studenti. Puoi chiedere che venga ritirato in qualsiasi momento.
        </li>
      </ul>

      <h2>5. Il tutor automatico può sbagliare</h2>
      <p>
        Il tutor con intelligenza artificiale è uno strumento didattico: sbaglia, e sbaglia in modo
        convincente. <strong>Non è un professionista</strong> e non sostituisce il parere di un
        amministratore, di un consulente o di un commercialista. Per questioni di sicurezza,
        conformità o legge, verifica sempre con una fonte autorevole.
      </p>

      <h2>6. Modifiche al servizio</h2>
      <p>
        Il servizio può cambiare: possiamo aggiungere corsi, correggere lezioni o ritirare un
        contenuto. Se una modifica cambia in modo sostanziale il modo in cui il servizio funziona, te
        lo comunichiamo prima. Se il servizio non fosse più disponibile, l&apos;account verrà chiuso e
        avrai un tempo per esportare i tuoi dati.
      </p>

      <h2>7. Limitazione di responsabilità</h2>
      <p>
        Il servizio è fornito &quot;così com&apos;è&quot;. Facciamo il possibile perché sia utile e
        corretto, ma non possiamo garantire che sia sempre disponibile o che ogni contenuto sia
        privo di errori. La nostra responsabilità è limitata nei termini massimi consentiti dalla
        legge applicabile e, in ogni caso, non supera l&apos;importo che ci hai effettivamente
        pagato (che è zero).
      </p>

      <h2>8. Recesso e cancellazione</h2>
      <p>
        Puoi chiudere l&apos;account in qualsiasi momento dal profilo, senza motivazione. La
        cancellazione è definitiva: per sicurezza ti chiediamo di riscrivere la tua email. I dati
        vengono eliminati come descritto nella <a href="/privacy">informativa privacy</a>.
      </p>

      <h2>9. Legge applicabile</h2>
      <p>
        Il rapporto è regolato dalla legge italiana. Per i consumatori resta competente il foro del
        luogo di residenza o domicilio elettivo. Prima di rivolgerti al giudice è sempre bene provare
        a scriverci: risolviamo quasi tutto per le vie brevi.
      </p>

      <h2>10. Modifiche a queste condizioni</h2>
      <p>
        Se cambiano in modo rilevante, pubblicheremo la versione nuova con una data nuova e te lo
        comunicheremo dalla pagina del profilo o via email. L&apos;uso continuato del servizio dopo la
        pubblicazione vale come accettazione della versione aggiornata.
      </p>

      <h2>11. Contatti</h2>
      <p>
        Per qualsiasi dubbio su questi termini: <a href="/contatti">pagina Contatti</a>.
      </p>
    </LegalPage>
  );
}
