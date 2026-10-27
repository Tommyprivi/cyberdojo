import { describe, expect, it } from "vitest";
import { lessonWantsCalculator } from "./lesson-calculator";

describe("lessonWantsCalculator", () => {
  it("nei corsi di numeri c'è sempre", () => {
    for (const id of ["T.01.001", "H.05.003", "D.02.010", "B.03.001"]) expect(lessonWantsCalculator(id, "testo qualunque")).toBe(true);
  });

  it("una lezione senza calcoli non la mostra", () => {
    expect(lessonWantsCalculator("C.01.001", "La triade CIA: riservatezza, integrità e disponibilità. Un caso di phishing.")).toBe(false);
  });

  it("una sola parola isolata non basta", () => {
    expect(lessonWantsCalculator("F.03.002", "Calcola con calma il tempo che ti serve.")).toBe(false);
  });

  it("lezioni con subnet, binario o percentuali la mostrano", () => {
    expect(lessonWantsCalculator("F.06.004", "Per la subnet mask 255.255.255.0 devi convertire in binario ogni ottetto.")).toBe(true);
    expect(lessonWantsCalculator("F.01.003", "Il numero in binario e in esadecimale: ogni byte vale 8 bit.")).toBe(true);
    expect(lessonWantsCalculator("W.05.002", "Calcola la percentuale e applica la formula del margine.")).toBe(true);
  });

  it("ignora maiuscole e accenti", () => {
    expect(lessonWantsCalculator("P.02.001", "BINARIO e ESADECIMALE")).toBe(true);
  });
});
