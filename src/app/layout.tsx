import type { Metadata } from "next";
import { Fredoka, JetBrains_Mono, Nunito } from "next/font/google";
import { ThemeSync } from "@/components/theme-toggle";
import { SITE } from "@/lib/config";
import "./globals.css";

// Titoli: Fredoka (rotondo e amichevole). Testo: Nunito (molto leggibile a schermo). Codice: JetBrains Mono.
const display = Fredoka({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const text = Nunito({
  variable: "--font-text-face",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
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
        {children}
      </body>
    </html>
  );
}
