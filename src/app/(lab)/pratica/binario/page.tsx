import type { Metadata } from "next";
import { Workspace } from "@/components/lab/workspace";
import { BinaryExercise } from "@/components/practice/binary-exercise";

export const metadata: Metadata = { title: "Laboratorio: binario → decimale" };

export default function BinarioPage() {
  return (
    <Workspace tool="Riflessi" title="Binario → decimale">
      <BinaryExercise />
    </Workspace>
  );
}
