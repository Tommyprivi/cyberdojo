import { describe, expect, it } from "vitest";
import {
  ARP_BANK,
  BANKS,
  ENCAPSULATION_BANK,
  hexByteToDecimal,
  ipPrivatePublic,
  ipValid,
  OSI_BANK,
  PACKET_BASICS,
  type BankItem,
} from "./banks";
import { GENERATORS, isGeneratorId, parseChoiceAnswer } from "./generators";
import { isPrivate } from "./ip";

const ALL: Record<string, readonly BankItem[]> = {
  "packet-basics": PACKET_BASICS,
  "arp-concepts": ARP_BANK,
  "osi-layers": OSI_BANK,
  encapsulation: ENCAPSULATION_BANK,
};

describe("banche di domande", () => {
  for (const [name, items] of Object.entries(ALL)) {
    describe(name, () => {
      it("ha abbastanza domande per più tentativi", () => {
        expect(items.length).toBeGreaterThanOrEqual(8);
      });

      it("ogni domanda ha una sola risposta giusta e opzioni distinte", () => {
        for (const it of items) {
          const options = [it.ok, ...it.no];
          expect(new Set(options).size, it.q).toBe(options.length);
          expect(it.no.includes(it.ok), it.q).toBe(false);
          expect(it.q.length).toBeGreaterThan(10);
        }
      });

      it("non ripete la stessa domanda", () => {
        expect(new Set(items.map((i) => i.q)).size).toBe(items.length);
      });
    });
  }

  it("genera domande valide: la risposta indicata è proprio l'opzione giusta", () => {
    for (const [name, items] of Object.entries(ALL)) {
      const gen = BANKS[name as keyof typeof BANKS];
      for (let s = 0; s < 60; s++) {
        const qs = gen(`seme-${s}`, 5);
        expect(qs).toHaveLength(5);
        expect(new Set(qs.map((q) => q.prompt)).size).toBe(5); // nessuna domanda ripetuta nel tentativo
        for (const q of qs) {
          const item = items.find((i) => i.q === q.prompt)!;
          expect(q.choices![q.answer]).toBe(item.ok);
        }
      }
    }
  });

  it("è deterministico, cambia col seme e la posizione giusta non è sempre la stessa", () => {
    const gen = BANKS["osi-layers"];
    expect(gen("a")).toEqual(gen("a"));
    expect(gen("a")).not.toEqual(gen("b"));
    const positions = new Set(Array.from({ length: 40 }, (_, s) => gen(`p${s}`, 5).map((q) => q.answer)).flat());
    expect(positions.size).toBeGreaterThan(1);
  });
});

describe("ipValid", () => {
  // Verifica indipendente: quattro numeri interi da 0 a 255, senza altro.
  const reference = (s: string) => {
    const p = s.split(".");
    return p.length === 4 && p.every((x) => /^\d{1,3}$/.test(x) && Number(x) <= 255);
  };

  it("la risposta coincide con una verifica indipendente", () => {
    let valid = 0;
    let invalid = 0;
    for (let s = 0; s < 300; s++) {
      for (const q of ipValid(`v${s}`)) {
        const isValid = reference(q.data);
        expect(q.choices).toEqual(["Valido", "Non valido"]);
        expect(q.answer, q.data).toBe(isValid ? 0 : 1);
        if (isValid) valid++;
        else invalid++;
      }
    }
    expect(valid).toBeGreaterThan(300); // entrambi i casi compaiono in quantità
    expect(invalid).toBeGreaterThan(300);
  });
});

describe("ipPrivatePublic", () => {
  it("la risposta coincide con le tre reti private", () => {
    for (let s = 0; s < 200; s++) {
      for (const q of ipPrivatePublic(`pp${s}`)) {
        const octets = q.data.split(".").map(Number);
        expect(q.answer, q.data).toBe(isPrivate(octets) ? 0 : 1);
      }
    }
  });
});

describe("hexByteToDecimal", () => {
  it("il dato esadecimale corrisponde alla risposta", () => {
    for (let s = 0; s < 100; s++) {
      const qs = hexByteToDecimal(`h${s}`);
      expect(new Set(qs.map((q) => q.answer)).size).toBe(5);
      for (const q of qs) {
        expect(q.data).toMatch(/^[0-9A-F]{2}$/);
        expect(parseInt(q.data, 16)).toBe(q.answer);
      }
    }
  });
});

describe("registro dei generatori", () => {
  it("ogni generatore è riconosciuto e produce domande", () => {
    for (const id of Object.keys(GENERATORS)) {
      expect(isGeneratorId(id)).toBe(true);
      const qs = GENERATORS[id as keyof typeof GENERATORS].generate("x", 5);
      expect(qs).toHaveLength(5);
    }
  });

  it("parseChoiceAnswer accetta solo una cifra", () => {
    expect(parseChoiceAnswer("2")).toBe(2);
    expect(parseChoiceAnswer(" 0 ")).toBe(0);
    for (const bad of ["", "12", "a", "-1", "1.5"]) expect(parseChoiceAnswer(bad)).toBeNull();
  });
});
