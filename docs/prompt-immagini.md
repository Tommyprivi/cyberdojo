# Prompt per le immagini di CyberDojo (stile del sito)

Il sito ha già uno stile preciso: **carta crema, inchiostro blu notte, un solo sigillo rosso, linee sottili**, ispirato alla carta giapponese. Le copertine dei corsi e le pagine di accesso lo seguono già (`public/img/corsi/*.jpg`, `public/img/accesso/*.jpg`). Tutte le immagini nuove devono sembrare della stessa famiglia.
Il Sensei esiste già (`public/img/mascotte/sensei.svg`): un onigiri crema con fascia rossa e base blu. NON va reinventato.

## Come generare (Gemini, o altra IA con immagine di riferimento)
1. Allega SEMPRE l'immagine `public/img/mascotte/sensei-riferimento.png` quando il prompt contiene il Sensei, e scrivi: «Usa il personaggio dell'immagine allegata, identico (stesso viso, fascia rossa, base blu), cambia solo posa e oggetti».
2. Per le illustrazioni senza il Sensei allega una copertina esistente (es. `public/img/corsi/cybersecurity.jpg`) e scrivi: «Stesso stile e stessa palette dell'immagine allegata».
3. Incolla prima lo **Stile comune**, poi il prompt della singola immagine.
4. Niente testo dentro le immagini: i titoli li metto io.
5. Salva i file con i nomi indicati e dimmi dove sono: li ottimizzo (WebP) e li collego.

## Stile comune (incolla sempre all'inizio)
> Flat, clean illustration inspired by Japanese paper and ink prints (ukiyo-e / sumi-e meets modern tech magazine). Warm cream paper background #f4efe4, midnight-navy ink #1f3a5f for main shapes, thin dark outlines #1a1612, a single small seal-red accent #b8321c used sparingly, optional pale peach blush #ff9e8f only on the mascot cheeks. Calm, sober, lots of empty space. No neon, no gradients, no glossy 3D, no realistic people or faces, no logos, no text, no letters, no numbers, no watermark.

## Il personaggio (da aggiungere quando serve)
> Mascot "Sensei": a cream rice-ball (onigiri) with a rounded triangular shape, thick dark outline, a navy-blue band at the bottom, a red headband with a small white circle and red dot and two ribbon tails, two black oval eyes with small highlights, rosy cheeks, a small smile. Keep it exactly as in the attached reference.

---

## 1. Il Sensei in pose nuove — `public/img/mascotte/` (1024×1024, sfondo crema piatto)
`sensei-felice`, `sensei-pensa` (mano al mento, una piccola lampadina d'inchiostro), `sensei-studia` (legge un libro aperto), `sensei-triste`, `sensei-celebra` (alza una coppa), `sensei-cuffie` (ascolta, onde sonore a linee sottili), `sensei-microfono`, `sensei-dorme`, `sensei-lente` (cerca con una lente), `sensei-scudo`, `sensei-allenatore` (fischietto e lavagnetta), `sensei-correzione-codice` (matita rossa su un foglio di parentesi graffe).
Ogni pose: «Sensei <posa>, same character, minimal props drawn in navy ink, one red accent».

## 2. Copertine dei 10 corsi nuovi — `public/img/corsi/<nome>.jpg` (1600×900)
Formato come le copertine esistenti: composizione centrale, grande spazio vuoto, piccolo sigillo rosso quadrato in basso a destra, nessun testo. Aggiungi: «wide 16:9, one central subject, concentric or flowing line work like the attached cover».
- `sviluppo-web`: una finestra del browser stilizzata che sboccia come un fiore di carta, parentesi angolari a pennellata.
- `programmazione`: tessere a incastro che formano una scala che sale verso una luna, diagramma di flusso come sentiero.
- `app-telefono`: uno smartphone al centro con piccole icone-sigillo che fluttuano come foglie.
- `intelligenza-artificiale`: una rete di punti e linee che forma la sagoma di un albero di ciliegio, un punto rosso al centro.
- `database-grandi-dati`: un fiume di righe sottili che scorre in un grande lago circolare, cilindri stilizzati come lanterne.
- `cloud-devops`: nuvole di inchiostro e casse (container) su un nastro che sale, un razzo di carta piegata.
- `reti-internet`: un globo a linee con nodi collegati da fili sottili, cavi che attraversano un mare a onde.
- `hacking-etico`: una pagoda con una bandierina rossa in cima, un piccolo cappello bianco, un terminale stilizzato nella roccia.
- `blockchain`: cubi di carta uniti in una catena che si arrotola come un drago, una chiave.
- `mondo-digitale`: figure minuscole stilizzate (senza volti) che camminano su ponti tra icone di telefono, lucchetto e cuore.
Copertine dei 5 corsi esistenti: restano le attuali.

## 3. Icone dei moduli dei 10 corsi — `public/img/corsi/icone/` (512×512, sfondo trasparente)
Cinque icone per corso, una per blocco, tutte in inchiostro blu con un solo tocco rosso, tratto uniforme: «simple bold line icon in navy ink, single focal object, one small red accent, transparent background».
- Sviluppo web: pagina con `< >`; pennello su finestra; interruttore e ingranaggio; atomo; server con freccia e nuvola.
- Programmazione: lampadina con tessere; scala con gradini; albero e scatole; ramo che si dirama; progetto a mattoncini.
- App per telefono: telefono con bottoni; robottino generico (no logo Android); mela generica (no logo Apple); app con freccia di installazione; vetrina.
- Intelligenza artificiale: ingranaggio con cervello; rete di punti; fumetto di chat; occhio e immagine; bilancia dentro uno scudo.
- Database e dati: cilindro; tabelle collegate; fiume di dati; magazzino sul lago; ingranaggi e tubi.
- Cloud e DevOps: nuvola; container; timone di nave; nastro trasportatore; razzo.
- Reti e internet: cavo; globo; router con onde; lucchetto sul globo; lente su pacchetti.
- Hacking etico: cappello bianco; bandierina; terminale; scudo con lente; chiavi.
- Blockchain: cubi in catena; chiave; moneta generica (niente loghi reali); pergamena; scudo.
- Mondo digitale: telefono con cuoricino; lucchetto e scudo; carrello; videocamera; mani sul computer.

## 4. Negozio del Sensei (`public/img/negozio/`)
Gli oggetti si sovrappongono al Sensei esistente (è un SVG): servono come **accessori su sfondo trasparente**, 512×512, disegnati nello stesso stile (contorno scuro spesso, riempimenti piatti):
- Fasce: `fascia-blu`, `fascia-oro`, `fascia-nera`, `fascia-verde`.
- Cappelli: `cappello-mago` (blu notte con stelline), `cappello-cuoco`, `cappello-paglia` (kasa giapponese), `elmo-samurai` (kabuto), `corona`, `cappello-pirata`.
- Accessori: `cuffie`, `occhiali-tondi`, `ventaglio`, `katana-di-carta` (innocua, di cartone).
- Sfondi 1600×900 (carta e inchiostro): `sfondo-dojo` (tatami e porte shoji), `sfondo-giardino-zen` (sabbia rastrellata), `sfondo-montagna` (Fuji a inchiostro), `sfondo-notte-lanterne`.
- `negozio` (copertina 1600×900): una bancarella giapponese con tendina (noren) e lanterne, monete tonde con foro quadrato (stile mon) senza numeri. `moneta` (256×256): moneta tonda con foro quadrato e un piccolo onigiri inciso.

## 5. Cinture, medaglie e leghe — `public/img/premi/` (1024×1024, sfondo trasparente)
- Cinture annodate, una per colore: `cintura-bianca`, `gialla`, `arancione`, `verde`, `blu`, `marrone`, `nera` («a martial-arts belt tied in a knot, flat, thick dark outline»).
- Medaglie rotonde con nastro, senza testo: `medaglia-primo-caso`, `serie-3`, `serie-7`, `serie-30` (fiamma sempre più grande), `sfida`, `certificato` (pergamena con sigillo), `ctf` (bandierina), `ascolto` (cuffie).
- Leghe, uno scudo-medaglia ciascuna: `lega-bronzo`, `argento`, `oro`, `zaffiro`, `rubino`, `diamante` (resta sobrio: stesso scudo, cambia il materiale e il colore, inchiostro nero e un accento).
- `certificato` (1600×1131, orizzontale): pergamena con bordo a linee sottili blu notte, un sigillo rosso quadrato con 道場, spazio vuoto al centro (nome e corso li metto io).

## 6. Pagine e funzioni (1600×900, stile copertina) — `public/img/funzioni/`
Tutte con spazio vuoto, sigillo rosso piccolo in basso a destra, nessun testo.
- Tutorial di benvenuto, 4 schermate: `tutorial-1-porta` (porta shoji socchiusa su un sentiero), `tutorial-2-sentiero` (sentiero a tappe tonde che sale una collina), `tutorial-3-sensei` (Sensei con un fumetto vuoto), `tutorial-4-premi` (cintura, medaglia, fiamma su uno scaffale di legno).
- `test-ingresso` (cancello torii con bussola), `prova-padronanza` (Sensei in posa davanti a una tavola di legno spezzata), `ripasso` (carte che girano in cerchio), `mappa-sapere` (mappa antica con isole e sentieri), `sfida-del-giorno` (fulmine di inchiostro in un calendario).
- `cerca`, `glossario` (dizionario aperto), `appunti`, `segnalibro`, `ascolta-lezione`, `sensei-voce`.
- `classifica` (podio a tre gradini con tre piccoli Sensei), `amici`, `squadre`, `annunci` (Sensei con un megafono di carta), `eventi-dal-vivo` (palco con lanterne), `duello` (due Sensei che si sfidano con ventagli, scintille d'inchiostro, nessuna violenza).
- CTF: `ctf-copertina` (Sensei con cappello bianco che pianta una bandierina su una collina), icone per categoria `ctf-crittografia` (lucchetto e chiave), `ctf-forensics` (lente su un registro), `ctf-web` (finestra con un insetto buffo), `ctf-password` (cassaforte), `ctf-reti` (pacchetto tra nodi), `ctf-osint` (mappa con puntine); livelli `ctf-facile`/`medio`/`difficile` (1, 2, 3 stelle a pennellata).
- Scuole e profilo: `docente` (Sensei con occhiali davanti a una lavagna), `classe` (tanti piccoli Sensei ai banchi), `portfolio` (vetrina con certificati incorniciati), `notifiche` (campanello con Sensei che sbircia), `offline` (nuvola barrata, Sensei con una lanterna), `installa-app` (telefono con il Sensei che esce dallo schermo).

## 7. Stati vuoti e messaggi (800×600) — `public/img/stati/`
`vuoto-appunti`, `vuoto-segnalibri`, `errore-404` (Sensei con una mappa, perso), `manutenzione` (Sensei con attrezzi), `successo` (Sensei con un segno di spunta a pennellata). Esiste già `public/img/manutenzione.jpg`: stessa famiglia.

## 8. App e negozi (dimensioni esatte)
- `icona-app.png` — 1024×1024: il Sensei (riferimento allegato) su sfondo blu notte #1f3a5f o crema, margini ampi: la parte importante nel 70% centrale.
- `grafica-funzione-1024x500.png` — Sensei a sinistra, schermate di telefono stilizzate a destra, sfondo crema, spazio per il titolo.
- `schermata-1..5.png` — 1080×1920: veri screenshot dell'app (li facciamo dal telefono); niente riempitivi.
- `immagine-condivisione.png` — 1200×630: Sensei grande al centro, pochi elementi, sigillo rosso.

## Controlli prima di consegnarmele
Niente testo o lettere strane, niente volti realistici né marchi, il Sensei sempre uguale al riferimento, stessi colori del sito. Se un'immagine non convince dimmi il numero e riscrivo il prompt.
