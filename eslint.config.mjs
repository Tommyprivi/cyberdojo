import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // File statici copiati o scritti a mano (worker, PGlite): non si controllano con eslint.
    "public/**",
    // Materiali di terze parti vendutati (skill, agenti): non sono codice del progetto.
    ".agents/**",
    ".claude/**",
  ]),
]);

export default eslintConfig;
