// Unico punto in cui vive il nome del progetto: cambiarlo qui lo cambia ovunque.
export const SITE = {
  name: "CyberDojo",
  domain: "cyberdojo.it",
  locale: "it",
  description:
    "La scuola online italiana di cybersecurity: si impara facendo, senza scorciatoie.",
} as const;

export const BELTS = [
  { id: "bianca", token: "white", label: "Bianca" },
  { id: "gialla", token: "yellow", label: "Gialla" },
  { id: "arancione", token: "orange", label: "Arancione" },
  { id: "verde", token: "green", label: "Verde" },
  { id: "blu", token: "blue", label: "Blu" },
  { id: "marrone", token: "brown", label: "Marrone" },
  { id: "nera", token: "black", label: "Nera" },
] as const;

export type BeltId = (typeof BELTS)[number]["id"];
