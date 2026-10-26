import { describe, expect, it } from "vitest";
import { checkMigration, dbHost } from "./migrate-guard";

const PROD = "ep-prod-123.eu-central-1.aws.neon.tech";
const DEV = "ep-dev-456.eu-central-1.aws.neon.tech";
const url = (host: string) => `postgresql://owner:pw@${host}/neondb?sslmode=require`;
const now = new Date("2026-11-02T10:00:00");
const today = new Date("2026-11-02T08:30:00").getTime();
const yesterday = new Date("2026-11-01T22:00:00").getTime();

describe("dbHost", () => {
  it("estrae il nome del server", () => {
    expect(dbHost(url(DEV))).toBe(DEV);
  });

  it("toglie il suffisso -pooler, così pooler e diretto sono lo stesso database", () => {
    expect(dbHost(url("ep-prod-123-pooler.eu-central-1.aws.neon.tech"))).toBe(PROD);
  });

  it("restituisce null con un indirizzo non valido", () => {
    expect(dbHost("boh")).toBeNull();
    expect(dbHost("")).toBeNull();
  });
});

describe("checkMigration", () => {
  it("fa partire le migrazioni sul database di sviluppo", () => {
    expect(checkMigration({ url: url(DEV), prodHost: PROD, prod: false, now })).toEqual({ ok: true, host: DEV });
  });

  it("rifiuta senza indirizzo del database", () => {
    expect(checkMigration({ url: "", prodHost: PROD, prod: false, now }).ok).toBe(false);
  });

  it("rifiuta se non è dichiarato quale sia il database di produzione", () => {
    const r = checkMigration({ url: url(DEV), prodHost: undefined, prod: false, now });
    expect(r.ok).toBe(false);
    expect(r.ok === false && r.reason).toContain("PRODUCTION_DB_HOST");
  });

  it("rifiuta il database di produzione senza il comando apposta", () => {
    const r = checkMigration({ url: url(PROD), prodHost: PROD, prod: false, now });
    expect(r.ok).toBe(false);
    expect(r.ok === false && r.reason).toContain("produzione");
  });

  it("riconosce la produzione anche con l'indirizzo del pooler", () => {
    const r = checkMigration({ url: url("ep-prod-123-pooler.eu-central-1.aws.neon.tech"), prodHost: PROD, prod: false, now });
    expect(r.ok).toBe(false);
  });

  it("la produzione richiede una copia di sicurezza fatta oggi", () => {
    expect(checkMigration({ url: url(PROD), prodHost: PROD, prod: true, now }).ok).toBe(false);
    expect(checkMigration({ url: url(PROD), prodHost: PROD, prod: true, backupModifiedAt: yesterday, now }).ok).toBe(false);
    expect(checkMigration({ url: url(PROD), prodHost: PROD, prod: true, backupModifiedAt: today, now })).toEqual({ ok: true, host: PROD });
  });

  it("il comando di produzione non parte su un database che non è la produzione", () => {
    const r = checkMigration({ url: url(DEV), prodHost: PROD, prod: true, backupModifiedAt: today, now });
    expect(r.ok).toBe(false);
  });
});
