# Diagrammi nelle lezioni

Le lezioni possono contenere schemi illustrati. Sono componenti MDX statici (`src/components/lesson/diagrams.tsx`), con i colori del sito. Esempio da imitare: `content/cybersecurity/c1/C.01.001.mdx`.

## I tre schemi

```mdx
<Flow
  caption="Frase breve che dice cosa mostra lo schema."
  steps={[
    { icon: "laptop", title: "Il guasto", text: "Il disco si rompe di notte" },
    { icon: "folder", title: "Fatture perse", text: "Nessuna copia di riserva" },
    { icon: "coin", title: "Niente incassi", text: "Non si sa chi deve pagare" },
  ]}
/>
```
`Flow`: passaggi in sequenza (2-5). Per processi, cause ed effetti, percorsi di un dato, fasi di un attacco o di un calcolo.

```mdx
<Layers caption="..." items={[{ icon: "database", title: "Dati", text: "Clienti, fatture" }, ...]} />
```
`Layers`: livelli o famiglie uno sopra l'altro (3-5). Per modelli a strati (ISO/OSI), classificazioni, gerarchie.

```mdx
<Compare
  caption="..."
  left={{ title: "Sbagliato", points: ["...", "..."] }}
  right={{ title: "Giusto", points: ["...", "..."] }}
/>
```
`Compare`: due colonne, rossa a sinistra (sbagliato/prima/attacco) e verde a destra (giusto/dopo/difesa), 2-4 punti ciascuna.

## Pittogrammi ammessi (`icon`)
user, users, laptop, phone, server, database, cloud, globe, wifi, mail, file, folder, lock, key, shield, eye, bug, fire, bell, clock, coin, chart, link, gear, search, warning, check, cross, bolt, skull, terminal, code, mask, hook, book.
Un nome diverso mostra un triangolo di avviso: usa solo questi.

## Regole
- Da 1 a 3 schemi per lezione, uno per schermata al massimo, dove l'immagine spiega davvero (processo, struttura, confronto). Non decorare: se una schermata non ha niente da schematizzare, non metterlo.
- Lo schema va dentro il `<Scene>`, prima del `<Say>` e dopo il testo che spiega. Mai nell'ultima schermata (`<Recap>`), mai accanto a `<Practice>`, `<Quiz>` o `<Video />`.
- Titoli dei passaggi brevi (1-3 parole), testo sotto di una riga. Tutto in italiano, accurato: lo schema non deve dire nulla che la lezione non dica o che sia sbagliato.
- Non cambiare il frontmatter, le domande, i `<Practice>`, i `<Quiz>`, il `<Video />`, né il numero di schermate (6-8, separate da `{/* screen */}`). Ogni schermata mantiene il suo `<Say>`.
- Dopo le modifiche: `npx tsx scripts/lint-content.ts` deve dare 0 problemi.
