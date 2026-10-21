import { describe, expect, it, vi } from "vitest";
import { explainPythonError } from "./errors";
import { OutputLimiter, createWatchdog, TIME_LIMIT_MS, type Scheduler } from "./limits";

describe("OutputLimiter", () => {
  it("lascia passare il testo sotto il limite", () => {
    const l = new OutputLimiter(10);
    expect(l.push("ciao")).toEqual({ text: "ciao", truncated: false });
    expect(l.total).toBe(4);
  });

  it("taglia esattamente al limite e poi non accetta più nulla", () => {
    const l = new OutputLimiter(10);
    l.push("123456");
    expect(l.push("789012")).toEqual({ text: "7890", truncated: true });
    expect(l.truncated).toBe(true);
    expect(l.push("altro")).toEqual({ text: "", truncated: true });
    expect(l.total).toBe(10);
  });

  it("accetta un blocco lungo quanto il limite senza troncare", () => {
    const l = new OutputLimiter(5);
    expect(l.push("12345").truncated).toBe(false);
    expect(l.push("6").truncated).toBe(true);
  });

  it("conta anche i caratteri aggiunti a mano", () => {
    const l = new OutputLimiter(5);
    l.add(4);
    expect(l.push("abc")).toEqual({ text: "a", truncated: true });
  });
});

describe("createWatchdog", () => {
  function fakeScheduler() {
    let fn: (() => void) | null = null;
    const s: Scheduler = {
      setTimeout: (f) => {
        fn = f;
        return 1;
      },
      clearTimeout: () => {
        fn = null;
      },
    };
    return { s, fire: () => fn?.() };
  }

  it("usa 5 secondi come limite predefinito", () => {
    expect(TIME_LIMIT_MS).toBe(5000);
  });

  it("scatta se il programma non finisce", () => {
    const { s, fire } = fakeScheduler();
    const onTimeout = vi.fn();
    const w = createWatchdog(onTimeout, 5000, s);
    w.start();
    expect(w.running).toBe(true);
    fire();
    expect(onTimeout).toHaveBeenCalledTimes(1);
    expect(w.running).toBe(false);
  });

  it("non scatta se si ferma in tempo", () => {
    const { s, fire } = fakeScheduler();
    const onTimeout = vi.fn();
    const w = createWatchdog(onTimeout, 5000, s);
    w.start();
    w.stop();
    fire();
    expect(onTimeout).not.toHaveBeenCalled();
  });
});

describe("explainPythonError", () => {
  const tb = (last: string) => `Traceback (most recent call last):\n  File "<esercizio>", line 3, in <module>\n${last}\n`;

  it("SyntaxError", () => {
    const r = explainPythonError('  File "<esercizio>", line 2\n    print("a"\n         ^\nSyntaxError: \'(\' was never closed\n');
    expect(r?.name).toBe("SyntaxError");
    expect(r?.text).toContain("riga 2");
    expect(r?.text).toContain("due punti");
  });

  it("IndentationError distingue i casi", () => {
    expect(explainPythonError(tb("IndentationError: expected an indented block after 'if' statement on line 1"))?.text).toContain("4 spazi");
    expect(explainPythonError(tb("IndentationError: unexpected indent"))?.text).toContain("allineala");
  });

  it("NameError cita il nome", () => {
    const r = explainPythonError(tb("NameError: name 'etá' is not defined"));
    expect(r?.text).toContain("«etá»");
  });

  it("TypeError su testo + numero", () => {
    const r = explainPythonError(tb('TypeError: can only concatenate str (not "int") to str'));
    expect(r?.text).toContain("str(numero)");
  });

  it("ZeroDivisionError", () => {
    expect(explainPythonError(tb("ZeroDivisionError: division by zero"))?.text).toContain("zero");
  });

  it("IndexError", () => {
    expect(explainPythonError(tb("IndexError: list index out of range"))?.text).toContain("partono da 0");
  });

  it("errori sconosciuti o niente errore: nessun suggerimento", () => {
    expect(explainPythonError(tb("KeyError: 'x'"))).toBeNull();
    expect(explainPythonError("")).toBeNull();
  });

  it("prende l'ultimo errore se ce n'è una catena", () => {
    const r = explainPythonError(`${tb("ZeroDivisionError: division by zero")}\nDuring handling...\n${tb("NameError: name 'q' is not defined")}`);
    expect(r?.name).toBe("NameError");
  });
});
