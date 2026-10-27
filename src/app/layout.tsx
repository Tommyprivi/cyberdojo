import type { Metadata, Viewport } from "next";
import { Fredoka, IBM_Plex_Mono, Nunito } from "next/font/google";
import { ConsentBanner } from "@/components/consent/consent-banner";
import { ConsentProvider } from "@/components/consent/consent-provider";
import { PwaRegister } from "@/components/pwa";
import { ThemeSync } from "@/components/theme-toggle";
import { SITE } from "@/lib/config";
import "./globals.css";

// Titoli: Fredoka, tonda e giocosa. Testo: Nunito. Codice: IBM Plex Mono.
const display = Fredoka({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const text = Nunito({
  variable: "--font-text-face",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// Immagine per la condivisione sui social: dimensioni vere del file.
const SHARE_IMAGE = { url: "/img/app/immagine-condivisione.png", width: 634, height: 338, alt: "CyberDojo: la scuola di cybersecurity con il Sensei" };

export const metadata: Metadata = {
  // L'indirizzo vero del sito (su Vercel è quello gratuito finché non c'è il dominio proprio).
  metadataBase: new URL(process.env.BETTER_AUTH_URL || `https://${SITE.domain}`),
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.description,
  openGraph: { type: "website", siteName: SITE.name, locale: "it_IT", title: SITE.name, description: SITE.description, images: [SHARE_IMAGE] },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description, images: [SHARE_IMAGE.url] },
};

// Colore della barra di stato: come lo sfondo (chiaro di partenza). ThemeSync lo aggiorna se si sceglie scuro o sistema.
export const viewport: Viewport = { themeColor: "#f4f7fb", viewportFit: "cover" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={SITE.locale}
      data-theme="light"
      className={`${display.variable} ${text.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeSync />
        <PwaRegister />
        <ConsentProvider>
          {children}
          <ConsentBanner />
        </ConsentProvider>
      </body>
    </html>
  );
}
