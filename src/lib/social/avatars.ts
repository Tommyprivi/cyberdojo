/** Avatar a scelta: solo immagini predefinite, mai foto. L'identificativo è l'unico dato salvato. */
export const AVATARS = [
  { id: "sensei", label: "Il Sensei" },
  { id: "fiamma", label: "Fiamma" },
  { id: "fulmine", label: "Fulmine" },
  { id: "cintura", label: "Cintura" },
  { id: "libro", label: "Libro" },
  { id: "bersaglio", label: "Bersaglio" },
  { id: "lampadina", label: "Lampadina" },
  { id: "mappa", label: "Mappa" },
  { id: "manubrio", label: "Manubrio" },
  { id: "lucchetto", label: "Lucchetto" },
  { id: "spunta", label: "Spunta" },
  { id: "play", label: "Play" },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];
export const AVATAR_IDS = AVATARS.map((a) => a.id) as [AvatarId, ...AvatarId[]];
export const DEFAULT_AVATAR: AvatarId = "sensei";

export function isAvatarId(v: unknown): v is AvatarId {
  return typeof v === "string" && (AVATAR_IDS as readonly string[]).includes(v);
}
