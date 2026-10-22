import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL_DOCS } from "@/lib/legal-docs";

export const metadata: Metadata = {
  title: "Informativa privacy",
  description:
    "Quali dati CyberDojo tratta, perché, con chi li condivide e come puoi chiederne la cancellazione.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title={LEGAL_DOCS.privacy.title}
      updated={LEGAL_DOCS.privacy.updated}
      intro="Questa informativa spiega, in chiaro, che cosa facciamo con i dati che ci dai. Se una frase non è chiara, scrivici: la riscriviamo."
    >
      <h2>1. Chi è il titolare del trattamento</h2>
      <p>
        Il titolare del trattamento è <strong>CyberDojo</strong>, il progetto che pubblica questo sito. Il
        nome del gestore, l&apos;indirizzo e l&apos;email di riferimento sono indicati nella pagina{" "}
        <a href="/contatti">Contatti</a> e valgono per ogni richiesta sui dati personali.
      </p>

      <h2>2. Che cosa facciamo con i tuoi dati</h2>
      <p>
        Trattiamo i dati che ci servono per farti usare il servizio, e nient&apos;altro. Ecco l&apos;elenco
        completo: se un dato non è in questa tabella, non lo raccogliamo.
      </p>
      <dl>
        <dt>Dati del tuo account</dt>
        <dd>
          Nome, indirizzo email, password (conservata solo come hash, mai in chiaro) e, se accedi con
          Google, l&apos;identificatore del tuo account Google. <strong>Base giuridica:</strong> esecuzione
          del contratto (art. 6.1.b GDPR).
        </dd>

        <dt>Dati del profilo</dt>
        <dd>
          Fascia d&apos;età, obiettivo di studio, minuti al giorno, obiettivo giornaliero, fuso orario e
          lingua. <strong>Base giuridica:</strong> esecuzione del contratto: servono a personalizzare il
          percorso. <strong>Non</strong> chiediamo la data di nascita e non la ricaviamo.
        </dd>

        <dt>Dati di accesso</dt>
        <dd>
          Indirizzo IP e tipo di browser, conservati per proteggere il servizio da abusi e per capire
          gli errori. <strong>Base giuridica:</strong> legittimo interesse alla sicurezza del servizio
          (art. 6.1.f GDPR). Restano per trenta giorni.
        </dd>

        <dt>Dati di studio</dt>
        <dd>
          Lezioni completate, tentativi e risultati delle verifiche, punti esperienza, serie giornaliera,
          ripasso programmato, note personali, esami sostenuti. <strong>Base giuridica:</strong> esecuzione
          del contratto: senza questi dati il percorso non funziona.
        </dd>

        <dt>Accettazioni dei documenti legali</dt>
        <dd>
          Quale documento hai accettato, in che versione e in che data. <strong>Base giuridica:</strong>{" "}
          obbligo di legge e legittimo interesse (art. 6.1.c e 6.1.f GDPR): serve a dimostrare che
          l&apos;informativa ti è stata mostrata.
        </dd>

        <dt>Promemoria di studio</dt>
        <dd>
          Se li attivi, ricevi un&apos;email all&apos;ora che scegli. <strong>Base giuridica:</strong>{" "}
          consenso (art. 6.1.a GDPR). Sono spenti di default e si disattivano con un link in fondo a ogni
          email.
        </dd>

        <dt>Messaggi al tutor con intelligenza artificiale</dt>
        <dd>
          Solo quando usi la chat: la domanda che scrivi e il contesto della lezione. <strong>Base
          giuridica:</strong> esecuzione del contratto (è la funzione che hai chiesto). <strong>Non
          scriviamo</strong> le conversazioni su un nostro database e <strong>non</strong> inviamo il tuo
          nome o la tua email al fornitore del modello. Vedi il punto 4.
        </dd>

        <dt>Email di servizio</dt>
        <dd>
          Link di accesso, conferma dell&apos;indirizzo, recupero password, benvenuto. Servono a far
          funzionare l&apos;account. <strong>Base giuridica:</strong> esecuzione del contratto.
        </dd>
      </dl>

      <h2>3. Cosa NON facciamo</h2>
      <ul>
        <li>Non vendiamo, non affittiamo e non cediamo i tuoi dati a nessuno.</li>
        <li>Non usiamo cookie di profilazione, pubblicitari o di tracciamento.</li>
        <li>Non facciamo profilaggio e non prendiamo decisioni automatizzate che producano effetti su di te.</li>
        <li>Non raccogliamo la data di nascita, il genere, l&apos;indirizzo di casa o il numero di telefono.</li>
        <li>Non facciamo nessuna analisi di comportamento con strumenti di terze parti.</li>
      </ul>

      <h2>4. L&apos;intelligenza artificiale, in dettaglio</h2>
      <p>
        Il tutor del Dojo è un modello linguistico ospitato da un fornitore esterno (oggi Google, in
        alternativa Groq). Per risponderti inviamo <strong>soltanto</strong> il testo che scrivi tu e
        qualche informazione sulla lezione che stai seguendo (titolo, testo, eventuale errore da
        spiegare). Non inviamo mai nome, email, note personali o progressi.
      </p>
      <p>
        Le risposte non vengono salvate sui nostri server: restano nella finestra della chat finché non
        chiudi la pagina. I fornitori del modello usano i contenuti ricevuti esclusivamente per erogare
        il servizio richiesto, secondo le loro condizioni d&apos;uso.
      </p>

      <h2>5. Con chi condividiamo i dati</h2>
      <p>
        Condividiamo il minimo indispensabile con i fornitori che rendono il servizio possibile. Ogni
        fornitore riceve solo ciò che gli serve per la sua parte.
      </p>
      <ul>
        <li>
          <strong>Neon</strong> (database PostgreSQL): conserva account, profilo, progressi e consensi.
        </li>
        <li>
          <strong>Vercel</strong> (ospite e motore del sito): traffico e log tecnici.
        </li>
        <li>
          <strong>Better Auth</strong> (gestione delle sessioni): cookie di sessione e credenziali
          cifrate.
        </li>
        <li>
          <strong>Resend</strong> (invio delle email): le email di servizio e i promemoria.
        </li>
        <li>
          <strong>Google</strong> (accesso con Google e modello del tutor): dati del profilo Google
          autorizzati e i messaggi della chat.
        </li>
        <li>
          <strong>Groq</strong> (modello alternativo del tutor): stessi dati del tutor, se è il modello
          attivo.
        </li>
        <li>
          <strong>ElevenLabs</strong> (lettura delle lezioni): il testo della lezione da trasformare in
          audio, senza dati del tuo account.
        </li>
        <li>
          <strong>Cloudflare R2</strong> (immagazzinamento dei file audio): file audio e immagini.
        </li>
        <li>
          <strong>YouTube</strong> (video delle lezioni): solo se clicchi play: vedi la{" "}
          <a href="/cookie">cookie policy</a>.
        </li>
      </ul>
      <p>
        Alcuni di questi fornitori hanno server fuori dallo Spazio Economico Europeo. Per questi
        trasferimenti vengono usate le Clausole Contrattuali Standard della Commissione Europea e, dove
        possibile, decisioni di adeguatezza. Puoi chiedere informazioni più precise sul trasferimento
        applicato a un determinato fornitore scrivendoci.
      </p>

      <h2>6. Quanto tempo li teniamo</h2>
      <ul>
        <li>Dati dell&apos;account e di studio: finché l&apos;account esiste. Li cancelliamo entro 30 giorni dalla richiesta di cancellazione.</li>
        <li>Dati di accesso (IP e browser): 30 giorni.</li>
        <li>Token di verifica e di recupero password: pochi minuti o poche ore, dopodiché scadono da soli.</li>
        <li>Accettazioni dei documenti: finché l&apos;account esiste e per i tempi che la legge ci chiede di dimostrare l&apos;accordo.</li>
        <li>Email inviate: restano nel provider di posta per il tempo previsto dalla loro policy, con le protezioni del caso.</li>
      </ul>

      <h2>7. Come proteggiamo i dati</h2>
      <ul>
        <li>Le password sono conservate come hash con salt: nessuno, nemmeno noi, può leggerle.</li>
        <li>Il traffico è protetto da HTTPS.</li>
        <li>Ogni tabella con dati personali ha una barriera a livello di riga: l&apos;applicazione vede solo i dati dell&apos;utente su cui sta lavorando.</li>
        <li>Gli accessi al database usano un ruolo separato, con meno poteri del proprietario.</li>
        <li>Le esportazioni dei dati richiedono la sessione attiva.</li>
      </ul>

      <h2>8. I tuoi diritti</h2>
      <p>
        Puoi chiedere in ogni momento, senza dirlo prima e senza spiegazioni:
      </p>
      <ul>
        <li>
          <strong>accesso</strong>: copiare tutti i tuoi dati (lo fai già dal profilo, con un pulsante);
        </li>
        <li>
          <strong>rettifica</strong>: correggere i dati sbagliati (lo fai già dal profilo);
        </li>
        <li>
          <strong>cancellazione</strong>: eliminare l&apos;account e tutto il suo contenuto (lo fai già dal
          profilo, e non serve alcuna richiesta);
        </li>
        <li>
          <strong>limitazione</strong> e <strong>portabilità</strong>: limitare l&apos;uso dei dati o
          riceverli in un formato leggibile da programmi;
        </li>
        <li>
          <strong>opposizione</strong>: opporti a un trattamento basato sul legittimo interesse;
        </li>
        <li>
          <strong>revoca del consenso</strong>: ritirare un consenso quando l&apos;hai dato (per i
          promemoria basta un link in fondo all&apos;email);
        </li>
      </ul>
      <p>
        Scrivi una richiesta dalla pagina <a href="/contatti">Contatti</a>: rispondiamo entro trenta
        giorni. Se ritieni che la risposta non sia soddisfacente, puoi presentare reclamo al{" "}
        <strong>Garante per la protezione dei dati personali</strong> (Piazza di Monte Citorio, 121,
        00186 Roma, <a href="https://www.garanteprivacy.it" rel="noopener noreferrer" target="_blank">
          garanteprivacy.it</a>) oppure al tuo Garante di residenza.
      </p>

      <h2>9. Minori</h2>
      <p>
        Il servizio è riservato a chi ha almeno 14 anni. Per chi ha fra 14 e 17 anni valgono le regole
        descritte nella pagina <a href="/minori">Per i minori e le famiglie</a>. I dati dei minori non
        vengono usati per profilaggio o pubblicità.
      </p>

      <h2>10. Modifiche</h2>
      <p>
        Se l&apos;informativa cambia, la versione nuova porta una data nuova e, se la modifica riguarda
        dati che richiedono il tuo consenso, te lo chiederemo di nuovo. Le versioni vecchie restano
        disponibili su richiesta.
      </p>

      <h2>11. Contatti</h2>
      <p>
        Per qualsiasi questione sui tuoi dati: <a href="/contatti">pagina Contatti</a>. Rispondiamo in
        italiano, entro trenta giorni.
      </p>
    </LegalPage>
  );
}
