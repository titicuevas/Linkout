export function mapAuthErrorMessage(error, fallback = 'Ha ocurrido un error. Inténtalo de nuevo.') {
  const raw = error?.message || '';
  const message = raw.toLowerCase();

  if (message.includes('invalid login credentials')) {
    return 'Correo o contraseña incorrectos.';
  }

  if (message.includes('user not found')) {
    return 'El correo no está registrado.';
  }

  if (message.includes('already registered') || message.includes('already exists')) {
    return 'El correo ya está registrado. Inicia sesión.';
  }

  if (message.includes('email not confirmed')) {
    return 'Tu correo aún no está confirmado. Revisa tu bandeja de entrada.';
  }

  if (message.includes('password should be at least')) {
    return 'La contraseña debe tener al menos 8 caracteres.';
  }

  if (message.includes('unable to validate email address') || message.includes('invalid email')) {
    return 'Introduce un correo electrónico válido.';
  }

  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Demasiados intentos en poco tiempo. Espera un momento y vuelve a intentarlo.';
  }

  if (message.includes('error sending confirmation') || message.includes('error sending magiclink') || message.includes('error sending recovery')) {
    return 'No se pudo enviar el correo (SMTP). Revisa en Supabase el SMTP de Resend: sender con dominio verificado, host smtp.resend.com, usuario "resend" y API key válida.';
  }

  if (message.includes('network') || message.includes('fetch')) {
    return 'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.';
  }

  return raw || fallback;
}
