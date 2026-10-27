import { int, mkFlag, pick, sample, shuffled } from "../gen";
import type { Challenge } from "../types";

/* Tutti i personaggi, i luoghi e i nomi sono INVENTATI. Nessuna persona reale. */
const PEOPLE = ["Giulia_Fantasia", "Marco_Inventato", "Sara_Immagina", "Luca_Finto", "Elena_Ipotetica"];
const PETS = ["briciola", "pistacchio", "romeo", "nuvola", "birba", "tigro", "zenzero", "macchia"];
const PLACES: [string, string][] = [
  ["Palestra Fenice", "palestra-fenice"],
  ["Bar Da Ugo", "bar-da-ugo"],
  ["Parco delle Querce", "parco-delle-querce"],
  ["Biblioteca Civica", "biblioteca-civica"],
  ["Piscina Aurora", "piscina-aurora"],
  ["Campo Sportivo Nord", "campo-sportivo-nord"],
];
const DAYS = ["martedi", "giovedi", "sabato"];

const posts = (title: string, who: string, items: { when: string; text: string }[]) => ({
  kind: "posts" as const,
  title,
  items: items.map((i) => ({ who, ...i })),
});

const NOTE = "Personaggio e luoghi di fantasia: nessuna persona reale.";

export const OSINT: Challenge[] = [
  {
    id: "osint-nome-animale",
    title: "La domanda di sicurezza",
    category: "osint",
    level: "facile",
    story: `Una persona inventata sta per perdere l'accesso al suo account: la domanda di recupero è «Come si chiama il tuo primo animale?». Guarda cosa ha pubblicato. ${NOTE}`,
    goal: "Trova il nome del suo animale nei post pubblici. Bandiera: CYBERDOJO{nome}.",
    hints: [
      "Leggi con attenzione tutti i post: ce n'è uno che parla di un animale di casa.",
      "Attenzione ai tranelli: un altro animale appartiene a un'amica e non conta.",
      "Il nome dell'animale di LEI (o LUI) è quello che compare con «il mio».",
    ],
    explanation: "Molte domande di sicurezza hanno risposte che si trovano sui social. Chi le legge può recuperare l'account al posto tuo.",
    defense: "Non usare risposte reali nelle domande di sicurezza (inventa una risposta e salvala nel gestore di password), attiva l'autenticazione a due fattori e riduci ciò che è pubblico.",
    build: (r) => {
      const who = pick(r, PEOPLE);
      const [pet, friendPet] = sample(r, PETS, 2);
      const items = shuffled(r, [
        { when: "lunedì", text: "Che noia la verifica di matematica! Per fortuna c'è il weekend." },
        { when: "mercoledì", text: `Oggi il mio ${pick(r, ["cane", "gatto"])} ${pet} ha combinato un disastro in salotto!` },
        { when: "venerdì", text: `Foto con la mia amica Anna e il suo ${friendPet}, troppo carino.` },
        { when: "domenica", text: "Giornata di pioggia, serie TV e pizza." },
      ]);
      return { flag: mkFlag(pet), artifact: posts("Post pubblici", who, items) };
    },
  },
  {
    id: "osint-password-prevedibile",
    title: "La password che si indovina",
    category: "osint",
    level: "medio",
    story: `Una persona inventata sceglie password così: nome dell'animale seguito dall'anno di nascita. Dai suoi post pubblici si può ricostruire la «password probabile». ${NOTE}`,
    goal: "Ricostruisci la password prevedibile: nome-animale + anno di nascita, senza spazi. Bandiera: CYBERDOJO{nomeanno}, per esempio CYBERDOJO{pippo1999}.",
    hints: [
      "Cerca due informazioni: il nome dell'animale (non quello di un'amica) e l'anno in cui è nata la persona.",
      "L'anno di nascita può essere scritto direttamente («sono del...») oppure comparire come classe o compleanno.",
      "Scrivi tutto attaccato e in minuscolo: nome + anno, per esempio birba2009.",
    ],
    explanation: "Chi usa dati personali come password le rende ricostruibili da chiunque legga i suoi social. Nessun programma serve: basta leggere.",
    defense: "Password lunghe e casuali (frasi lunghe o gestore di password), nessun dato personale dentro, autenticazione a due fattori. Limita cosa mostri in pubblico.",
    build: (r) => {
      const who = pick(r, PEOPLE);
      const [pet, friendPet] = sample(r, PETS, 2);
      const year = int(r, 2006, 2011);
      const items = shuffled(r, [
        { when: "lunedì", text: `Sì, sono del ${year}: sì, sembro più grande!` },
        { when: "martedì", text: `La mia ${pick(r, ["cagnolina", "gattina"])} ${pet} dorme sulla mia felpa.` },
        { when: "giovedì", text: `Passeggiata con il cane del cugino, ${friendPet}.` },
        { when: "sabato", text: `Compito di storia sul ${int(r, 1800, 1950)}. Che fatica.` },
      ]);
      return { flag: mkFlag(`${pet}${year}`), artifact: posts("Post pubblici", who, items) };
    },
  },
  {
    id: "osint-abitudini",
    title: "Dove va ogni settimana?",
    category: "osint",
    level: "difficile",
    story: `Dai post pubblici di una persona inventata si può capire dove va regolarmente, e in che giorno: un'informazione che a un malintenzionato direbbe quando la persona non è a casa. ${NOTE}`,
    goal: "Trova il luogo che compare più volte, nello stesso giorno della settimana. Bandiera: CYBERDOJO{luogo_giorno} (luogo con trattini, giorno senza accento), per esempio CYBERDOJO{nome-luogo_giorno}.",
    hints: [
      "Un luogo che compare una volta sola non è un'abitudine: cerca quello che si ripete.",
      "Confronta i giorni delle foto del luogo che si ripete: sono sempre lo stesso?",
      "Scrivi il luogo in minuscolo con i trattini (es. bar-da-ugo), un trattino basso e il giorno senza accento (martedi).",
    ],
    explanation: "Un singolo post è innocuo, ma più post messi insieme (luogo, giorno, orario) rivelano le abitudini di una persona: è il lavoro dell'OSINT, la ricerca da fonti aperte.",
    defense: "Pubblica le foto dopo essere tornato, disattiva la posizione nelle foto, controlla chi vede i tuoi post e non mostrare orari e abitudini fisse.",
    build: (r) => {
      const who = pick(r, PEOPLE);
      const [[name, slug], ...others] = shuffled(r, PLACES);
      const day = pick(r, DAYS);
      const dayLabel = day.endsWith("i") ? day.slice(0, -1) + "ì" : day;
      const items = shuffled(r, [
        { when: `${dayLabel} sera`, text: `Allenamento finito! [Foto - luogo: ${name}]` },
        { when: `${dayLabel} sera`, text: `Di nuovo qui, abitudini che non cambiano. [Foto - luogo: ${name}]` },
        { when: `${dayLabel} sera`, text: `Terza volta di fila! [Foto - luogo: ${name}]` },
        { when: pick(r, ["lunedì", "mercoledì", "venerdì"]) + " pomeriggio", text: `Una pausa. [Foto - luogo: ${others[0][0]}]` },
        { when: "domenica mattina", text: `Una passeggiata. [Foto - luogo: ${others[1][0]}]` },
      ]);
      return { flag: mkFlag(`${slug}_${day}`), artifact: posts("Post pubblici con luogo", who, items) };
    },
  },
];
