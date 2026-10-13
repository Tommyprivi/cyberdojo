import type { Metadata } from "next";
import { BinaryExercise } from "@/components/practice/binary-exercise";

export const metadata: Metadata = { title: "Allenati: binario → decimale" };

export default function BinarioPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Binario → decimale</h1>
      <BinaryExercise />
    </div>
  );
}
