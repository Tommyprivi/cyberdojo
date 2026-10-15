/**
 * Il laboratorio è una postazione a tutto schermo: niente barra laterale né intestazione del sito,
 * per concentrarsi sullo strumento. L'uscita è la freccia in alto a sinistra.
 */
export default function LabLayout({ children }: LayoutProps<"/">) {
  return <div className="h-dvh overflow-hidden">{children}</div>;
}
