import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Crediti, fonti e licenze",
  description: "Chi ha scritto le lezioni, da dove arrivano i video, le fonti citate e le licenze usate.",
};

export default function CreditiPage() {
  return (
    <LegalPage
      title="Crediti, fonti e licenze"
      updated="21 ottobre 2026"
      intro="CyberDojo non copia il materiale di altri: se un concetto viene da una fonte, la fonte si dice."
    >
      <h2>1. Le lezioni</h2>
      <p>
        I testi delle lezioni, i casi pratici, gli schemi, le verifiche e il codice dei laboratori sono
        stati scritti per CyberDojo e sono rilasciati con licenza MIT. Il codice del sito èMIT
        License, Copyright 2026 CyberDojo.
      </p>

      <h2>2. I video</h2>
      <p>
        Ogni lezione può affiancare un video di un canale esterno. Chi ha prodotto il video è sempre
        indicato sotto il player (nome del canale e, dove disponibili, autore). I video sono
        incorporati da YouTube sul dominio senza cookie e si caricano solo se clicchi play: restano
        proprietà di chi li ha pubblicati. Se un video non è più disponibile, la lezione continua
        funzionare e il link &quot;Apri su YouTube&quot; spiega come arrivarci.
      </p>

      <h2>3. Le fonti tecniche citate</h2>
      <p>
        Quando una lezione parla di come si fa davvero nel mestiere, si appoggia alle fonti pubbliche
        di riferimento del settore. Le leggi citano i documenti originali, non riassunti:
      </p>
      <ul>
        <li>
          <strong>NIST</strong>, in particolare la serie SP 800-61 (gestione degli incidenti) e le altre
          pubblicazioni della serie SP 800.
        </li>
        <li>
          <strong>OWASP</strong>, per la sicurezza delle applicazioni web (OWASP Top 10, ASVS, cheat
          sheet).
        </li>
        <li>
          <strong>MITRE ATT&amp;CK</strong>, per la descrizione delle tecniche degli attaccanti.
        </li>
        <li>
          <strong>CIS Controls</strong>, per l&apos;elenco dei controlli di sicurezza.
        </li>
        <li>
          Le <strong>RFC</strong> e la documentazione dei protocolli, quando si parla di reti, DNS,
          TLS o HTTP.
        </li>
      </ul>

      <h2>4. Le fonti tipografiche</h2>
      <ul>
        <li>
          <strong>Shippori Mincho</strong> per i titoli: una calligrafia giapponese, sotto licenza SIL Open
          Font License 1.1.
        </li>
        <li>
          <strong>IBM Plex Sans</strong> per il testo: licenza SIL Open Font License 1.1.
        </li>
        <li>
          <strong>IBM Plex Mono</strong> per codice e didascalie: licenza SIL Open Font License 1.1.
        </li>
      </ul>

      <h2>5. Le immagini e le icone</h2>
      <p>
        Il sigillo, la mascotte e tutte le icone dell&apos;interfaccia sono disegnate per CyberDojo in
        formato SVG: nessuna immagine di terze parti nel sito. Le illustrazioni delle email sono
        originali.
      </p>

      <h2>6. Come è fatto il sito</h2>
      <p>
        Piattaforma e librerie principali: Next.js, React, Tailwind CSS, Drizzle ORM, PostgreSQL su
        Neon, Better Auth per le sessioni, Vercel per l&apos;hosting, Resend per la posta,
        ElevenLabs per la voce, PGlite e Pyodide per i laboratori nel browser.
      </p>

      <h2>7. I laboratori</h2>
      <p>
        I laboratori SQL e Python girano dentro il browser grazie a PostgreSQL in WebAssembly (PGlite) e
        a CPython in WebAssembly (Pyodide), entrambi software libero. I dati usati nei casi sono
        inventati.
      </p>

      <h2>8. Segnalare un errore</h2>
      <p>
        Se una lezione contiene un errore tecnico, una citazione imprecisa o un attacco che non
        funziona più, scrivici dalla pagina <a href="/contatti">Contatti</a>: la correggiamo e lo
        segnaliamo.
      </p>
    </LegalPage>
  );
}
