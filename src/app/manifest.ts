import type { MetadataRoute } from "next";

/** App installabile (PWA): il sito si può aggiungere alla schermata home del telefono. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CyberDojo",
    short_name: "CyberDojo",
    description: "Scuola online gratuita di cybersecurity, dati, trading e hedge fund.",
    lang: "it",
    start_url: "/percorso",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f4f7fb",
    theme_color: "#f4f7fb",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Continua a studiare", url: "/percorso" },
      { name: "Calcolatrice", url: "/pratica/calcolatrice" },
    ],
  };
}
