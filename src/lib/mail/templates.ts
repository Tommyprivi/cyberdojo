import { firstName } from "../display-name";
import { siteUrl } from "../site-url";
import { renderHtml, renderText, type EmailContent } from "./layout";

export type Mail = { subject: string; html: string; text: string };

const build = (c: EmailContent): Mail => ({ subject: c.subject, html: renderHtml(c), text: renderText(c) });

/** Le illustrazioni stanno in public/email e si caricano dall'indirizzo pubblico del sito. */
const banner = (name: "intestazione" | "accesso" | "conferma" | "benvenuto" | "promemoria") => `${siteUrl()}/email/${name}.jpg`;

const SERVICE_FOOTER = [{ text: "Questa è un'email di servizio di CyberDojo, la scuola gratuita di cybersecurity in italiano." }];

/** Link di accesso: la prima email che molti utenti vedono, quindi la più sobria possibile. */
export function magicLinkEmail({ url }: { url: string }): Mail {
  return build({
    subject: "Il tuo link di accesso a CyberDojo",
    preheader: "Apri il link per entrare. Vale pochi minuti e una volta sola.",
    banner: banner("accesso"),
    title: "Entra nel dojo",
    blocks: [
      { type: "p", text: "Hai chiesto di accedere a CyberDojo. Usa il pulsante qui sotto: il link vale pochi minuti e una volta sola." },
      { type: "button", label: "Entra in CyberDojo", url },
      { type: "note", text: "Non sei stato tu? Ignora questa email: senza il link nessuno può entrare nel tuo account." },
    ],
    footer: SERVICE_FOOTER,
  });
}

/** Benvenuto: una sola cosa da fare, aprire il primo caso. */
export function welcomeEmail({ name, email }: { name: string | null; email: string }): Mail {
  const first = firstName({ name, email });
  const base = siteUrl();
  return build({
    subject: `Benvenuto nel dojo, ${first}`,
    preheader: "Il tuo account è pronto. Il primo caso ti aspetta: sono sette minuti.",
    banner: banner("benvenuto"),
    title: `Benvenuto, ${first}.`,
    blocks: [
      { type: "p", text: "Il tuo account è pronto. Qui si impara la cybersecurity risolvendo casi veri, otto minuti alla volta, e ogni lezione finisce con una prova pratica." },
      { type: "p", text: "Il primo caso si chiama «Il turno di notte»: leggerai la tua prima riga di log. Non serve sapere niente prima." },
      { type: "button", label: "Apri il primo caso", url: `${base}/percorso` },
      { type: "note", text: "I tuoi dati sono tuoi: dal profilo puoi scaricarli o cancellare l'account quando vuoi." },
    ],
    footer: [...SERVICE_FOOTER, { text: "Vuoi un promemoria per studiare con regolarità? Puoi attivarlo, solo se lo vuoi, dal tuo profilo:", link: { label: "apri il profilo", url: `${base}/profilo` } }],
  });
}

/** Promemoria di studio: parte solo se l'utente lo ha chiesto, e ogni email porta il modo di disattivarlo. */
export function reminderEmail({
  name,
  email,
  streak,
  nextLessonTitle,
  unsubscribeUrl,
}: {
  name: string | null;
  email: string;
  streak: number;
  nextLessonTitle: string | null;
  unsubscribeUrl: string;
}): Mail {
  const first = firstName({ name, email });
  const base = siteUrl();
  const atRisk = streak > 0;
  const subject = atRisk ? `La tua serie di ${streak} ${streak === 1 ? "giorno" : "giorni"} ti aspetta` : "Il Sensei ti aspetta: un caso oggi?";

  const blocks: EmailContent["blocks"] = [
    {
      type: "p",
      text: atRisk
        ? `${first}, oggi non hai ancora superato nessuna verifica. Una lezione e la tua serie di ${streak} ${streak === 1 ? "giorno" : "giorni"} continua.`
        : `${first}, oggi non hai ancora studiato. Basta una lezione da otto minuti per ricominciare.`,
    },
  ];
  if (nextLessonTitle) blocks.push({ type: "p", text: `Il prossimo caso: «${nextLessonTitle}».` });
  blocks.push({ type: "button", label: nextLessonTitle ? "Apri il caso" : "Vai al percorso", url: `${base}/percorso` });

  return build({
    subject,
    preheader: atRisk ? "Una verifica superata oggi e la serie continua." : "Otto minuti bastano per ricominciare.",
    banner: banner("promemoria"),
    title: atRisk ? "La tua serie è in gioco." : "Un caso oggi?",
    blocks,
    footer: [
      { text: "Ricevi questo promemoria perché lo hai attivato tu, all'orario che hai scelto." },
      { text: "Non lo vuoi più?", link: { label: "Disattiva i promemoria", url: unsubscribeUrl } },
    ],
  });
}

/** Conferma dell'indirizzo: serve per i promemoria, così nessuno riceve messaggi per un indirizzo scritto male. */
export function verificationEmail({ name, email, url }: { name: string | null; email: string; url: string }): Mail {
  const first = firstName({ name, email });
  return build({
    subject: "Conferma il tuo indirizzo email",
    preheader: "Un clic per confermare che questa email è tua.",
    banner: banner("conferma"),
    title: "Conferma la tua email",
    blocks: [
      { type: "p", text: `Ciao ${first}, conferma che questo indirizzo è tuo. Serve per poterti mandare i promemoria di studio, se vorrai attivarli.` },
      { type: "button", label: "Conferma l'email", url },
      { type: "note", text: "Non hai creato tu un account su CyberDojo? Ignora questa email: senza il link non succede nulla." },
    ],
    footer: SERVICE_FOOTER,
  });
}

/** Recupero password: il link vale un'ora e una volta sola. */
export function passwordResetEmail({ name, email, url }: { name: string | null; email: string; url: string }): Mail {
  const first = firstName({ name, email });
  return build({
    subject: "Reimposta la tua password di CyberDojo",
    preheader: "Il link vale un'ora e una volta sola.",
    banner: banner("intestazione"),
    title: "Scegli una nuova password",
    blocks: [
      { type: "p", text: `Ciao ${first}, hai chiesto di reimpostare la password. Usa il pulsante qui sotto: il link vale un'ora e una volta sola.` },
      { type: "button", label: "Scegli la nuova password", url },
      { type: "note", text: "Non l'hai chiesto tu? Ignora questa email: la tua password non cambia finché non apri il link." },
    ],
    footer: SERVICE_FOOTER,
  });
}

/** Avviso di sicurezza: la verifica in due passaggi è stata attivata o disattivata. Serve a far accorgere chi non è stato lui. */
export function twoFactorChangedEmail({ name, email, enabled }: { name: string | null; email: string; enabled: boolean }): Mail {
  const first = firstName({ name, email });
  const base = siteUrl();
  return build({
    subject: enabled ? "Verifica in due passaggi attivata" : "Verifica in due passaggi disattivata",
    preheader: enabled ? "Da ora, per entrare serve anche il codice della tua app." : "Per entrare bastano di nuovo email e password.",
    banner: banner("intestazione"),
    title: enabled ? "Il tuo account è più protetto" : "Protezione in due passaggi disattivata",
    blocks: [
      {
        type: "p",
        text: enabled
          ? `Ciao ${first}, hai attivato la verifica in due passaggi. D'ora in poi, per accedere con email e password servirà anche il codice a 6 cifre della tua app di autenticazione.`
          : `Ciao ${first}, hai disattivato la verifica in due passaggi. Per accedere bastano di nuovo email e password.`,
      },
      { type: "button", label: enabled ? "Apri le impostazioni di sicurezza" : "Riattivala dal profilo", url: `${base}/profilo` },
      {
        type: "note",
        text: "Non sei stato tu? Cambia subito la password dalla pagina «Password dimenticata» e scrivici dal modulo di contatto del sito.",
      },
    ],
    footer: SERVICE_FOOTER,
  });
}

/** Messaggio arrivato dal modulo di contatto: bug, domande, richieste sui dati. */
export function contactEmail({
  kind,
  name,
  email,
  subject,
  message,
  where,
}: {
  kind: string;
  name: string | null;
  email: string;
  subject: string;
  message: string;
  where: string | null;
}): Mail {
  const blocks: EmailContent["blocks"] = [
    { type: "p", text: `Tipo di richiesta: ${kind}` },
    { type: "p", text: `Chi scrive: ${name || "nome non indicato"} <${email}>` },
    { type: "p", text: `Oggetto: ${subject}` },
    { type: "p", text: message },
  ];
  if (where) blocks.push({ type: "p", text: `Dove: ${where}` });
  blocks.push({ type: "note", text: "Rispondi a questa email per rispondere a chi ha scritto." });

  return build({
    subject: `[CyberDojo · ${kind}] ${subject}`,
    preheader: "Messaggio ricevuto dal modulo di contatto del sito.",
    banner: banner("intestazione"),
    title: subject,
    blocks,
    footer: [{ text: "Messaggio inviato dal modulo di contatto di CyberDojo. Non rispondere se non ti aspettavi questa email." }],
  });
}

