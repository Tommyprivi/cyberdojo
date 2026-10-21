/** Un database di esempio: script SQL (solo dati fittizi) e query d'esempio per la pagina di pratica. */
export type SqlExample = { title: string; sql: string };

export type SampleDatabase = {
  id: string;
  title: string;
  description: string;
  script: string;
  examples: SqlExample[];
};
