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

## Come mi passi le immagini
Metti i file nelle cartelle indicate (o in una cartella qualsiasi e dimmi dove sono): le ottimizzo (WebP, dimensioni giuste), le collego nel sito e controllo il peso. Se un'immagine non è perfetta, dimmi il numero e riscrivo il prompt.
