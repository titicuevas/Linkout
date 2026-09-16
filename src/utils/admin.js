/**
 * Emails con acceso al panel de administración (UI).
 * La autorización real está en las RPC de Supabase (is_linkout_admin).
 */
export function getAdminEmails() {
  const fromEnv = import.meta.env.VITE_ADMIN_EMAILS;
  const listed = typeof fromEnv === 'string' && fromEnv.trim()
    ? fromEnv.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
    : [];

  const defaults = ['enriquecuevas1989@gmail.com'];
  return [...new Set([...defaults, ...listed])];
}

export function isAdminUser(user) {
  const email = typeof user?.email === 'string' ? user.email.trim().toLowerCase() : '';
  if (!email) return false;
  return getAdminEmails().includes(email);
}
