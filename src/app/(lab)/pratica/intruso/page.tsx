import type { Metadata } from "next";
import { Workspace } from "@/components/lab/workspace";
import { IntruderExercise } from "@/components/practice/intruder-exercise";

export const metadata: Metadata = { title: "Laboratorio: caccia all'intruso" };

export default function IntrusoPage() {
  return (
    <Workspace tool="Missione" title="Caccia all'intruso">
      <IntruderExercise />
    </Workspace>
  );
}
