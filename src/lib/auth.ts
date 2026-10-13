import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import { getDb, schema } from "./db";
import { sendEmail } from "./email";

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
    socialProviders: google,
    plugins: [
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          await sendEmail({
            to: email,
            subject: "Il tuo link di accesso a CyberDojo",
            text: `Apri questo link per entrare (vale pochi minuti):\n\n${url}\n\nSe non l'hai chiesto tu, ignora questa email.`,
          });
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
