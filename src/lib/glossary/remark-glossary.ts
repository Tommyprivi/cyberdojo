import { findTermHits, splitByHits } from "./linker";

/**
 * Plugin remark: nelle lezioni trasforma la prima occorrenza di ogni termine del glossario (per schermata)
 * in <GlossTerm term def>testo</GlossTerm>. Si applica a una schermata alla volta (compileMDX per schermata).
 * Mai dentro titoli, codice, link, quiz, esercizi o altri componenti interattivi: dei componenti si
 * entra solo in quelli elencati in READABLE. La definizione è solo testo del glossario, nessun link a lezioni.
 */

type Node = {
  type: string;
  value?: string;
  name?: string | null;
  attributes?: unknown[];
  children?: Node[];
};

/** Componenti MDX che contengono solo testo da leggere. */
const READABLE = new Set(["Scene", "Callout", "Say", "Recap"]);
/** Nodi dentro cui non si entra mai. */
const SKIP = new Set([
  "heading", "code", "inlineCode", "link", "linkReference", "definition", "html", "image", "imageReference",
  "mdxFlowExpression", "mdxTextExpression", "mdxjsEsm", "yaml", "toml",
]);

function glossNode(term: string, def: string, text: string): Node {
  return {
    type: "mdxJsxTextElement",
    name: "GlossTerm",
    attributes: [
      { type: "mdxJsxAttribute", name: "term", value: term },
      { type: "mdxJsxAttribute", name: "def", value: def },
    ],
    children: [{ type: "text", value: text }],
  };
}

export function remarkGlossary() {
  return (tree: Node) => {
    const used = new Set<string>();
    const walk = (node: Node) => {
      if (!node.children) return;
      const next: Node[] = [];
      for (const child of node.children) {
        if (child.type === "text" && typeof child.value === "string") {
          const hits = findTermHits(child.value, used);
          if (hits.length === 0) {
            next.push(child);
            continue;
          }
          for (const part of splitByHits(child.value, hits)) {
            next.push(typeof part === "string" ? { type: "text", value: part } : glossNode(part.term, part.def, part.text));
          }
          continue;
        }
        if (SKIP.has(child.type)) {
          next.push(child);
          continue;
        }
        if (child.type === "mdxJsxFlowElement" || child.type === "mdxJsxTextElement") {
          if (child.name && READABLE.has(child.name)) walk(child);
          next.push(child);
          continue;
        }
        walk(child);
        next.push(child);
      }
      node.children = next;
    };
    walk(tree);
  };
}
