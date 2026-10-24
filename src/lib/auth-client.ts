import { magicLinkClient, twoFactorClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

/** Client di accesso per i componenti nel browser (stessa origine del sito). */
export const authClient = createAuthClient({ plugins: [magicLinkClient(), twoFactorClient()] });
