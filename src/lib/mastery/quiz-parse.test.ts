import { describe, expect, it } from "vitest";
import { parseQuizzes } from "./quiz-parse";

const mdx = `
<Quiz
  question="Quale è \\"giusta\\"?"
  options={["Uno", "Due, con virgola", "Tre"]}
  answer={1}
  explain="Perché sì."
/>
testo
<Quiz question="Seconda?" options={["a", "b"]} answer={0} explain="x" />
<Quiz question="Rotta" options={[ciao]} answer={0} explain="x" />
<Quiz question="Fuori" options={["a", "b"]} answer={7} explain="x" />
`;

describe("estrazione dei <Quiz> dalle lezioni", () => {
  const r = parseQuizzes(mdx);
  it("legge domanda, opzioni e risposta giusta", () => {
    expect(r[0]).toEqual({ q: 'Quale è "giusta"?', ok: "Due, con virgola", no: ["Uno", "Tre"] });
    expect(r[1]).toEqual({ q: "Seconda?", ok: "a", no: ["b"] });
  });
  it("salta i blocchi malformati o con risposta fuori elenco", () => {
    expect(r).toHaveLength(2);
  });
  it("senza quiz restituisce un elenco vuoto", () => {
    expect(parseQuizzes("solo testo")).toEqual([]);
  });
});
