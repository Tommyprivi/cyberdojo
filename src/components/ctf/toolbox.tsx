"use client";

import { useEffect, useState } from "react";
import { base64ToText, caesar, hexToText, sha256Hex, vigenere, xorHex } from "@/lib/ctf/tools";

type Tool = "cesare" | "base64" | "hex" | "xor" | "vigenere" | "sha256" | "lunghezza";
const TOOLS: { id: Tool; label: string }[] = [
  { id: "cesare", label: "Cesare" },
  { id: "base64", label: "Base64" },
  { id: "hex", label: "Esadecimale" },
  { id: "xor", label: "XOR" },
  { id: "vigenere", label: "Vigenère" },
  { id: "sha256", label: "SHA-256" },
  { id: "lunghezza", label: "Lunghezza" },
];

const field = "min-h-12 w-full rounded-md border-2 border-border bg-background px-3 font-mono text-base";

/** Cassetta degli attrezzi: tutto gira nel browser, niente viene inviato. */
export function Toolbox() {
  const [tool, setTool] = useState<Tool>("cesare");
  const [input, setInput] = useState("");
  const [param, setParam] = useState("3");
  const [sha, setSha] = useState("");

  useEffect(() => {
    if (tool !== "sha256" || !input) return;
    let alive = true;
    void sha256Hex(input).then((h) => alive && setSha(h));
    return () => {
      alive = false;
    };
  }, [tool, input]);

  let output = "";
  if (input) {
    if (tool === "cesare") output = caesar(input, Number(param) || 0);
    else if (tool === "base64") output = base64ToText(input) ?? "Non è Base64 valido.";
    else if (tool === "hex") output = hexToText(input) ?? "Non è esadecimale valido (coppie di cifre 0-9, A-F).";
    else if (tool === "xor") output = xorHex(input, Number(param)) ?? "Servono byte esadecimali e una chiave da 0 a 255.";
    else if (tool === "vigenere") output = param.trim() ? vigenere(input, param, true) : "Scrivi la chiave.";
    else if (tool === "sha256") output = sha || "…";
    else output = `${input.trim().length} caratteri`;
  }

  return (
    <details className="rounded-lg border-2 border-border bg-surface p-3">
      <summary className="min-h-11 cursor-pointer py-2 font-bold">Cassetta degli attrezzi</summary>
      <div className="grid gap-3 pt-2">
        <div role="group" aria-label="Scegli lo strumento" className="flex flex-wrap gap-2">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={tool === t.id}
              onClick={() => {
                setTool(t.id);
                setParam(t.id === "cesare" ? "3" : "");
              }}
              className={`min-h-11 rounded-full border-2 px-4 text-sm font-semibold ${tool === t.id ? "border-primary bg-primary text-primary-fg" : "border-border"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <label className="grid gap-1 text-sm font-semibold">
          Testo da elaborare
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} spellCheck={false} autoCapitalize="off" className={`${field} min-h-24 py-2`} />
        </label>
        {(tool === "cesare" || tool === "xor" || tool === "vigenere") && (
          <label className="grid gap-1 text-sm font-semibold">
            {tool === "cesare" ? "Spostamento (anche negativo)" : tool === "xor" ? "Chiave (numero da 0 a 255)" : "Chiave (parola)"}
            <input value={param} onChange={(e) => setParam(e.target.value)} className={field} inputMode={tool === "vigenere" ? "text" : "numeric"} />
          </label>
        )}
        <div>
          <p className="text-sm font-semibold">Risultato</p>
          <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-surface-muted p-3 font-mono text-sm" aria-live="polite">
            {output || "—"}
          </pre>
        </div>
      </div>
    </details>
  );
}
