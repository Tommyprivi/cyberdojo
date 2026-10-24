import { describe, expect, it } from "vitest";
import { buildReportEmail } from "./report-mail";

describe("email di segnalazione", () => {
  const mail = buildReportEmail({ kind: "user", targetId: "abcd2345efgh", reason: "molestie", reportId: "r-1", at: new Date("2026-10-24T10:00:00Z") });

  it("contiene solo tipo, identificativo, motivo, data e numero", () => {
    expect(mail.text).toContain("abcd2345efgh");
    expect(mail.text).toContain("Mi dà fastidio o mi molesta");
    expect(mail.text).toContain("2026-10-24T10:00:00.000Z");
    expect(mail.subject).toBe("Segnalazione social: soprannome");
  });

  it("non ha né indirizzi email né link verso altri siti", () => {
    expect(`${mail.text} ${mail.html}`).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
    expect(mail.html).not.toMatch(/https?:\/\//);
  });

  it("per un gruppo cambia il tipo", () => {
    expect(buildReportEmail({ kind: "group", targetId: "g1", reason: "sicurezza", reportId: "r-2", at: new Date() }).subject).toBe("Segnalazione social: gruppo");
  });
});
