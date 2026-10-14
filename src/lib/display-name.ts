/**
 * Nome da mostrare. Chi entra col link magico non ha scritto un nome: si usa la parte
 * dell'email prima della chiocciola, così nessuno viene salutato con uno spazio vuoto.
 */
export function displayName(user: { name?: string | null; email: string }): string {
  const name = user.name?.trim();
  return name || user.email.split("@")[0];
}

export function firstName(user: { name?: string | null; email: string }): string {
  return displayName(user).split(/\s+/)[0];
}
