/** Chi è dello staff: riga in staff_roles oppure email verificata nella variabile STAFF_EMAILS. Logica pura, senza database. */

export function parseStaffEmails(raw: string | undefined | null): string[] {
  return (raw ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isStaffUser(input: {
  hasRole: boolean;
  email: string | null | undefined;
  emailVerified: boolean;
  staffEmails: string | undefined | null;
}): boolean {
  if (input.hasRole) return true;
  if (!input.emailVerified || !input.email) return false;
  return parseStaffEmails(input.staffEmails).includes(input.email.trim().toLowerCase());
}
