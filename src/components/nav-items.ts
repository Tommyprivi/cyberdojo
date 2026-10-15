import { BookIcon, DumbbellIcon, MapIcon } from "./icons";

/** Voci di navigazione condivise tra barra in basso (telefono) e barra laterale (PC). */
export const NAV_ITEMS = [
  { href: "/percorso", label: "Percorso", Icon: MapIcon },
  { href: "/pratica", label: "Laboratorio", Icon: DumbbellIcon },
  { href: "/corsi", label: "Corsi", Icon: BookIcon },
] as const;

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
