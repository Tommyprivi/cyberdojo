import { getCourseById, type CourseId } from "@/lib/content/courses";

/** Percorso di studio consigliato e consigli su come seguire i corsi. Solo calcoli: nessun dato personale esce da qui. */

export type PlanLesson = { id: string; course: string; module: number; minutes: number };
export type PlanInput = { goal: string | null; dailyMinutes: number | null };
export type TipsInput = PlanInput & { ageBand: string | null };

type StageDef = { course: CourseId; modules: number[]; why: string };

const BASICS: StageDef = { course: "F", modules: [1, 2, 3, 4, 5], why: "Computer, Linux e reti: senza queste basi il resto non si capisce." };
const NETWORKS: StageDef = { course: "F", modules: [6, 7, 8], why: "Reti a fondo: è lì che si vedono gli attacchi e le difese." };

const PLANS: Record<string, StageDef[]> = {
  "lavoro-soc": [
    BASICS,
    NETWORKS,
    { course: "C", modules: [1, 2, 3, 4], why: "I principi della sicurezza e la difesa di rete." },
    { course: "C", modules: [7, 9], why: "Il lavoro vero di un SOC: log, monitoraggio e risposta agli incidenti." },
    { course: "C", modules: [13, 19, 20], why: "Specializzazioni da analista: traffico di rete, regole di rilevamento, incident response." },
  ],
  pentester: [
    BASICS,
    NETWORKS,
    { course: "C", modules: [1, 2, 3, 4, 5, 6], why: "Per attaccare bene (in modo etico) devi sapere come si difende." },
    { course: "C", modules: [8, 21], why: "Attacco etico in laboratorio e metodologia del penetration test." },
  ],
  curiosita: [
    { course: "C", modules: [1, 2, 3], why: "Un assaggio: principi, crittografia e password." },
    { course: "F", modules: [1, 2, 3], why: "Come funziona davvero un computer e come si usa Linux." },
    { course: "C", modules: [4, 5], why: "Reti e web: dove si vede la sicurezza in azione." },
  ],
  "sicurezza-personale": [
    { course: "C", modules: [1, 2, 3], why: "Password, 2FA e crittografia: le difese che usi ogni giorno." },
    { course: "C", modules: [10], why: "Privacy e anonimato online." },
    { course: "F", modules: [1], why: "Come funziona un computer, per capire cosa proteggi." },
  ],
  scuola: [
    { course: "F", modules: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], why: "La base completa di informatica e reti, utile per l'esame." },
    { course: "C", modules: [1, 2, 3, 4], why: "I principi della sicurezza da portare all'esame." },
  ],
};
const GENERAL: StageDef[] = [BASICS, { course: "C", modules: [1, 2, 3, 4], why: "I principi della sicurezza." }, NETWORKS];

export type Stage = StageDef & { total: number; done: number; minutesLeft: number; daysLeft: number };
export type Plan = {
  stages: Stage[];
  /** Indice della prima tappa non finita, -1 se è tutto finito. */
  next: number;
  minutesPerDay: number;
  totalMinutesLeft: number;
  totalDaysLeft: number;
  totalWeeksLeft: number;
};

export function buildPlan(input: PlanInput, lessons: PlanLesson[], completed: Set<string>): Plan {
  const minutesPerDay = input.dailyMinutes && input.dailyMinutes > 0 ? input.dailyMinutes : 20;
  const defs = (input.goal && PLANS[input.goal]) || GENERAL;

  const stages: Stage[] = defs
    .map((def) => {
      const folder = getCourseById(def.course)?.folder;
      const inStage = lessons.filter((l) => l.course === folder && def.modules.includes(l.module));
      const left = inStage.filter((l) => !completed.has(l.id));
      const minutesLeft = left.reduce((sum, l) => sum + l.minutes, 0);
      return { ...def, total: inStage.length, done: inStage.length - left.length, minutesLeft, daysLeft: Math.ceil(minutesLeft / minutesPerDay) };
    })
    .filter((s) => s.total > 0);

  const totalMinutesLeft = stages.reduce((sum, s) => sum + s.minutesLeft, 0);
  const totalDaysLeft = Math.ceil(totalMinutesLeft / minutesPerDay);
  return {
    stages,
    next: stages.findIndex((s) => s.done < s.total),
    minutesPerDay,
    totalMinutesLeft,
    totalDaysLeft,
    totalWeeksLeft: Math.ceil(totalDaysLeft / 7),
  };
}

export type Tip = { title: string; text: string };

export function studyTips({ goal, dailyMinutes, ageBand }: TipsInput): Tip[] {
  const tips: Tip[] = [
    { title: "Una lezione alla volta, in ordine", text: "Le lezioni sono costruite una sull'altra: saltare avanti non conviene. Se una cosa non ti torna, ripassa la lezione prima invece di andare avanti." },
    { title: "Tutti i giorni, poco", text: "Meglio 15 minuti ogni giorno che due ore una volta a settimana: la serie giornaliera serve proprio a questo." },
    { title: "Rispondi senza guardare", text: "Nella verifica pratica prova a ragionare da solo prima di rileggere. Sbagliare e leggere la spiegazione insegna più che indovinare." },
    { title: "Chiedi al Sensei quando ti blocchi", text: "Se un errore non ti è chiaro, chiedilo al Sensei dal bottone nella lezione: spiega con altre parole, senza darti la risposta pronta." },
    { title: "Ripassa il giorno dopo", text: "Le schede di ripasso a fine lezione funzionano se le rileggi il giorno dopo, non subito." },
    { title: "Prova con le mani", text: "Terminale, reti e laboratorio si imparano facendo: ripeti i comandi della lezione da solo, anche cambiando qualcosa." },
  ];

  const m = dailyMinutes ?? 20;
  if (m <= 10) tips.unshift({ title: `Hai ${m} minuti al giorno`, text: "Dividi la lezione in due: leggi le prime schermate oggi e il resto domani. Tieni la verifica per quando hai qualche minuto in più." });
  else if (m <= 20) tips.unshift({ title: `Hai ${m} minuti al giorno`, text: "Una lezione al giorno è l'obiettivo giusto: dura 6-10 minuti e ti resta il tempo per il ripasso." });
  else if (m <= 30) tips.unshift({ title: `Hai ${m} minuti al giorno`, text: "Lezione, verifica pratica e un ripasso delle schede: ci stai dentro tranquillamente." });
  else tips.unshift({ title: `Hai ${m} minuti al giorno`, text: "Puoi fare due lezioni più il laboratorio. Ma fermati ogni tanto: dopo un'ora di fila la testa non registra più." });

  if (goal === "pentester" || goal === "lavoro-soc") {
    tips.push({ title: "Il laboratorio resta chiuso", text: "Esercitati solo su macchine tue o autorizzate per iscritto, in una rete isolata. Attaccare sistemi altrui è reato, anche per gioco." });
  }
  if (goal === "scuola") {
    tips.push({ title: "Studia per l'esame", text: "Tieni un quaderno con le regole e i comandi: le schede di ripasso e i riquadri «Regola» sono un buon punto di partenza." });
  }
  if (ageBand === "14-17") {
    tips.push({ title: "Il laboratorio, con un adulto al corrente", text: "Fai gli esercizi solo sul tuo computer o su macchine virtuali, mai su reti della scuola o di altri. Se hai dubbi, parlane con un genitore o un insegnante." });
  }
  return tips;
}
