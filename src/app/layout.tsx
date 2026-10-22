import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Shippori_Mincho } from "next/font/google";
import { ConsentBanner } from "@/components/consent/consent-banner";
import { ConsentProvider } from "@/components/consent/consent-provider";
import { ThemeSync } from "@/components/theme-toggle";
import { SITE } from "@/lib/config";
import "./globals.css";

// Titoli: Shippori Mincho, un serif di ispirazione giapponese. Testo: IBM Plex Sans. Codice: IBM Plex Mono.
const display = Shippori_Mincho({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const text = IBM_Plex_Sans({
  variable: "--font-text-face",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={SITE.locale}
      data-theme="light"
      className={`${display.variable} ${text.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeSync />
        <ConsentProvider>
          {children}
          <ConsentBanner />
        </ConsentProvider>
      </body>
    </html>
  );
}
