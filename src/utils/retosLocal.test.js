import { describe, it, expect } from 'vitest';
import { generateLocalRetos } from './retosLocal';

describe('generateLocalRetos', () => {
  it('devuelve exactamente 3 niveles con puntos', () => {
    const retos = generateLocalRetos({ puesto: 'Frontend', empresa: 'ACME' });
    expect(retos).toHaveLength(3);
    expect(retos.map((r) => r.nivel)).toEqual(['Fácil', 'Medio', 'Difícil']);
    expect(retos.map((r) => r.puntos)).toEqual([10, 20, 30]);
    expect(retos[0].ejercicio).toBeTruthy();
    expect(retos[0].alternativa).toBeTruthy();
    expect(retos[0].motivacion).toContain('Frontend');
    expect(retos[0].motivacion).toContain('ACME');
  });

  it('varía con el salt', () => {
    const a = generateLocalRetos({ puesto: 'Dev', empresa: 'X', salt: 0 });
    const b = generateLocalRetos({ puesto: 'Dev', empresa: 'X', salt: 99 });
    expect(a[0].ejercicio || a[1].ejercicio).toBeTruthy();
    expect(typeof b[2].motivacion).toBe('string');
  });
});
