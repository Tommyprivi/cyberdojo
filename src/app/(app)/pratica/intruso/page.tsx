import type { Metadata } from "next";
import { IntruderExercise } from "@/components/practice/intruder-exercise";

export const metadata: Metadata = { title: "Allenati: caccia all'intruso" };

export default function IntrusoPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-semibold">Caccia all&apos;intruso</h1>
      <IntruderExercise />
    </div>
  );
}
