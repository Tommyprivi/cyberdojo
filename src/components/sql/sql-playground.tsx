"use client";

import { useState } from "react";
import { DEFAULT_DB_ID, getDatabase } from "@/lib/sql/databases";
import { SqlWorkbench } from "./sql-workbench";
import { tokenizeSql } from "@/lib/sql/highlight";

/**
 * Terminale SQL per le lezioni: <SqlPlayground db="negozio" query="SELECT * FROM clienti;" height={420} />
 * `db` sceglie il database di esempio (negozio, scuola, log, vendite). Da 768px in su si possono eseguire
 * le query; sotto, la query si legge soltanto e compare un avviso.
 */
export function SqlPlayground({ db = DEFAULT_DB_ID, query = "", height = 420 }: { db?: string; query?: string; height?: number }) {
  const [text, setText] = useState(query);
  const database = getDatabase(db);

  if (!database) {
    return (
      <p role="alert" className="not-prose my-4 rounded-md border border-accent p-3 text-sm">
        Database di esempio «{db}» non trovato. Quelli disponibili: negozio, scuola, log, vendite.
      </p>
    );
  }

  return (
    <div className="not-prose my-4">
      <div className="hidden md:block">
        <SqlWorkbench
          dbId={database.id}
          query={text}
          onQueryChange={setText}
          explorerOpen={false}
          style={{ height }}
          toolbar={<span className="font-mono text-xs text-muted">Database: <strong className="text-foreground">{database.title}</strong></span>}
        />
      </div>
      <div className="grid gap-2 md:hidden">
        <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-sm leading-6">
          {tokenizeSql(query).map((t, i) => (
            <span key={i} className={t.type === "keyword" ? "font-bold text-primary" : t.type === "string" ? "text-success" : t.type === "comment" ? "italic text-muted" : ""}>
              {t.text}
            </span>
          ))}
        </pre>
        <p role="note" className="dossier p-3 text-sm">
          <strong>L&apos;ambiente SQL si usa da computer o tablet.</strong>
        </p>
      </div>
    </div>
  );
}
