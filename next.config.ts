import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Le illustrazioni a tutto schermo si servono a qualità alta, il resto al livello predefinito.
  images: { qualities: [75, 95] },
  // Le lezioni si leggono dalla cartella content/ a runtime: va inclusa nel pacchetto che Vercel pubblica.
  outputFileTracingIncludes: { "/**": ["./content/**/*"] },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
