/**
 * Strumenti interni (revisione video, anteprima delle email, anteprima delle interfacce): visibili in
 * sviluppo, chiusi in produzione salvo ENABLE_INTERNAL_TOOLS=1. Non contengono dati degli studenti,
 * ma non c'è motivo di mostrarli al pubblico.
 */
export const internalToolsEnabled = () =>
  process.env.NODE_ENV !== "production" || process.env.ENABLE_INTERNAL_TOOLS === "1";
