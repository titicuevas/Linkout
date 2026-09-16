import { supabase } from '../services/supabase';

const TOUCH_KEY = 'linkout_last_seen_touch';
const MIN_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Actualiza profiles.last_seen_at como máximo cada 5 minutos por pestaña.
 */
export async function touchLastSeen(userId) {
  if (!userId || typeof window === 'undefined') return;

  try {
    const raw = sessionStorage.getItem(TOUCH_KEY);
    const last = raw ? Number(raw) : 0;
    if (Number.isFinite(last) && Date.now() - last < MIN_INTERVAL_MS) return;

    sessionStorage.setItem(TOUCH_KEY, String(Date.now()));
    await supabase
      .from('profiles')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('id', userId);
  } catch {
    // No bloquear la app si falla el heartbeat
  }
}
