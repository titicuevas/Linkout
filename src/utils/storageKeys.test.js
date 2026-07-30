import { describe, it, expect } from 'vitest';
import {
  STORAGE_KEYS,
  retoCompletadoKey,
  isRetoCompletado,
  setRetoCompletado,
  clearRetoCompletado,
  isRetoLibreCompletado,
  setRetoLibreCompletado,
  clearAllRetoCompletadoKeys,
} from './storageKeys';

function createMemoryStorage(seed = {}) {
  const data = { ...seed };
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
    },
    setItem(key, value) {
      data[key] = String(value);
    },
    removeItem(key) {
      delete data[key];
    },
    _data: data,
  };
}

describe('storageKeys', () => {
  it('expone claves con prefijo linkout_', () => {
    expect(STORAGE_KEYS.desahogoDraft).toBe('linkout_desahogo_draft');
    expect(retoCompletadoKey('abc')).toBe('linkout_reto_completado_abc');
  });

  it('migra clave legacy de reto completado', () => {
    const store = createMemoryStorage({ reto_completado_x1: '1' });
    expect(isRetoCompletado('x1', store)).toBe(true);
    expect(store.getItem('linkout_reto_completado_x1')).toBe('1');
    expect(store.getItem('reto_completado_x1')).toBe(null);
  });

  it('set/clear reto completado', () => {
    const store = createMemoryStorage();
    setRetoCompletado('z9', store);
    expect(isRetoCompletado('z9', store)).toBe(true);
    clearRetoCompletado('z9', store);
    expect(isRetoCompletado('z9', store)).toBe(false);
  });

  it('migra y marca reto libre', () => {
    const store = createMemoryStorage({ 'reto_completado_libre_2026-07-30': '1' });
    expect(isRetoLibreCompletado('2026-07-30', store)).toBe(true);
    setRetoLibreCompletado('2026-07-31', store);
    expect(isRetoLibreCompletado('2026-07-31', store)).toBe(true);
  });

  it('clearAllRetoCompletadoKeys borra nuevas y legacy', () => {
    const store = createMemoryStorage({
      linkout_reto_completado_a: '1',
      reto_completado_b: '1',
      other: 'keep',
    });
    // Object.keys(storage) en localStorage enumera las claves; aquí adaptamos:
    const enumerable = {
      ...store._data,
      getItem: store.getItem.bind(store),
      setItem: store.setItem.bind(store),
      removeItem(key) {
        store.removeItem(key);
        delete this[key];
      },
    };
    clearAllRetoCompletadoKeys(enumerable);
    expect(enumerable.linkout_reto_completado_a).toBeUndefined();
    expect(enumerable.reto_completado_b).toBeUndefined();
    expect(enumerable.other).toBe('keep');
  });
});
