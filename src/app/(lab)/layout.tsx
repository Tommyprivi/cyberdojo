import { PhoneNotice } from "@/components/practice/phone-notice";
import Link from "next/link";

/**
 * Il laboratorio è una postazione a tutto schermo per computer e tablet (da 768px): niente barra
 * laterale né intestazione del sito. Sotto i 768px lo strumento non si apre e compare un avviso.
 */
export default function LabLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <div className="hidden h-dvh overflow-hidden md:block">{children}</div>
      <main className="grid min-h-dvh content-center gap-4 p-4 md:hidden">
        <PhoneNotice />
        <Link href="/pratica" className="btn btn-primary min-h-14">Vai ai quiz</Link>
      </main>
    </>
  );
}
