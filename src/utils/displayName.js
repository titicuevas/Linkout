/**
 * Nombre visible para saludo/perfil.
 * Prioriza perfil → metadata → parte local del email.
 */
export function getDisplayName(profile, user) {
  const fromProfile = typeof profile?.nombre === 'string' ? profile.nombre.trim() : '';
  if (fromProfile) return fromProfile;

  const fromMeta = typeof user?.user_metadata?.nombre === 'string'
    ? user.user_metadata.nombre.trim()
    : '';
  if (fromMeta) return fromMeta;

  const email = typeof user?.email === 'string' ? user.email.trim() : '';
  if (!email) return 'tú';

  const local = email.split('@')[0]?.trim();
  return local || email;
}
