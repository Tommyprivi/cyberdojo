/** Le pagine di accesso occupano tutto lo schermo: niente intestazione del sito, il marchio sta nella cornice. */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return <main className="min-h-dvh">{children}</main>;
}
