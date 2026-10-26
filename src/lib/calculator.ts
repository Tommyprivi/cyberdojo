/**
 * Calcolatrice sicura: un piccolo analizzatore di espressioni, senza eval né Function.
 * Accetta numeri, + − × ÷ * / ^ % e parentesi. Tutto il resto è un errore.
 */

export type CalcResult = { ok: true; value: number } | { ok: false; error: string };

const MAX_LENGTH = 200;
const MAX_DEPTH = 40;

class CalcError extends Error {}

type Token = { t: "num"; v: number } | { t: "op"; v: string };

function tokenize(source: string): Token[] {
  const s = source.replace(/×/g, "*").replace(/÷/g, "/").replace(/[−–]/g, "-");
  const tokens: Token[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) {
      i++; // gli spazi separano i numeri: «2 3» non è 23
    } else if (/[0-9.,]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.,]/.test(s[j])) j++;
      const text = s.slice(i, j).replace(",", ".");
      if (!/^\d+(\.\d+)?$|^\.\d+$/.test(text)) throw new CalcError("Numero non valido");
      tokens.push({ t: "num", v: Number(text) });
      i = j;
    } else if ("+-*/^%()".includes(c)) {
      tokens.push({ t: "op", v: c });
      i++;
    } else {
      throw new CalcError("Carattere non consentito");
    }
  }
  return tokens;
}

/** Grammatica: somma → prodotto (± prodotto)*; prodotto → unario (×÷ unario)*; unario → -unario | potenza; potenza → primario%* (^ unario)? */
function evaluate(tokens: Token[]): number {
  let pos = 0;
  let depth = 0;
  const peek = () => tokens[pos];
  const isOp = (v: string) => {
    const t = peek();
    return t !== undefined && t.t === "op" && t.v === v;
  };

  const sum = (): number => {
    let left = product();
    while (isOp("+") || isOp("-")) {
      const op = (tokens[pos++] as { v: string }).v;
      const right = product();
      left = op === "+" ? left + right : left - right;
    }
    return left;
  };

  const product = (): number => {
    let left = unary();
    while (isOp("*") || isOp("/")) {
      const op = (tokens[pos++] as { v: string }).v;
      const right = unary();
      if (op === "/") {
        if (right === 0) throw new CalcError("Non si può dividere per zero");
        left /= right;
      } else {
        left *= right;
      }
    }
    return left;
  };

  // Il meno sta sopra la potenza: -2^2 = -4. L'esponente può avere il meno: 2^-1.
  const unary = (): number => {
    if (isOp("-")) {
      pos++;
      return -unary();
    }
    if (isOp("+")) {
      pos++;
      return unary();
    }
    return power();
  };

  const power = (): number => {
    const base = postfix();
    if (isOp("^")) {
      pos++;
      return base ** unary(); // da destra a sinistra: 2^3^2 = 2^(3^2)
    }
    return base;
  };

  const postfix = (): number => {
    let value = primary();
    while (isOp("%")) {
      pos++;
      value /= 100;
    }
    return value;
  };

  const primary = (): number => {
    const t = peek();
    if (!t) throw new CalcError("Espressione incompleta");
    if (t.t === "num") {
      pos++;
      return t.v;
    }
    if (t.v === "(") {
      if (++depth > MAX_DEPTH) throw new CalcError("Troppe parentesi");
      pos++;
      const value = sum();
      if (!isOp(")")) throw new CalcError("Manca una parentesi chiusa");
      pos++;
      depth--;
      return value;
    }
    throw new CalcError("Espressione non valida");
  };

  const result = sum();
  if (pos < tokens.length) throw new CalcError("Espressione non valida");
  return result;
}

export function calculate(expression: string): CalcResult {
  if (expression.length > MAX_LENGTH) return { ok: false, error: "Espressione troppo lunga" };
  if (expression.trim() === "") return { ok: false, error: "Scrivi un calcolo" };
  try {
    const value = evaluate(tokenize(expression));
    if (!Number.isFinite(value) || Math.abs(value) > 1e15) return { ok: false, error: "Risultato troppo grande" };
    // Toglie gli errori dei decimali (0,1 + 0,2 = 0,3).
    return { ok: true, value: Number(value.toPrecision(12)) };
  } catch (e) {
    return { ok: false, error: e instanceof CalcError ? e.message : "Calcolo non riuscito" };
  }
}

/** Italiano: virgola decimale e punto per le migliaia. */
export function formatResult(value: number): string {
  return new Intl.NumberFormat("it-IT", { maximumFractionDigits: 10, useGrouping: true }).format(value);
}
