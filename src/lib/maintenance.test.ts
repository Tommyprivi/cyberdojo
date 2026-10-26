import { describe, expect, it } from "vitest";
import { allowedDuringMaintenance, decideMaintenance, maintenanceActive, startedCourses } from "./maintenance";

const T = Date.parse("2026-10-26T18:00:00Z");
const cfg = { endsAt: "2026-10-26T18:00:00Z", maintenance: true };

describe("maintenanceActive", () => {
  it("non è attiva prima dello scadere del timer", () => {
    expect(maintenanceActive(cfg, T - 1)).toBe(false);
  });

  it("si attiva allo scadere del timer", () => {
    expect(maintenanceActive(cfg, T)).toBe(true);
    expect(maintenanceActive(cfg, T + 60_000)).toBe(true);
  });

  it("senza interruttore non si attiva mai", () => {
    expect(maintenanceActive({ endsAt: cfg.endsAt }, T + 1)).toBe(false);
    expect(maintenanceActive({ ...cfg, maintenance: false }, T + 1)).toBe(false);
  });

  it("con una data non valida non blocca nessuno", () => {
    expect(maintenanceActive({ endsAt: "boh", maintenance: true }, T + 1)).toBe(false);
    expect(maintenanceActive({ maintenance: true }, T + 1)).toBe(false);
  });
});

describe("decideMaintenance", () => {
  const on = T + 1;

  it("lascia passare tutto se la manutenzione non è attiva", () => {
    expect(decideMaintenance("/percorso", cfg, T - 1, false)).toBe("pass");
  });

  it("mostra la pagina di manutenzione sulle pagine chiuse", () => {
    expect(decideMaintenance("/", cfg, on, false)).toBe("page");
    expect(decideMaintenance("/percorso", cfg, on, false)).toBe("page");
    expect(decideMaintenance("/pratica", cfg, on, false)).toBe("page");
    expect(decideMaintenance("/social", cfg, on, false)).toBe("page");
  });

  it("risponde 503 sulle API chiuse", () => {
    expect(decideMaintenance("/api/dojo", cfg, on, false)).toBe("api");
  });

  it("lascia passare manutenzione, accesso, autenticazione e promemoria", () => {
    expect(decideMaintenance("/manutenzione", cfg, on, false)).toBe("pass");
    expect(decideMaintenance("/accedi", cfg, on, false)).toBe("pass");
    expect(decideMaintenance("/api/auth/sign-in/email", cfg, on, false)).toBe("pass");
    expect(decideMaintenance("/api/cron/reminders", cfg, on, false)).toBe("pass");
  });

  it("le lezioni passano, ma la pagina deve controllare il corso", () => {
    expect(decideMaintenance("/lezione/F.01.001", cfg, on, false)).toBe("lessons");
  });

  it("chi ha l'accesso riservato passa sempre", () => {
    expect(decideMaintenance("/percorso", cfg, on, true)).toBe("pass");
    expect(decideMaintenance("/api/dojo", cfg, on, true)).toBe("pass");
    expect(decideMaintenance("/lezione/F.01.001", cfg, on, true)).toBe("pass");
  });

  it("non scambia per esenti percorsi che somigliano soltanto", () => {
    expect(decideMaintenance("/manutenzione-finta", cfg, on, false)).toBe("page");
    expect(decideMaintenance("/api/cronaca", cfg, on, false)).toBe("api");
    expect(decideMaintenance("/lezioni", cfg, on, false)).toBe("page");
    expect(decideMaintenance("/accedi-qui", cfg, on, false)).toBe("page");
  });
});

describe("corsi iniziati", () => {
  const catalog = [
    { id: "F.01.001", course: "fondamenta" },
    { id: "F.01.002", course: "fondamenta" },
    { id: "C.01.001", course: "cybersecurity" },
    { id: "D.01.001", course: "dati" },
  ];

  it("un corso è iniziato se hai completato almeno una sua lezione", () => {
    expect([...startedCourses(new Set(["F.01.001"]), catalog)]).toEqual(["fondamenta"]);
  });

  it("senza lezioni completate non hai corsi iniziati", () => {
    expect(startedCourses(new Set(), catalog).size).toBe(0);
  });

  it("ignora lezioni che non esistono più", () => {
    expect(startedCourses(new Set(["X.99.999"]), catalog).size).toBe(0);
  });

  it("permette solo le lezioni del corso iniziato", () => {
    const done = new Set(["F.01.001"]);
    expect(allowedDuringMaintenance("F.01.002", done, catalog)).toBe(true);
    expect(allowedDuringMaintenance("C.01.001", done, catalog)).toBe(false);
  });

  it("chi ha iniziato più corsi può continuarli tutti", () => {
    const done = new Set(["F.01.001", "D.01.001"]);
    expect(allowedDuringMaintenance("D.01.001", done, catalog)).toBe(true);
    expect(allowedDuringMaintenance("C.01.001", done, catalog)).toBe(false);
  });

  it("una lezione inesistente non è permessa", () => {
    expect(allowedDuringMaintenance("X.99.999", new Set(["F.01.001"]), catalog)).toBe(false);
  });
});
