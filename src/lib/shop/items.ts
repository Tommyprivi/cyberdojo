/**
 * Catalogo del negozio del Sensei. Vive nel codice, non nel database: il prezzo lo decide sempre il server.
 * Le «monete» sono solo punti di gioco guadagnati studiando (10 XP = 1 moneta). Niente soldi veri.
 */

export type ShopSlot = "band" | "hat" | "background";

/** Come cambia l'aspetto del Sensei (letto da <Mascot look={...} />). */
export type SenseiLook = {
  /** Colore della fascia (esadecimale). */
  band?: string;
  hat?: "paglia" | "ninja" | "cuoco" | "corona";
  background?: "alba" | "bambu" | "notte" | "sakura";
};

export type ShopItem = {
  id: string;
  name: string;
  slot: ShopSlot;
  /** Prezzo in monete (numero intero positivo). */
  price: number;
  description: string;
  look: SenseiLook;
};

export const SLOT_LABELS: Record<ShopSlot, string> = { band: "Fascia", hat: "Cappello", background: "Sfondo" };

export const SHOP_ITEMS: readonly ShopItem[] = [
  { id: "fascia-indaco", name: "Fascia indaco", slot: "band", price: 10, description: "Il colore del dojo.", look: { band: "#1f3a5f" } },
  { id: "fascia-verde", name: "Fascia verde", slot: "band", price: 20, description: "Fresca come il tè matcha.", look: { band: "#3f7d4e" } },
  { id: "fascia-viola", name: "Fascia viola", slot: "band", price: 35, description: "Un tocco di mistero.", look: { band: "#6b3fa0" } },
  { id: "sfondo-alba", name: "Alba", slot: "background", price: 40, description: "Il sole che sorge dietro il Sensei.", look: { background: "alba" } },
  { id: "cappello-paglia", name: "Cappello di paglia", slot: "hat", price: 50, description: "Per i lunghi viaggi tra i casi.", look: { hat: "paglia" } },
  { id: "fascia-oro", name: "Fascia d'oro", slot: "band", price: 70, description: "Brilla anche di notte.", look: { band: "#c9971c" } },
  { id: "sfondo-bambu", name: "Bosco di bambù", slot: "background", price: 85, description: "Calma e canne verdi.", look: { background: "bambu" } },
  { id: "cappello-ninja", name: "Bandana ninja", slot: "hat", price: 110, description: "Silenzioso e veloce.", look: { hat: "ninja" } },
  { id: "sfondo-notte", name: "Notte stellata", slot: "background", price: 140, description: "Stelle e luna per studiare tardi.", look: { background: "notte" } },
  { id: "fascia-nera", name: "Fascia nera", slot: "band", price: 180, description: "Il colore dei veri maestri.", look: { band: "#1a1612" } },
  { id: "cappello-cuoco", name: "Cappello da cuoco", slot: "hat", price: 230, description: "Il Sensei è pur sempre un onigiri.", look: { hat: "cuoco" } },
  { id: "sfondo-sakura", name: "Fiori di ciliegio", slot: "background", price: 300, description: "Petali che cadono piano.", look: { background: "sakura" } },
  { id: "cappello-corona", name: "Corona del maestro", slot: "hat", price: 500, description: "Per chi arriva fino in fondo.", look: { hat: "corona" } },
];

const BY_ID = new Map(SHOP_ITEMS.map((i) => [i.id, i]));

export function getItem(id: string): ShopItem | undefined {
  return BY_ID.get(id);
}

/** Dagli id equipaggiati all'aspetto del Sensei. Id sconosciuti ignorati. */
export function lookFromEquipped(ids: readonly string[]): SenseiLook {
  const look: SenseiLook = {};
  for (const id of ids) {
    const item = BY_ID.get(id);
    if (item) Object.assign(look, item.look);
  }
  return look;
}
