"use server";

import { z } from "zod";
import { savePortfolioSettings } from "@/lib/portfolio/service";
import { getSessionUser } from "@/lib/session";

const input = z.object({ enabled: z.boolean(), showCertificates: z.boolean(), showBelt: z.boolean() });

/** Salva le scelte del portfolio. L'utente viene dalla sessione, mai dal browser; età e soprannome si ricontrollano sul server. */
export async function savePortfolio(raw: unknown): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sessione scaduta: accedi di nuovo." };
  const p = input.safeParse(raw);
  if (!p.success) return { ok: false, error: "Dati non validi." };
  return savePortfolioSettings(user.id, p.data);
}
