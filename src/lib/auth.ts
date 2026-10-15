import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import { getDb, schema } from "./db";
import { sendMail } from "./email";
import { magicLinkEmail, verificationEmail } from "./mail/templates";

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
    emailAndPassword: { enabled: true, minPasswordLength: 10 },
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
    plugins: [
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
