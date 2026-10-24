import { sendMail } from "../email";
import { renderHtml, renderText, type EmailContent } from "../mail/layout";
import { REPORT_REASONS, type ReportReason } from "./rules";

/**
 * Email di segnalazione per il titolare. Contiene SOLO: tipo, identificativo pubblico dell'elemento,
 * motivo (elenco chiuso), data. Nessun dato personale: né di chi segnala, né di chi è segnalato
 * (per trovare la persona si usa l'identificativo nella tabella social_profiles).
 */
export function buildReportEmail(r: { kind: "user" | "group"; targetId: string; reason: ReportReason; reportId: string; at: Date }) {
  const reasonLabel = REPORT_REASONS.find((x) => x.id === r.reason)?.label ?? r.reason;
  const content: EmailContent = {
    subject: `Segnalazione social: ${r.kind === "group" ? "gruppo" : "soprannome"}`,
    preheader: "Una segnalazione nel lato social di CyberDojo.",
    title: "Nuova segnalazione",
    blocks: [
      { type: "p", text: `Tipo: ${r.kind === "group" ? "gruppo" : "utente (soprannome)"}` },
      { type: "p", text: `Identificativo pubblico: ${r.targetId}` },
      { type: "p", text: `Motivo: ${reasonLabel}` },
      { type: "p", text: `Data: ${r.at.toISOString()}` },
      { type: "p", text: `Segnalazione n.: ${r.reportId}` },
      {
        type: "note",
        text:
          r.kind === "group"
            ? "Per verificare: tabella study_groups, colonna id."
            : "Per verificare: tabella social_profiles, colonna public_id. Se serve, scollega il soprannome (nickname = null) e spegni i consensi.",
      },
    ],
    footer: [{ text: "Messaggio automatico del lato social di CyberDojo. Non contiene dati personali." }],
  };
  return { subject: content.subject, html: renderHtml(content), text: renderText(content) };
}

/** Manda la segnalazione a CONTACT_EMAIL (come il modulo di contatto). Un errore di invio non annulla la segnalazione. */
export async function sendReportEmail(r: Parameters<typeof buildReportEmail>[0]): Promise<void> {
  try {
    await sendMail({
      to: process.env.CONTACT_EMAIL?.trim() || process.env.EMAIL_FROM?.match(/<(.+)>/)?.[1]?.trim() || "",
      mail: buildReportEmail(r),
    });
  } catch (e) {
    console.error("Invio dell'email di segnalazione non riuscito:", e instanceof Error ? e.message : e);
  }
}
