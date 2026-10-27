# Prompt per le immagini di CyberDojo

Per generare immagini con un'IA gratuita (Bing Image Creator / Copilot, Gemini, Leonardo, Ideogram, Adobe Firefly gratuito…) e non solo SVG.
I prompt sono in inglese, perché funzionano meglio. Incolla SEMPRE prima il **blocco di stile**, poi il prompt specifico.

## Blocco di stile (da incollare in ogni prompt)
> Flat vector illustration, friendly game-like style, thick rounded outlines, soft shadows, cheerful palette: green #1b7a3a, sun yellow #ffc800, sky blue #1d63c9, red accent #c0341f, dark navy #1b2433, off-white #f4f7fb. Clean shapes, no text, no letters, no watermark, no logos, centered composition, plenty of empty space.

Il personaggio è **il Sensei**: un onigiri (triangolo di riso) sorridente con una fascia rossa in testa e una base blu scuro (vedi `public/img/mascotte/sensei.svg`).
> Mascot "Sensei": a smiling rice-ball (onigiri) character with a red headband showing a white circle, rosy cheeks, a dark-blue seaweed band at the bottom, thick dark outline.

## Regole per chi genera
- Niente testo dentro le immagini (le IA sbagliano le lettere): i titoli li metto io nel sito.
- Formato: PNG o WebP; per le foto/illustrazioni larghe, 1600×900. Per le icone, quadrato 1024×1024.
- Salva i file in `public/img/` con il nome indicato qui sotto e dimmelo: li collego io.
- Controlla sempre: niente mani strane, niente marchi, niente persone reali riconoscibili.

---

## 1. Il Sensei in tante pose (1024×1024, sfondo trasparente o piatto chiaro) — `public/img/mascotte/`
1. `sensei-felice.png` — Sensei jumping with joy, arms up, confetti around.
2. `sensei-pensa.png` — Sensei with a hand on chin, thought bubble with a lightbulb (no text).
3. `sensei-studia.png` — Sensei reading a big open book, small glasses.
4. `sensei-triste.png` — Sensei with a small sad face, a tiny rain cloud, still cute.
5. `sensei-celebra.png` — Sensei holding a golden trophy above its head.
6. `sensei-cuffie.png` — Sensei wearing headphones, listening, music notes around.
7. `sensei-microfono.png` — Sensei speaking into a small microphone, sound waves.
8. `sensei-dorme.png` — Sensei sleeping with a "z z z" shape (no letters, use cloud shapes).
9. `sensei-ninja.png` — Sensei in a stealthy ninja pose with a small shuriken-shaped star.
10. `sensei-lente.png` — Sensei holding a magnifying glass, searching.
11. `sensei-scudo.png` — Sensei holding a shield with a lock symbol (security theme).
12. `sensei-razzo.png` — Sensei riding a small rocket, stars behind.

## 2. Copertine dei corsi (1600×900) — `public/img/corsi/<nome>.png`
Aggiungi a ogni prompt: «wide banner composition, subject on the right, empty space on the left».
- `fondamenta` — a desktop computer, a Linux penguin shape, network cables and an IP-address cloud, no text.
- `cybersecurity` — a big shield with a keyhole, a magnifying glass over a laptop, friendly padlocks.
- `dati` — colorful bar and line charts, a database cylinder, a spreadsheet grid.
- `trading` — candlestick chart going up, coins, a Python-snake-shaped line (no logos).
- `hedge` — a chessboard with a briefcase and a balance scale, abstract graphs.
- `sviluppo-web` — a browser window with code brackets, a paintbrush, a mobile and desktop screen.
- `programmazione` — blocks of code like Lego, a flowchart, gears.
- `app-telefono` — a smartphone with colorful app icons floating around, a download arrow.
- `intelligenza-artificiale` — a friendly robot head, a neural-network of dots, a spark.
- `database-grandi-dati` — stacked servers, rivers of data flowing into a lake, a cloud.
- `cloud-devops` — clouds with containers (shipping boxes) and a conveyor belt, a rocket launch.
- `reti-internet` — globe with connected nodes, cables under the sea, a router.
- `hacking-etico` — a friendly hacker with a hoodie wearing a white hat, a flag on a pole, a terminal window (no text).
- `blockchain` — linked cubes forming a chain, a key, coins (no real-brand logos).
- `mondo-digitale` — people of different ages with phones, social icons as shapes, a heart, a lock.

## 3. Cinture e traguardi (1024×1024) — `public/img/premi/`
Cintura ripiegata e annodata, una per colore: `cintura-bianca`, `gialla`, `arancione`, `verde`, `blu`, `marrone`, `nera`.
- Prompt base: «a martial-arts belt tied in a knot, <colore>, flat vector, thick outline, soft glow».
Medaglie (stile medaglia rotonda con nastro, senza testo):
- `medaglia-primo-caso` (a small check mark), `medaglia-serie-3`/`7`/`30` (a flame growing bigger), `medaglia-sfida` (crossed swords), `medaglia-certificato` (a scroll with a seal), `medaglia-ctf` (a flag), `medaglia-ascolto` (headphones).

## 4. Negozio del Sensei (512×512, sfondo trasparente) — `public/img/negozio/`
Cappelli e accessori da sovrapporre al Sensei, ognuno **su sfondo trasparente**:
- `fascia-blu`, `fascia-oro`, `cappello-mago` (wizard hat with stars), `cappello-cuoco` (chef hat), `corona`, `cuffie`, `occhiali-sole`, `cappello-pirata`, `elmo-astronauta`.
Sfondi (1600×900): `sfondo-dojo` (a wooden dojo with paper doors), `sfondo-spazio`, `sfondo-giardino-zen`, `sfondo-citta-neon`.

## 5. Stati vuoti e messaggi (800×600) — `public/img/stati/`
- `vuoto-appunti` (an empty notebook, Sensei peeking), `vuoto-segnalibri`, `offline` (a cloud with a slash, Sensei with a flashlight), `errore-404` (a lost Sensei with a map), `manutenzione` (Sensei with tools), `successo` (Sensei with a green check).

## 6. Per l'app e i negozi (dimensioni esatte)
- `icona-app.png` — 1024×1024, solo il Sensei su sfondo verde #1b7a3a, margini ampi (la parte importante nel 70% centrale).
- `grafica-funzione-1024x500.png` — banner 1024×500: Sensei a sinistra, schermate di telefono stilizzate a destra, spazio per un titolo (lo metto io).
- `schermata-1..5.png` — 1080×1920: riempitivi con il Sensei e piccoli elementi di gioco (i veri screenshot li facciamo dall'app).
- `immagine-condivisione.png` — 1200×630, per le anteprime sui social: Sensei grande al centro, tanti coriandoli.

## 7. Sfondi e decorazioni
- `sfondo-benvenuto.png` (1600×900): morning landscape with hills, a torii-like gate and a path winding up (the "sentiero").
- `sentiero-tappa-fatta` / `tappa-prossima` / `tappa-bloccata` (256×256): round path stones — green with check, glowing with play, grey with lock.
- `confetti.png` (1600×900, trasparente): colorful confetti and sparkles falling.

## 8. Le funzioni nuove (aggiornamento 2.0)
Tutte 1024×1024 se non indicato, stile e Sensei come sopra, nessun testo. Cartella `public/img/funzioni/`.

**Percorso e prove**
- `tutorial-1-benvenuto` (1600×900): Sensei che apre una porta di carta del dojo verso un sentiero luminoso.
- `tutorial-2-sentiero`: un sentiero a tappe tonde (verde con spunta, una brillante, altre grigie) che sale una collina.
- `tutorial-3-sensei`: Sensei con un fumetto vuoto accanto a un telefono.
- `tutorial-4-premi`: cintura, medaglia e fiamma della serie, disposte come uno scaffale di premi.
- `test-ingresso`: Sensei con un cancello torii e una bussola che indica la strada.
- `prova-padronanza`: Sensei in posa di karate davanti a una tavola di legno che si spezza (simbolo di prova superata).
- `ripasso`: tante carte (flashcard) che girano attorno al Sensei, una freccia circolare.
- `mappa-sapere` (1600×900): mappa del tesoro disegnata con isole = materie, sentieri tra loro, Sensei con cannocchiale.
- `sfida-del-giorno`: un fulmine giallo dentro un calendario, Sensei che sorride.

**Cerca, glossario, appunti**
- `cerca`: Sensei con una grande lente su una pila di libri. `glossario`: un dizionario aperto con tante piccole nuvolette. `appunti`: Sensei che scrive su un taccuino con matita. `segnalibro`: un segnalibro rosso che spunta da un libro.

**Ascolto e voce**
- `ascolta-lezione`: Sensei con cuffie su un libro da cui escono onde sonore. `sensei-voce`: Sensei con microfono e fumetto a forma di onda.

**Community**
- `classifica` (1600×900): podio a tre gradini con tre piccoli ninja onigiri. `amici`: due onigiri che si danno il cinque. `squadre`: tre onigiri con fasce di colori diversi uniti. `annunci`: Sensei con un megafono e coriandoli. `reazioni`: sei bollicine con facce allegre (senza testo).
- `duello` (1600×900): due Sensei che si sfidano con ventagli, scintille al centro, stile fumetto simpatico (nessuna violenza).
- Leghe, una medaglia a scudo ciascuna: `lega-bronzo`, `lega-argento`, `lega-oro`, `lega-zaffiro` (blu), `lega-rubino` (rosso), `lega-diamante` (cristallo).
- `eventi-dal-vivo`: palco con riflettori e un grande orologio, Sensei che saluta il pubblico.

**Negozio**
- `negozio` (1600×900): una bancarella giapponese con tendina, Sensei che vende, monete dorate tonde (senza numeri).
- `moneta` (256×256): moneta tonda dorata con un onigiri inciso.

**CTF (laboratori di hacking)**
- `ctf-copertina` (1600×900): Sensei con cappuccio e cappello bianco che pianta una bandierina su una collina digitale, stile simpatico.
- Una icona per categoria: `ctf-crittografia` (lucchetto con chiave), `ctf-forensics` (lente su un registro a righe), `ctf-web` (finestra del browser con un insetto buffo), `ctf-password` (cassaforte con un buco della serratura), `ctf-reti` (pacchetto con ali tra nodi), `ctf-osint` (mappa con puntine e lente).
- Livelli: `ctf-facile` (una stella), `ctf-medio` (due stelle), `ctf-difficile` (tre stelle).

**Scuole e profilo**
- `docente`: una lavagna con un onigiri-professore con occhiali. `classe`: tanti piccoli onigiri seduti ai banchi (senza volti realistici).
- `portfolio`: una vetrina con certificati incorniciati e una cintura. `certificato` (1600×1131, orizzontale): pergamena con bordo ornato verde e oro e un sigillo rosso 道場 (solo il sigillo, niente altro testo).
- `notifiche`: un campanello con Sensei che sbircia. `offline`: nuvola barrata con Sensei e una torcia. `installa-app`: telefono con il Sensei che esce dallo schermo.

**Il Sensei che ti segue**
- `sensei-allenatore`: Sensei con un fischietto e una lavagnetta con una curva che sale. `sensei-correzione-codice`: Sensei con matita rossa su un foglio di parentesi graffe.

## 9. I 10 corsi nuovi: icone dei moduli (512×512, sfondo trasparente) — `public/img/corsi/icone/`
Per ogni corso 5 icone, una per blocco, tutte con lo stesso colore dominante. Aggiungi: «simple bold icon, single focal object».
- **Sviluppo web (azzurro)**: pagina con parentesi `< >`; pennello su una finestra; interruttore e ingranaggio (JavaScript); atomo (React); server con freccia e cloud.
- **Programmazione (viola)**: lampadina e tessere logiche; scala con passaggi (algoritmi); alberi e scatole (strutture dati); ramo che si dirama (Git); progetto a mattoncini.
- **App per telefono (arancione)**: telefono con bottoni; il robot verde stilizzato generico (non il logo); una mela generica (non il logo); app installabile con freccia; vetrina per negozio di app.
- **Intelligenza artificiale (turchese)**: ingranaggio con cervello; rete di punti; fumetto di chat; occhio e immagine; scudo con bilancia (etica).
- **Database e dati (blu scuro)**: cilindro; tabelle collegate; fiume di dati; magazzino/lago; ingranaggi con tubi.
- **Cloud e DevOps (grigio-blu)**: nuvola; container come casse; navi con timone (orchestrazione); nastro trasportatore; razzo che decolla.
- **Reti e internet (verde acqua)**: cavo; globo; router con onde; lucchetto sul globo; lente su pacchetti.
- **Hacking etico (nero e verde)**: cappello bianco; bandierina; terminale; scudo con lente; chiavi.
- **Blockchain (oro)**: cubi in catena; chiave; moneta generica (niente loghi reali); contratto a pergamena; scudo.
- **Mondo digitale (rosa)**: telefono con cuoricino; lucchetto e scudo; carrello; videocamera; mani che lavorano al computer.

## Come mi passi le immagini
Metti i file nelle cartelle indicate (o in una cartella qualsiasi e dimmi dove sono): le ottimizzo (WebP, dimensioni giuste), le collego nel sito e controllo il peso. Se un'immagine non è perfetta, dimmi il numero e riscrivo il prompt.
