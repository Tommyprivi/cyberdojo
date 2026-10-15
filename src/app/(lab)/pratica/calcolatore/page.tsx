import type { Metadata } from "next";
import { Lab } from "@/components/lab/lab";

export const metadata: Metadata = { title: "Laboratorio: calcolatore di rete" };

export default function CalcolatorePage() {
  return <Lab scenarioId="calcolatore-66" />;
}
