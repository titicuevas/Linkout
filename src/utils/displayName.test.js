import { describe, expect, it } from 'vitest';
import { getDisplayName } from './displayName';

describe('getDisplayName', () => {
  it('prioriza el nombre del perfil', () => {
    expect(getDisplayName({ nombre: 'Henry' }, { email: 'demo@demo.es', user_metadata: { nombre: 'Meta' } })).toBe('Henry');
  });

  it('usa metadata si no hay perfil', () => {
    expect(getDisplayName(null, { email: 'demo@demo.es', user_metadata: { nombre: 'Alex' } })).toBe('Alex');
  });

  it('usa la parte local del email como fallback', () => {
    expect(getDisplayName({}, { email: 'demo@demo.es' })).toBe('demo');
  });

  it('devuelve tú si no hay datos', () => {
    expect(getDisplayName(null, null)).toBe('tú');
  });
});
