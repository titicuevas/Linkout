import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword } from './validators';

describe('validateEmail', () => {
  it('acepta correos válidos', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('a.b+tag@domain.co')).toBe(true);
  });

  it('rechaza correos sin @', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  it('rechaza correos sin dominio', () => {
    expect(validateEmail('user@')).toBe(false);
  });

  it('rechaza correos con espacios', () => {
    expect(validateEmail('user @example.com')).toBe(false);
  });

  it('rechaza cadenas vacías', () => {
    expect(validateEmail('')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('acepta contraseñas de 8+ caracteres', () => {
    expect(validatePassword('12345678')).toBe(true);
    expect(validatePassword('contraseña_segura')).toBe(true);
  });

  it('rechaza contraseñas de menos de 8 caracteres', () => {
    expect(validatePassword('1234567')).toBe(false);
    expect(validatePassword('')).toBe(false);
  });
});
