import { BookIcon, BulbIcon, DumbbellIcon, MapIcon } from "./icons";
import { UserIcon, UsersIcon } from "./nav-icons";

/** Voci di navigazione del sito pubblico (intestazione). */
export const NAV_ITEMS = [
  { href: "/percorso", label: "Percorso", Icon: MapIcon },
  { href: "/pratica", label: "Laboratorio", Icon: DumbbellIcon },
  { href: "/corsi", label: "Corsi", Icon: BookIcon },
] as const;

/** Voci dell'area riservata: barra in basso (telefono) e barra laterale (PC). Con il Profilo. */
export const APP_NAV = [
  ...NAV_ITEMS,
  { href: "/dojo", label: "AI Dojo", Icon: BulbIcon },
  { href: "/social", label: "Social", Icon: UsersIcon },
  { href: "/profilo", label: "Profilo", Icon: UserIcon },
] as const;

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
