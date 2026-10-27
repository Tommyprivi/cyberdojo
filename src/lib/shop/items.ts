/**
 * Catalogo del negozio del Sensei. Vive nel codice, non nel database: il prezzo lo decide sempre il server.
 * Le «monete» sono solo punti di gioco guadagnati studiando (10 XP = 1 moneta). Niente soldi veri.
 *
 * L'id di ogni oggetto è il nome del suo disegno in public/img/negozio (senza .png).
 */

export type ShopSlot = "band" | "hat" | "accessory" | "background";
/** Gli accessori hanno due posti: uno sul viso (cuffie, occhiali) e uno in mano (ventaglio, katana). */
export type AccessorySpot = "face" | "hand";

/**
 * Dove sta il disegno sul Sensei. I numeri sono percentuali del quadrato del Sensei (0 = bordo sinistro/alto,
 * 100 = bordo destro/basso; si può uscire dal quadrato con numeri negativi o oltre 100).
 * Per ritoccare un oggetto basta cambiare questi valori.
 */
export type ItemFit = {
  /** Centro orizzontale (50 = al centro del Sensei). */
  x: number;
  /** Bordo alto del disegno. */
  y: number;
  /** Larghezza del disegno (l'altezza segue le proporzioni). */
  w: number;
  /** Rotazione in gradi (facoltativa). */
  rotate?: number;
};

export type ShopItem = {
  id: string;
  name: string;
  slot: ShopSlot;
  /** Solo per gli accessori. */
  spot?: AccessorySpot;
  /** Prezzo in monete (numero intero positivo). */
  price: number;
  description: string;
  /** Il disegno (public/img/negozio). */
  img: { src: string; width: number; height: number };
  /** Posizione sul Sensei (non per gli sfondi, che coprono tutto il riquadro). */
  fit?: ItemFit;
};

export const SLOT_LABELS: Record<ShopSlot, string> = {
  band: "Fasce",
  hat: "Cappelli",
  accessory: "Accessori",
  background: "Sfondi",
};

/** Ordine delle sezioni nella pagina. */
export const SLOT_ORDER: readonly ShopSlot[] = [
  "band",
  "hat",
  "accessory",
  "background",
];

const img = (id: string, width: number, height: number) => ({
  src: `/img/negozio/${id}.png`,
  width,
  height,
});

export const SHOP_ITEMS: readonly ShopItem[] = [
  // Fasce: coprono la fascia rossa del Sensei (più larghe della testa, a metà fronte).
  {
    id: "fascia-blu",
    name: "Fascia blu",
    slot: "band",
    price: 10,
    description: "Il colore del dojo.",
    img: img("fascia-blu", 266, 180),
    fit: { x: 50, y: 33, w: 66 },
  },
  {
    id: "fascia-verde",
    name: "Fascia verde",
    slot: "band",
    price: 20,
    description: "Fresca come il tè matcha.",
    img: img("fascia-verde", 266, 180),
    fit: { x: 50, y: 33, w: 66 },
  },
  {
    id: "fascia-oro",
    name: "Fascia d'oro",
    slot: "band",
    price: 40,
    description: "Brilla anche di notte.",
    img: img("fascia-oro", 268, 180),
    fit: { x: 50, y: 33, w: 66 },
  },
  {
    id: "fascia-nera",
    name: "Fascia nera",
    slot: "band",
    price: 60,
    description: "Il colore dei veri maestri.",
    img: img("fascia-nera", 268, 180),
    fit: { x: 50, y: 33, w: 66 },
  },

  // Cappelli: appoggiati in cima alla testa, centrati.
  {
    id: "cappello-paglia",
    name: "Cappello di paglia",
    slot: "hat",
    price: 40,
    description: "Per i lunghi viaggi tra i casi.",
    img: img("cappello-paglia", 310, 236),
    fit: { x: 50, y: -8, w: 60 },
  },
  {
    id: "cappello-cuoco",
    name: "Cappello da cuoco",
    slot: "hat",
    price: 70,
    description: "Il Sensei è pur sempre un onigiri.",
    img: img("cappello-cuoco", 260, 230),
    fit: { x: 50, y: -6, w: 44 },
  },
  {
    id: "cappello-pirata",
    name: "Cappello da pirata",
    slot: "hat",
    price: 100,
    description: "All'arrembaggio dei bug!",
    img: img("cappello-pirata", 300, 166),
    fit: { x: 50, y: 0, w: 62 },
  },
  {
    id: "cappello-mago",
    name: "Cappello da mago",
    slot: "hat",
    price: 140,
    description: "Magia, ma solo quella dei computer.",
    img: img("cappello-mago", 280, 240),
    fit: { x: 50, y: -22, w: 60 },
  },
  {
    id: "elmo-samurai",
    name: "Elmo da samurai",
    slot: "hat",
    price: 170,
    description: "Il kabuto dei guerrieri di un tempo.",
    img: img("elmo-samurai", 278, 222),
    fit: { x: 50, y: -10, w: 56 },
  },
  {
    id: "corona",
    name: "Corona del maestro",
    slot: "hat",
    price: 200,
    description: "Per chi arriva fino in fondo.",
    img: img("corona", 262, 192),
    fit: { x: 50, y: -4, w: 44 },
  },

  // Accessori: uno sul viso e uno in mano, insieme.
  {
    id: "cuffie",
    name: "Cuffie",
    slot: "accessory",
    spot: "face",
    price: 30,
    description: "Musica per studiare con calma.",
    img: img("cuffie", 258, 226),
    fit: { x: 50, y: -2, w: 92 },
  },
  {
    id: "occhiali-tondi",
    name: "Occhiali tondi",
    slot: "accessory",
    spot: "face",
    price: 50,
    description: "Per un Sensei molto serio.",
    img: img("occhiali-tondi", 248, 114),
    fit: { x: 50, y: 53, w: 44 },
  },
  {
    id: "ventaglio",
    name: "Ventaglio",
    slot: "accessory",
    spot: "hand",
    price: 80,
    description: "Un colpo d'aria fresca.",
    img: img("ventaglio", 310, 210),
    fit: { x: 84, y: 66, w: 40 },
  },
  {
    id: "katana-di-carta",
    name: "Katana di carta",
    slot: "accessory",
    spot: "hand",
    price: 120,
    description: "Affilata come un origami.",
    img: img("katana-di-carta", 288, 290),
    fit: { x: 88, y: 60, w: 34 },
  },

  // Sfondi: immagine di fondo del riquadro.
  {
    id: "sfondo-dojo",
    name: "Dojo",
    slot: "background",
    price: 80,
    description: "Il luogo dove tutto comincia.",
    img: img("sfondo-dojo", 640, 366),
  },
  {
    id: "sfondo-giardino-zen",
    name: "Giardino zen",
    slot: "background",
    price: 100,
    description: "Sassi, onde e tanta calma.",
    img: img("sfondo-giardino-zen", 640, 366),
  },
  {
    id: "sfondo-montagna",
    name: "Montagna",
    slot: "background",
    price: 130,
    description: "Una vetta da raggiungere.",
    img: img("sfondo-montagna", 640, 366),
  },
  {
    id: "sfondo-notte-lanterne",
    name: "Notte di lanterne",
    slot: "background",
    price: 160,
    description: "Luci calde per studiare tardi.",
    img: img("sfondo-notte-lanterne", 640, 366),
  },
];

const BY_ID = new Map(SHOP_ITEMS.map((i) => [i.id, i]));

export function getItem(id: string): ShopItem | undefined {
  return BY_ID.get(id);
}

/**
 * Gruppo di equipaggiamento: di ogni gruppo si indossa un solo oggetto.
 * Fascia, cappello e sfondo hanno un gruppo ciascuno; gli accessori ne hanno due (viso e mano).
 */
export function equipGroup(item: ShopItem): string {
  return item.slot === "accessory"
    ? `accessory:${item.spot ?? "face"}`
    : item.slot;
}

export type PreviewLayers = {
  background?: ShopItem;
  /** Oggetti da disegnare sopra il Sensei, dal fondo alla cima (fascia, viso, cappello, mano). */
  worn: ShopItem[];
};

const LAYER_ORDER = ["band", "accessory:face", "hat", "accessory:hand"];

/** Dagli id equipaggiati a ciò che si vede nell'anteprima. Id sconosciuti ignorati. */
export function previewLayers(ids: readonly string[]): PreviewLayers {
  const items = ids
    .map((id) => BY_ID.get(id))
    .filter((i): i is ShopItem => !!i);
  const worn = items.filter((i) => i.slot !== "background" && i.fit);
  worn.sort(
    (a, b) =>
      LAYER_ORDER.indexOf(equipGroup(a)) - LAYER_ORDER.indexOf(equipGroup(b)),
  );
  return { background: items.find((i) => i.slot === "background"), worn };
}
