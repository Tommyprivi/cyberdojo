import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { BinaryExercise } from "@/components/practice/binary-exercise";

export const metadata: Metadata = { title: "Pratica: binario → decimale" };

export default function BinarioPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <h1 className="font-display text-3xl font-bold">Binario → decimale</h1>
        <BinaryExercise />
      </main>
    </>
  );
}
