import { classifyAddress, describeNetwork, formatIpv4, parseIpv4 } from "../../netcalc";
import { ipIs, ipNudge, type Question, type Scenario } from "../engine";

/**
 * Missione 1 del calcolatore: «La .66, sul campo». Continua il caso del modulo F5.
 * Le risposte giuste sono calcolate con le stesse funzioni dello strumento: il testo non può
 * contraddire il calcolatore (lo garantisce engine.test.ts).
 */

const A = parseIpv4("192.168.1.66")!;
const B = parseIpv4("172.40.12.9")!;

const DENTRO = "Da dentro la rete (indirizzo privato)";
const FUORI = "Da Internet (indirizzo pubblico)";
const SPECIALE = "Da nessuna parte: è un indirizzo speciale";

const origin = (ip: typeof A) => {
  const k = classifyAddress(ip).scope;
  return k === "privato" ? DENTRO : k === "pubblico" ? FUORI : SPECIALE;
};

const originQuestion = (ip: typeof A, whyWrong: string): Question => ({
  type: "choice",
  prompt: `Il traffico che ha come sorgente ${formatIpv4(ip)} arriva…`,
  options: [DENTRO, FUORI, SPECIALE],
  correct: origin(ip),
  whyWrong,
});

const net24 = describeNetwork(A, 24);

export const calcolatore66: Scenario = {
  id: "calcolatore-66",
  title: "La .66, sul campo",
  tool: "calcolatore",
  intro:
    "Hai due indirizzi del caso delle 03:12: la postazione .66 e l'indirizzo del secondo allarme. Con il calcolatore fai quello che farebbe un analista: scomponi l'indirizzo e leggi cosa significa davvero.",
  goal:
    "Missione: stabilisci se 192.168.1.66 e 172.40.12.9 arrivano da dentro o da fuori, e quanti dispositivi può contenere la rete 192.168.1.0/24. Usa il calcolatore, poi consegna il rapporto.",
  steps: [
    {
      id: "inserisci-66",
      title: "Inserisci l'indirizzo della postazione",
      instruction: "Scrivi 192.168.1.66 nel campo «Indirizzo IPv4» del calcolatore.",
      why: "Il calcolatore lavora su un indirizzo alla volta: lo scompone in bit e ti dice che tipo è. È lo stesso lavoro che facevi a mano nelle lezioni, ma in un secondo.",
      hint: "Il campo è in alto, nel calcolatore. Scrivi i quattro numeri separati da punti: 192.168.1.66.",
      remember: "Un indirizzo IPv4 sono 32 bit: quattro ottetti da 8 bit.",
      action: ipIs("192.168.1.66"),
      nudge: ipNudge("192.168.1.66"),
      question: {
        type: "choice",
        prompt: "Leggi la riga «Binario»: com'è scritto l'ultimo ottetto, quello del .66?",
        options: ["01000010", "01000100", "00100010", "01000011"],
        correct: describeNetwork(A, 24).bits[3],
        whyWrong: "Guarda l'ultimo gruppo di 8 bit nella riga «Binario». Controlla con le monete: 64 + 2 = 66.",
      },
    },
    {
      id: "tipo-66",
      title: "Che tipo di indirizzo è?",
      instruction: "Guarda il riquadro «Tipo» e stabilisci da dove arriva il traffico di questa postazione.",
      why: "In un registro, sapere se una sorgente è privata o pubblica ti dice subito se il traffico nasce dentro l'azienda o arriva da fuori.",
      hint: "Il tipo compare sotto i numeri, con una spiegazione. Cerca la parola «Privato» o «Pubblico».",
      remember: "192.168.x.x è sempre una rete privata: il traffico nasce dentro.",
      action: ipIs("192.168.1.66"),
      question: originQuestion(A, "Rileggi il riquadro «Tipo»: dice «Privato». Una sorgente privata nasce dentro la rete."),
    },
    {
      id: "secondo-allarme",
      title: "Il secondo allarme",
      instruction: "Cambia l'indirizzo in 172.40.12.9, quello dell'allarme delle 04:40, e leggi il tipo.",
      why: "Il 172 inganna: il blocco privato è solo 172.16–172.31. Il calcolatore applica la regola per te e non si fa ingannare dal primo numero.",
      hint: "Cancella il vecchio indirizzo e scrivi 172.40.12.9. Poi guarda il riquadro «Tipo».",
      remember: "Il 172 è privato solo con il secondo numero da 16 a 31: 172.40 è pubblico.",
      action: ipIs("172.40.12.9"),
      nudge: ipNudge("172.40.12.9"),
      question: originQuestion(B, "Il riquadro «Tipo» dice «Pubblico»: 172.40 è fuori dal blocco privato 172.16–172.31."),
    },
    {
      id: "rete-24",
      title: "Quanti dispositivi in una rete /24?",
      instruction: "Torna a 192.168.1.66 e porta il prefisso a 24. Poi leggi quanti dispositivi può contenere la rete.",
      why: "Il prefisso dice quanti bit sono della rete e quanti dei dispositivi: più bit ai dispositivi, più dispositivi. Ti servirà nel modulo sulle subnet.",
      hint: "Riscrivi 192.168.1.66 e sposta il cursore «Prefisso» su 24. La risposta è nella riga «Dispositivi».",
      remember: "In una rete /24 ci sono 254 indirizzi per i dispositivi.",
      action: (s) => ipIs("192.168.1.66")(s) && s.prefix === 24,
      nudge: (s) =>
        ipIs("192.168.1.66")(s)
          ? s.prefix === 24 ? null : `Il prefisso ora è ${s.prefix}: portalo a 24.`
          : "Prima rimetti l'indirizzo 192.168.1.66.",
      question: {
        type: "number",
        prompt: "Quanti dispositivi può contenere la rete?",
        correct: net24.hosts,
        whyWrong: "Con /24 restano 8 bit per i dispositivi: 2⁸ = 256 indirizzi. Meno l'indirizzo di rete e il broadcast, fanno 254.",
      },
    },
    {
      id: "primo-ultimo",
      title: "Chi non può avere un computer?",
      instruction: "Leggi le righe «Rete», «Primo dispositivo», «Ultimo dispositivo» e «Broadcast». Quale di questi indirizzi non si può assegnare a un computer?",
      why: "Il primo indirizzo identifica la rete stessa e l'ultimo serve a parlare a tutti insieme (broadcast). Se un amministratore li assegna a un computer, la rete si comporta male.",
      hint: "Confronta ogni indirizzo con la riga «Rete»: uno coincide.",
      remember: "Il primo indirizzo è la rete e l'ultimo è il broadcast: non si assegnano ai computer.",
      action: (s) => ipIs("192.168.1.66")(s) && s.prefix === 24,
      question: {
        type: "choice",
        prompt: "Quale di questi indirizzi non si può assegnare a un computer della rete?",
        options: [formatIpv4(net24.network), formatIpv4(net24.firstHost), "192.168.1.100", formatIpv4(net24.lastHost)],
        correct: formatIpv4(net24.network),
        whyWrong: "192.168.1.0 è l'indirizzo della rete stessa (riga «Rete»): non è di nessun computer. Gli altri tre sì.",
      },
    },
  ],
  report: [
    { id: "r1", ...originQuestion(A, "") },
    { id: "r2", ...originQuestion(B, "") },
    { id: "r3", type: "number", prompt: "Quanti dispositivi può contenere la rete 192.168.1.0/24?", correct: net24.hosts, whyWrong: "" },
  ],
  closing:
    "Caso chiuso: la postazione .66 è interna, il 172.40.12.9 viene da Internet e sai leggere una rete /24. Nel modulo sulle subnet rifarai questi calcoli a mano, per capire perché funzionano.",
};

