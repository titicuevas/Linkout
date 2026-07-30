/**
 * Claves de localStorage centralizadas (prefijo linkout_).
 * Los helpers de retos migran claves legacy sin prefijo.
 */

export const STORAGE_KEYS = {
  candidaturasPrefs: 'linkout_candidaturas_prefs',
  candidaturasSavedViews: 'linkout_candidaturas_saved_views',
  candidaturaDraft: 'linkout_candidatura_draft',
  desahogoDraft: 'linkout_desahogo_draft',
};

export function retoCompletadoKey(id) {
  return `linkout_reto_completado_${id}`;
}

export function retoLibreCompletadoKey(day) {
  return `linkout_reto_completado_libre_${day}`;
}

function legacyRetoCompletadoKey(id) {
  return `reto_completado_${id}`;
}

function legacyRetoLibreKey(day) {
  return `reto_completado_libre_${day}`;
}

export function isRetoCompletado(id, storage = localStorage) {
  const next = retoCompletadoKey(id);
  const legacy = legacyRetoCompletadoKey(id);
  if (storage.getItem(next)) return true;
  const legacyValue = storage.getItem(legacy);
  if (!legacyValue) return false;
  storage.setItem(next, legacyValue);
  storage.removeItem(legacy);
  return true;
}

export function setRetoCompletado(id, storage = localStorage) {
  storage.setItem(retoCompletadoKey(id), '1');
  storage.removeItem(legacyRetoCompletadoKey(id));
}

export function clearRetoCompletado(id, storage = localStorage) {
  storage.removeItem(retoCompletadoKey(id));
  storage.removeItem(legacyRetoCompletadoKey(id));
}

export function isRetoLibreCompletado(day, storage = localStorage) {
  const next = retoLibreCompletadoKey(day);
  const legacy = legacyRetoLibreKey(day);
  if (storage.getItem(next)) return true;
  const legacyValue = storage.getItem(legacy);
  if (!legacyValue) return false;
  storage.setItem(next, legacyValue);
  storage.removeItem(legacy);
  return true;
}

export function setRetoLibreCompletado(day, storage = localStorage) {
  storage.setItem(retoLibreCompletadoKey(day), '1');
  storage.removeItem(legacyRetoLibreKey(day));
}

/** Borra claves de reto completado (prefijo nuevo y legacy). */
export function clearAllRetoCompletadoKeys(storage = localStorage) {
  Object.keys(storage)
    .filter((key) => key.startsWith('linkout_reto_completado_') || key.startsWith('reto_completado_'))
    .forEach((key) => storage.removeItem(key));
}
