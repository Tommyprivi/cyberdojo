import type { Metadata } from "next";
import { Workspace } from "@/components/lab/workspace";
import { SqlLab } from "@/components/sql/sql-lab";

export const metadata: Metadata = { title: "Laboratorio: SQL nel browser" };

export default function SqlPage() {
  return (
    <Workspace tool="Database" title="SQL nel browser (PostgreSQL)">
      <SqlLab />
    </Workspace>
  );
}
