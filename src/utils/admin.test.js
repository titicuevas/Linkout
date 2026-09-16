import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getAdminEmails, isAdminUser } from './admin';

describe('admin helpers', () => {
  const originalEnv = import.meta.env.VITE_ADMIN_EMAILS;

  beforeEach(() => {
    vi.stubEnv('VITE_ADMIN_EMAILS', '');
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      vi.unstubAllEnvs();
    } else {
      vi.stubEnv('VITE_ADMIN_EMAILS', originalEnv);
    }
  });

  it('incluye el admin por defecto', () => {
    expect(getAdminEmails()).toContain('enriquecuevas1989@gmail.com');
  });

  it('detecta admin por email sin importar mayúsculas', () => {
    expect(isAdminUser({ email: 'EnriqueCuevas1989@gmail.com' })).toBe(true);
    expect(isAdminUser({ email: 'otro@demo.es' })).toBe(false);
    expect(isAdminUser(null)).toBe(false);
  });

  it('añade emails extra desde VITE_ADMIN_EMAILS', () => {
    vi.stubEnv('VITE_ADMIN_EMAILS', 'extra@test.com, otro@test.com');
    const emails = getAdminEmails();
    expect(emails).toContain('extra@test.com');
    expect(emails).toContain('otro@test.com');
    expect(isAdminUser({ email: 'extra@test.com' })).toBe(true);
  });
});
