import { and, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { SecuritySettings } from "./security-settings";

/** Chi ha una password può attivare il 2FA; chi entra solo con Google o col link no (vedi docs/2fa.md). */
async function hasPasswordLogin(userId: string): Promise<boolean> {
  const [row] = await getDb()
    .select({ password: schema.account.password })
    .from(schema.account)
    .where(and(eq(schema.account.userId, userId), eq(schema.account.providerId, "credential")))
    .limit(1);
  return Boolean(row?.password);
}

export async function SecuritySection({ userId, email, enabled }: { userId: string; email: string; enabled: boolean }) {
  return <SecuritySettings enabled={enabled} hasPassword={await hasPasswordLogin(userId)} email={email} />;
}
