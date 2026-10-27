# Guida: scrivere le lezioni dei 10 nuovi corsi

Per chi scrive le lezioni (persone o agenti) **in parallelo**. Indice dei corsi e dei titoli: `docs/nuovi-corsi.md`. Modello da imitare: il modulo **W1** (`content/sviluppo-web/w1/W.01.001.mdx` ... `W.01.010.mdx`) con le domande in `src/lib/practice/banks-nuovi/w01.ts`. Leggi almeno W.01.003 e W.01.007 prima di cominciare. Lo stile generale è in `docs/scrivere-lezioni.md` e gli schemi in `docs/diagrammi-lezioni.md`.

**Un incarico = un modulo = 10 lezioni + il file delle domande.** Tocca **solo** i tuoi file.

## 1. I tuoi file

| Cosa | Dove |
|---|---|
| Lezioni | `content/<cartella>/<x><modulo>/X.MM.NNN.mdx`, es. `content/programmazione/p5/P.05.003.mdx` |
| Domande | `src/lib/practice/banks-nuovi/<x><MM>.ts`, es. `p05.ts` (esiste già, vuoto: lo riempi) |

Lettere e cartelle: W `sviluppo-web`, P `programmazione`, A `app-telefono`, I `intelligenza-artificiale`, B `database-grandi-dati`, L `cloud-devops`, R `reti-internet`, E `hacking-etico`, X `blockchain`, M `mondo-digitale`. Titoli, ordine e «Rimando» di ogni modulo sono in `docs/nuovi-corsi.md`: **usa esattamente quei 10 titoli**, nell'ordine dato (NNN = 001..010). Non cambiare `courses-new.ts` né il piano.

Non toccare altro: né `courses*.ts`, né `index.ts` delle banche, né altri moduli. Il file `.ts` delle domande è già registrato.

## 2. Frontmatter (campi strict: niente campi in più)

```yaml
---
id: W.01.003
course: sviluppo-web          # la cartella del corso
module: 1                     # numero del modulo (senza zero) = quello nell'ID e nella cartella
title: "Titolo preso dal piano"
belt: bianca                  # moduli 1-4 bianca, 5-8 gialla, 9-12 arancione, 13-16 verde, 17-20 blu
duration_min: 8               # 6-10 (lo schema accetta 3-15)
prerequisites: [W.01.002]     # vedi sotto
objectives:                   # 2-3, verbo all'infinito + cosa si sa fare
  - "Descrivere ..."
verification:
  type: generated-numeric
  generator: w01-richieste-risposte   # chiave della banca in banks-nuovi/w01.ts
  pass: "4/5"
  retries: 3
audio: true
status: draft                 # SEMPRE draft
approved: false               # SEMPRE false
human_reviewed: false         # SEMPRE false
known_pitfalls:               # 2-3 errori tipici degli studenti
  - "..."
commands: []
---
```

- **Prerequisiti:** la lezione precedente dello stesso modulo. La **prima** lezione di un modulo ha l'**ultima del modulo precedente** (`W.02.001` -> `[W.01.010]`). `X.01.001` ha `[]`. Mai prerequisiti in altri corsi, mai salti.
- **Video:** niente `video:` e niente `<Video />` (le lezioni restano `draft`; i video si aggiungono dopo, vedi `docs/scrivere-lezioni.md`).
- `generator` deve esistere in `banks-nuovi/<x><MM>.ts`, altrimenti il lint dà «generator sconosciuto». Chiave: `<x><MM>-<argomento>` minuscolo con trattini (es. `w01-url-indirizzi`), una per lezione, tutte diverse nel modulo.

## 3. Corpo: 6-8 schermate

Separate da una riga `{/* screen */}` (da sola). Ogni schermata è `<Scene title="...">...</Scene>` e contiene **almeno un** `<Say who="sensei">` o `<Say who="assistente">`. Schema usato in W1 (7 schermate):

1. **Il caso**: una situazione in 2-4 righe con un personaggio fittizio, che chiude con «La domanda del caso: **...**». Un `<Say who="sensei">`.
2-4. **Spiegazione**, un'idea per schermata. Usa `<Callout kind="regola|attenzione|trucco|curiosita|esempio">`, elenchi e blocchi di codice. Da 1 a 3 schemi per lezione (`<Flow>`, `<Layers>`, `<Compare>`), mai nell'ultima schermata né accanto a Quiz/Practice. Tono: Sensei secco ma caldo, Assistente morbido.
5. **Tocca a te**: un `<Quiz question options answer explain />` (4 opzioni, `answer` = indice da 0, tutte le opzioni diverse tra loro) e/o un `<Guided steps={[...]} />`. La `explain` spiega anche perché le altre sono sbagliate.
6. **Verifica pratica**: `<Practice generator="x01-argomento" pass="4/5" retries={3} />` con lo stesso generatore del frontmatter.
7. **Rapporto finale**: `<Recap xp={20}>` con 3-5 punti (l'ultimo chiude il caso), poi `<Flashcards cards={[{ q: "...", a: "..." }, ...]} />` con 4 carte, poi un `<Say>` che annuncia la lezione successiva (nell'ultima del modulo, il modulo successivo).

Altri componenti utili: `<Log lines={[...]} caption="..." />` per output, log e codice a righe; blocchi di codice con tre apici e il linguaggio (` ```html `, ` ```js `, ` ```python `, ` ```sql `, ` ```bash `) per il codice vero. Componenti interattivi (solo se servono): `<PythonTerminal>`, `<SqlPlayground>`, `<LinuxTerminal>` (vedi `docs/python-nel-browser.md`, `docs/sql-nel-browser.md`). Non usare `<Envelope />`, `<BitGrid>`, `<BitLab>`.

Icone ammesse in `icon:` degli schemi: user, users, laptop, phone, server, database, cloud, globe, wifi, mail, file, folder, lock, key, shield, eye, bug, fire, bell, clock, coin, chart, link, gear, search, warning, check, cross, bolt, skull, terminal, code, mask, hook, book. Un nome diverso blocca il controllo.

## 4. Errori comuni che rompono la compilazione MDX

- **Mai `<` o `{` nel testo normale.** Un tag HTML o una parentesi graffa scritti in una frase vengono letti come codice MDX e danno errore. Scrivili **sempre tra apici inversi** (`<p>`, `{ }`) o dentro un blocco di codice. Dentro le stringhe di `<Log lines={[...]}>`, `<Quiz>` e `<Flashcards>` vanno bene.
- **Virgolette dentro le stringhe JSX:** se la stringa è tra virgolette doppie, le virgolette interne vanno scritte `\"` (esempio `"<meta charset=\"UTF-8\">"`) oppure usa apici singoli dentro.
- Ogni schermata ha un solo `<Scene>` e il separatore `{/* screen */}` sta **tra** le schermate, su una riga sola.
- Le opzioni di un `<Quiz>` devono essere tutte diverse (sono usate come chiave).
- Codice di esempio sempre breve (al massimo 15-20 righe) e funzionante: provalo davvero.
- Accenti corretti (è, perché, più). Virgolette «così» per le citazioni nel testo.
- Scrivi i file in UTF-8 con lo strumento Write, non con redirezioni di shell.

## 5. Le domande (`banks-nuovi/<x><MM>.ts`)

```ts
import type { BankItem } from "../banks";

export const W01_ITEMS: Record<string, BankItem[]> = {
  "w01-url-indirizzi": [
    { q: "Domanda completa e autonoma (più di 15 caratteri)?", ok: "Risposta giusta", no: ["Sbagliata plausibile", "Sbagliata plausibile", "Sbagliata plausibile"] },
    // ...
  ],
};
```

- Tieni il nome dell'export già presente nel file (es. `W01_ITEMS`) e sostituisci solo l'oggetto vuoto. **Una banca per lezione**, **almeno 12 domande**, tutte diverse.
- Una sola risposta giusta; 2 o 3 alternative sbagliate **plausibili** (gli errori veri), tutte diverse e non vuote. Niente «tutte/nessuna le precedenti». Metti la risposta giusta a posizioni diverse? Non serve: le opzioni si mescolano da sole.
- Le domande devono avere senso senza la lezione davanti. Ogni risposta giusta deve essere **vera**: controlla i fatti (valori, nomi, definizioni, scorciatoie); per i calcoli rifai il conto a mano due volte. Se non sei sicuro, togli la domanda.
- Codice nelle domande: breve (massimo 4 righe), con apici inversi, mai blocchi markdown nelle opzioni.

## 6. Regole di contenuto (obbligatorie)

- Italiano semplice, lettori dai 14 anni, tutto gratuito (strumenti gratuiti o con piano gratuito; se qualcosa è a pagamento presso terzi, dillo senza consigliare di comprarlo). Il primo uso di ogni termine tecnico si spiega in una riga.
- **Niente consigli finanziari o legali**, niente link di affiliazione, niente dati personali reali. Fatti verificabili: meglio una frase in meno che una sbagliata. Se ti serve citare una norma, solo in sintesi e con il nome corretto.
- **Rimando, non ripetizione:** dove il piano indica un «Rimando» a un modulo esistente (F, C, D, T, H) o ad altro corso nuovo, non rifare quella lezione: scrivi solo il livello nuovo e rimanda con una frase.
- **Sicurezza offensiva (corsi E, A, R, X, L):** nessun malware, nessuna procedura passo-passo contro bersagli reali; si spiegano concetti, difese e rilevamento, e le prove pratiche solo in laboratorio proprio e isolato. Ogni lezione che parla di attacco ricorda in una frase la legge (in Italia l'accesso abusivo a sistema informatico è l'art. 615-ter del codice penale) e il principio «si prova solo ciò che è tuo o per cui hai un permesso scritto».
- Blockchain (X) e Hedge/Trading: solo tecnica e funzionamento, mai «conviene comprare».
- Niente comandi distruttivi negli esempi. Dati di esempio fittizi, piccoli, scritti nel testo.

## 6b. Casi e personaggi

Ogni corso ha un filo narrativo semplice (in W1: Lucia e la sua bottega di ceramiche). Scegli nomi e aziende fittizi, restando coerente dentro il modulo. Non usare marchi o persone reali in situazioni negative.

## 7. Controlli prima di consegnare

Dalla cartella del progetto:

```
npx tsx scripts/lint-content.ts W.01            # solo le tue lezioni (usa il prefisso del tuo modulo, es. P.05)
npx tsx scripts/check-lessons-compile.mts W.01  # compila ogni schermata come fa il sito e controlla le icone
npx vitest run src/lib/practice/banks-nuovi     # controlla le tue banche (>= 12 domande, opzioni distinte...)
npx tsc --noEmit                                # solo se hai toccato file .ts oltre alle domande
```

Tutti devono dare 0 problemi. Con il filtro, l'errore «prerequisito inesistente» sulla **prima** lezione del modulo è ignorato, perché il modulo precedente può non essere ancora scritto da un altro agente; tutto il resto deve essere pulito. Se il lint dice «verification.generator sconosciuto» manca la banca nel tuo file `.ts`.

Poi rileggi: il caso iniziale e la verifica parlano dello stesso concetto? Le risposte giuste sono davvero giuste? Il quiz della schermata 5 è giusto? Lo schema non dice niente che la lezione non dica?

Non lanciare `next build`, non fare commit, non toccare il database né i file di altri.

## 8. Dopo la consegna (lo fa il coordinatore)

Prima di pubblicare un modulo: revisione indipendente di fatti e domande, aggiunta del video a ogni lezione, `status: published` e `approved: true` decisi dal titolare. Una lezione non pubblicata si vede solo in sviluppo.
