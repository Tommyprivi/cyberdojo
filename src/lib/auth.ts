import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware, isAPIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { magicLink, twoFactor } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { getDb, schema } from "./db";
import { sendMail } from "./email";
import { magicLinkEmail, passwordResetEmail, twoFactorChangedEmail, verificationEmail } from "./mail/templates";
import { classifyCode } from "./two-factor";

let instance: ReturnType<typeof create> | undefined;

function create() {
  const google =
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : undefined;

  return betterAuth({
    database: drizzleAdapter(getDb(), { provider: "pg", schema }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 10,
      resetPasswordTokenExpiresIn: 3600,
      sendResetPassword: async ({ user, url }) => {
        await sendMail({ to: user.email, mail: passwordResetEmail({ name: user.name, email: user.email, url }) });
      },
    },
    // La conferma dell'email parte alla registrazione ma NON blocca l'accesso: serve ad attivare
    // i promemoria di studio, così nessuno riceve messaggi per un indirizzo scritto male.
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        await sendMail({ to: user.email, mail: verificationEmail({ name: user.name, email: user.email, url }) });
      },
    },
    socialProviders: google,
    // Verifica in due passaggi: vedi docs/2fa.md. Il gancio di Better Auth chiede il secondo codice solo
    // dopo `/sign-in/email`. Per questo qui sotto si impedisce che link magico, Google e il link di
    // conferma email aprano una sessione a chi ha il 2FA attivo: sarebbero porte che lo aggirano.
    databaseHooks: {
      session: {
        create: {
          before: async (session, context) => {
            const path = context?.path ?? "";
            const withoutPassword =
              path.startsWith("/magic-link/verify") ||
              path.startsWith("/callback/") ||
              path.startsWith("/sign-in/social") ||
              path.startsWith("/verify-email");
            if (!withoutPassword) return;
            const [row] = await getDb()
              .select({ on: schema.user.twoFactorEnabled })
              .from(schema.user)
              .where(eq(schema.user.id, session.userId))
              .limit(1);
            if (row?.on) return false; // nessuna sessione: l'utente torna alla pagina di accesso con un avviso
          },
        },
      },
    },
    hooks: {
      // Disattivare il 2FA richiede la password (controllata dal plugin) E un codice valido (controllato qui).
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path !== "/two-factor/disable") return;
        const raw = (ctx.body as { code?: unknown } | undefined)?.code;
        const code = typeof raw === "string" ? raw : "";
        const kind = classifyCode(code);
        const api = getAuth().api;
        if (kind === "totp") await api.verifyTOTP({ body: { code: code.replace(/[\s-]/g, "") }, headers: ctx.headers });
        else if (kind === "backup") await api.verifyBackupCode({ body: { code: code.replace(/\s+/g, ""), disableSession: true }, headers: ctx.headers });
        else throw ctx.error("BAD_REQUEST", { message: "Invalid code", code: "INVALID_CODE" });
      }),
      // Email di avviso quando il 2FA viene attivato (primo codice confermato) o disattivato.
      after: createAuthMiddleware(async (ctx) => {
        const returned = ctx.context.returned;
        if (isAPIError(returned) || returned instanceof Error) return;
        const user = ctx.context.session?.user;
        if (!user) return;
        let enabled: boolean | null = null;
        if (ctx.path === "/two-factor/disable") enabled = false;
        // Con una sessione già aperta e il 2FA ancora spento, un codice giusto significa «attivazione completata».
        else if (ctx.path === "/two-factor/verify-totp" && !user.twoFactorEnabled) enabled = true;
        if (enabled === null) return;
        try {
          await sendMail({ to: user.email, mail: twoFactorChangedEmail({ name: user.name, email: user.email, enabled }) });
        } catch (error) {
          // L'avviso è una cortesia di sicurezza: se l'invio fallisce, l'operazione già fatta non si annulla.
          console.error("[2fa] invio dell'email di avviso non riuscito", error instanceof Error ? error.message : "errore");
        }
      }),
    },
    plugins: [
      twoFactor({
        issuer: "CyberDojo",
        // Chiave e codici di recupero sono cifrati con BETTER_AUTH_SECRET prima di arrivare al database.
        backupCodeOptions: { storeBackupCodes: "encrypted", amount: 10, length: 10 },
        // «Ricorda questo dispositivo»: cookie firmato legato all'utente, 30 giorni, revocato alla disattivazione.
        trustDeviceMaxAge: 60 * 60 * 24 * 30,
        // Tempo per inserire il codice dopo la password: 10 minuti. Blocco dell'account dopo 10 errori di fila.
        twoFactorCookieMaxAge: 600,
        accountLockout: { enabled: true, maxFailedAttempts: 10, durationSeconds: 900 },
      }),
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          await sendMail({ to: email, mail: magicLinkEmail({ url }) });
        },
      }),
      nextCookies(), // deve restare ultimo
    ],
  });
}

// Lazy: serve DATABASE_URL solo quando arriva una richiesta di auth.
export function getAuth() {
  return (instance ??= create());
}
