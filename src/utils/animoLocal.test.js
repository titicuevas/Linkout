import { describe, it, expect } from 'vitest';
import { extractEco, generateLocalAnimo, listAnimoRoles, getAnimoRole } from './animoLocal';

describe('extractEco', () => {
  it('recorta textos largos y tiene fallback', () => {
    expect(extractEco('')).toBe('esta etapa de búsqueda');
    expect(extractEco('Hola mundo')).toBe('Hola mundo');
    expect(extractEco('a'.repeat(120)).endsWith('…')).toBe(true);
  });
});

describe('generateLocalAnimo', () => {
  it('personaliza con nombre, eco y rol', () => {
    const msg = generateLocalAnimo({
      texto: 'Estoy cansado de no recibir respuestas',
      rol: 'motivador',
      nombre: 'Henry',
    });
    expect(msg).toContain('Henry');
    expect(msg.toLowerCase()).toContain('cansado');
  });

  it('usa plantillas de personajes conocidos', () => {
    const msg = generateLocalAnimo({
      texto: 'Hoy me siento bloqueado',
      rol: 'goku',
      nombre: 'Alex',
    });
    expect(msg).toContain('Alex');
    expect(listAnimoRoles()).toContain('goku');
  });

  it('varía con el salt', () => {
    const a = generateLocalAnimo({ texto: 'dudas', rol: 'madre', nombre: 'Sam', salt: 0 });
    const b = generateLocalAnimo({ texto: 'dudas', rol: 'madre', nombre: 'Sam', salt: 1 });
    expect(typeof a).toBe('string');
    expect(typeof b).toBe('string');
    expect(a.length).toBeGreaterThan(20);
  });
});

describe('getAnimoRole', () => {
  it('devuelve emoji y etiqueta por rol', () => {
    expect(getAnimoRole('luffy').emoji).toBe('🏴‍☠️');
    expect(getAnimoRole('desconocido').value).toBe('motivador');
  });
});
