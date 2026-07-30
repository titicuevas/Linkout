import { supabase } from './supabase';
import { buildFollowUpUpdate } from '../pages/candidaturas/shared';

/**
 * Persiste un seguimiento manual (fecha + historial).
 * @returns {{ error: Error|null, payload: object }}
 */
export async function markCandidaturaFollowUp(candidatura, { userId } = {}) {
  const payload = buildFollowUpUpdate(candidatura);
  let query = supabase
    .from('candidaturas')
    .update(payload)
    .eq('id', candidatura.id);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { error } = await query;
  return { error, payload };
}
