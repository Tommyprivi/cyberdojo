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

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.description,
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
