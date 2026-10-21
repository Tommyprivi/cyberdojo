import type { Metadata } from "next";
import { Workspace } from "@/components/lab/workspace";
import { TerminalLab } from "@/components/linux/terminal-lab";

export const metadata: Metadata = { title: "Laboratorio: terminale Linux" };

export default function TerminalePage() {
  return (
    <Workspace tool="Terminale" title="Terminale Linux">
      <TerminalLab />
    </Workspace>
  );
}
