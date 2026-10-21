import type { Metadata } from "next";
import { Workspace } from "@/components/lab/workspace";
import { PythonLab } from "@/components/python/python-lab";

export const metadata: Metadata = { title: "Laboratorio: terminale Python" };

export default function PythonPage() {
  return (
    <Workspace tool="Terminale" title="Python nel browser">
      <PythonLab />
    </Workspace>
  );
}
