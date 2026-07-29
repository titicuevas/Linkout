import { describe, it, expect } from 'vitest';
import { mapAuthErrorMessage } from './authErrors';

describe('mapAuthErrorMessage', () => {
  it('devuelve mensaje para credenciales inválidas', () => {
    const result = mapAuthErrorMessage({ message: 'Invalid login credentials' });
    expect(result).toBe('Correo o contraseña incorrectos.');
  });

  it('devuelve mensaje cuando el usuario no existe', () => {
    const result = mapAuthErrorMessage({ message: 'User not found' });
    expect(result).toBe('El correo no está registrado.');
  });

  it('devuelve mensaje cuando el correo ya está registrado', () => {
    const result = mapAuthErrorMessage({ message: 'Email already registered' });
    expect(result).toBe('El correo ya está registrado. Inicia sesión.');
  });

  it('devuelve mensaje cuando el correo no está confirmado', () => {
    const result = mapAuthErrorMessage({ message: 'Email not confirmed' });
    expect(result).toBe('Tu correo aún no está confirmado. Revisa tu bandeja de entrada.');
  });

  it('devuelve mensaje cuando la contraseña es muy corta', () => {
    const result = mapAuthErrorMessage({ message: 'Password should be at least 8 characters' });
    expect(result).toBe('La contraseña debe tener al menos 8 caracteres.');
  });

  it('devuelve mensaje de rate limit', () => {
    const result = mapAuthErrorMessage({ message: 'Too many requests sent' });
    expect(result).toBe('Demasiados intentos en poco tiempo. Espera un momento y vuelve a intentarlo.');
  });

  it('devuelve el fallback cuando el error es desconocido', () => {
    const result = mapAuthErrorMessage({ message: 'some unknown error' }, 'Error por defecto.');
    expect(result).toBe('some unknown error');
  });

  it('devuelve el fallback cuando no hay mensaje', () => {
    const result = mapAuthErrorMessage({}, 'Error por defecto.');
    expect(result).toBe('Error por defecto.');
  });

  it('devuelve el fallback cuando el error es nulo', () => {
    const result = mapAuthErrorMessage(null, 'Fallback.');
    expect(result).toBe('Fallback.');
  });
});
