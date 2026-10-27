import { BookIcon, BulbIcon, DumbbellIcon, MapIcon } from "./icons";
import { GridIcon, UserIcon } from "./nav-icons";

/** Voci di navigazione del sito pubblico (intestazione). */
export const NAV_ITEMS = [
  { href: "/percorso", label: "Percorso", Icon: MapIcon },
  { href: "/pratica", label: "Laboratorio", Icon: DumbbellIcon },
  { href: "/corsi", label: "Corsi", Icon: BookIcon },
] as const;

/**
 * Voci dell'area riservata: barra in basso (telefono) e barra laterale (PC). 'Esplora' raccoglie tutte le altre funzioni.
 * Niente "Corsi": dentro l'area riservata il Percorso mostra già tutti i corsi, sarebbe un doppione.
 */
export const APP_NAV = [
  { ...NAV_ITEMS[0], label: "Percorso" },
  { ...NAV_ITEMS[1], label: "Pratica" },
  { href: "/dojo", label: "Sensei", Icon: BulbIcon },
  { href: "/esplora", label: "Esplora", Icon: GridIcon },
  { href: "/profilo", label: "Profilo", Icon: UserIcon },
] as const;

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
