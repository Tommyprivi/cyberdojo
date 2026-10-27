import { ViewTransition } from "react";

/**
 * Passaggio morbido tra una pagina e l'altra (View Transitions del browser, via React).
 * Un template si ricrea a ogni navigazione, quindi entrata e uscita partono sempre.
 * Dove il browser non lo supporta, o con «riduci movimento», la pagina cambia e basta.
 * Le durate sono in globals.css (.page-in / .page-out). La barra in basso sta nel layout: non si muove.
 */
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}
