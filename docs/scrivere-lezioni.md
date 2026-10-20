# Come si scrive una lezione di CyberDojo

Guida per chi scrive lezioni (persone o agenti). Modello da imitare: `content/fondamenta/f5/F.05.003.mdx`. Leggilo per intero prima di cominciare.

## Dove vanno i file

- Lezioni: `content/cybersecurity/c<N>/C.<NN>.<MMM>.mdx` (esempio: `content/cybersecurity/c2/C.02.003.mdx`). Il modulo nell'ID e nella cartella devono coincidere con `module:`.
- Domande della verifica: `src/lib/practice/banks-cyber/c<NN>.ts` (esempio `c02.ts`), un solo file per modulo, già creato e vuoto. Si scrive **solo** il proprio file.
- Corso `cybersecurity`, `course: cybersecurity`. Titoli e riassunti dei moduli sono in `src/lib/content/courses.ts`: rispettali.

## Frontmatter

```yaml
---
id: C.02.003
course: cybersecurity
module: 2
title: "Titolo breve e concreto"
belt: gialla            # bianca|gialla|arancione|verde|blu|marrone|nera (sale col modulo: C1-C2 bianca/gialla, C3-C4 gialla/arancione, C5-C6 arancione/verde, C7-C8 verde/blu, C9-C11 blu/marrone)
duration_min: 8         # 6-10
prerequisites: [C.02.002]   # la lezione precedente; la prima di un modulo ha come prerequisito l'ultima del modulo precedente (C.01.001 non ha prerequisiti: [])
objectives:
  - "Verbo all'infinito + cosa si sa fare alla fine (2-3 obiettivi)"
video:                   # SOLO se un video dei candidati è davvero pertinente (vedi sotto); altrimenti omettere il blocco E il tag <Video />
  provider: youtube
  id: "XXXXXXXXXXX"
  start: 0
  end: 540               # massimo 600 secondi di spezzone
  channel: "Nome canale"
  title: "Titolo del video"
  lang: it               # it | en
  reviewed: false
verification:
  type: generated-numeric
  generator: c02-hash    # l'id della banca in banks-cyber/c02.ts
  pass: "5/5"
  retries: 3
audio: true
status: draft
approved: false
human_reviewed: false
known_pitfalls:
  - "Errore tipico che gli studenti fanno su questo argomento (2-3)"
commands: []
---
```

Campi extra non sono ammessi (lo schema è `strict`). `status` resta **sempre** `draft`, `approved` e `human_reviewed` sempre `false`: la pubblicazione la decide il titolare.

## Struttura del corpo

Da **6 a 8 schermate** separate da una riga `{/* screen */}` (come in F.05.003). Ogni schermata è un blocco `<Scene title="...">…</Scene>` e contiene **almeno un** `<Say who="sensei">` oppure `<Say who="assistente">` (serve per audio e trascrizione). Schema consigliato:

1. **Il caso**: una situazione realistica in 2-4 righe (un log, un'email sospetta, un incidente). Chiude con la domanda che la lezione risolve.
2-4. **Spiegazione a piccoli passi**, un'idea per schermata, con analogie quotidiane. `<Callout kind="trucco|curiosita|attenzione|regola">` per i punti da ricordare.
5. **Tocca a te**: un `<Quiz question=... options={[...]} answer={0} explain="..." />` con la spiegazione dell'errore tipico, oppure un `<Guided steps={[...]} />` che mostra un ragionamento passo per passo. `<Log lines={[...]} />` per mostrare righe di log o di terminale.
6. **Verifica pratica**: `<Practice generator="c02-hash" pass="5/5" retries={3} />` (stesso generatore del frontmatter).
7. **Rapporto finale** (ultima schermata): `<Recap xp={20}>` con 3 punti elenco, poi `<Flashcards cards={[{ q: "...", a: "..." }, ...]} />` con 4 carte, poi un `<Say>` di chiusura che annuncia la lezione successiva.
Se c'è un video: `<Video />` dentro una schermata di spiegazione, introdotto da una riga tipo «Vuoi sentirlo spiegare da un'altra voce?».

Non usare `<Envelope />`, `<BitGrid>`, `<BitLab>` (servono solo per reti e binario).

## Stile (contano più del codice)

- Italiano semplice. Il lettore ha 14-18 anni o è un adulto che parte da zero: nessun gergo non spiegato; la prima volta che compare un termine tecnico lo si spiega in una riga.
- Il **Sensei** è severo ma caldo: frasi brevi, imperativi, nessun elogio gratuito. L'**Assistente** è un compagno più morbido che dà un indizio.
- Casi reali e plausibili (nomi fittizi, aziende fittizie). Niente paura gratuita, niente «hacker con il cappuccio».
- Ogni schermata si legge in meno di un minuto. Frasi corte. Un'idea per schermata.
- Accenti corretti (è, perché, più). Virgolette «così» per i titoli e le citazioni, apici normali per il codice.
- Le prove misurano **comprensione**, non memoria di sigle: preferisci scenari («cosa succede se…», «quale controllo avrebbe impedito questo?»).

## Le domande della verifica (banks-cyber/cNN.ts)

Una banca per lezione, chiave `"cNN-argomento"` (minuscolo, trattini, esempio `"c02-hash"`), **almeno 12 domande**. Formato:

```ts
import type { BankItem } from "../banks";

export const C02_ITEMS: Record<string, BankItem[]> = {
  "c02-hash": [
    { q: "Domanda completa e autonoma (più di 15 caratteri)?", ok: "Risposta giusta", no: ["Sbagliata plausibile", "Sbagliata plausibile", "Sbagliata plausibile"] },
    // no: 2 o 3 alternative sbagliate
  ],
};
```

Regole (controllate da test automatici):
- una sola risposta giusta; opzioni tutte diverse tra loro e non vuote;
- domande tutte diverse; le alternative sbagliate devono essere **plausibili** (gli errori che davvero si fanno), non scherzose;
- niente «tutte le precedenti» / «nessuna delle precedenti»;
- il test mescola le opzioni da solo: non mettere la risposta giusta sempre per prima;
- le domande devono avere senso **senza** vedere la lezione davanti, ma solo se si è seguita.

## Video

Il file `content/video-candidati.json` elenca i video già verificati (campo `modulo`: `C1`…`C11`, con `id`, `titolo`, `canale`, `durata`, `lang`, `verifica.stato: "ok"`). Usa **solo** video di quel file, solo dello stesso modulo, e solo se il tema del video coincide davvero con quello della lezione. Usa `start: 0` e `end` = durata del video in secondi (massimo 600; se è più lungo, `end: 600`). Se nessun candidato è pertinente, la lezione resta senza video (omettere `video:` e `<Video />`): il titolare li aggiungerà.

## Sicurezza e legge (obbligatorio)

- Nessun codice funzionante per attaccare sistemi reali, nessun malware, nessuna procedura passo-passo contro bersagli reali. Si spiegano **concetti, difese, rilevamento e ragionamento**; le tecniche offensive si descrivono solo a livello concettuale e sempre dentro un laboratorio isolato e di proprietà dello studente.
- Ogni lezione che parla di attacco richiama in una frase legge ed etica (in Italia, accesso abusivo a sistema informatico: art. 615-ter del codice penale) e il principio «si prova solo ciò che è tuo o per cui hai un permesso scritto».
- Niente istruzioni per aggirare protezioni di servizi altrui, niente furto di account, niente dati reali di persone reali.

## Controlli prima di consegnare

1. `pnpm lint:content` — controlla solo le righe che nominano i **tuoi** file (altri moduli sono scritti in parallelo da altri e possono essere incompleti).
2. `pnpm vitest run src/lib/practice/banks-cyber` — deve passare.
3. Rileggi ogni lezione: il caso iniziale e la verifica finale parlano dello stesso concetto? Le risposte giuste sono davvero giuste? Controlla i fatti tecnici (valori, nomi dei protocolli, definizioni): meglio una frase in meno che una frase sbagliata.

Scrivi i file con codifica UTF-8 (usa lo strumento Write, non redirezioni di shell).
