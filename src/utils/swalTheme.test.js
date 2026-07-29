import { describe, it, expect } from 'vitest';
import { swalSuccess, swalError, swalWarning, swalInfo } from './swalTheme';

const DARK_BG = '#18181b';
const WHITE = '#fff';
const INDIGO = '#6366f1';

describe('swalSuccess', () => {
  it('genera config de éxito con tema oscuro', () => {
    const cfg = swalSuccess('Hecho', 'Todo OK');
    expect(cfg.icon).toBe('success');
    expect(cfg.title).toBe('Hecho');
    expect(cfg.text).toBe('Todo OK');
    expect(cfg.background).toBe(DARK_BG);
    expect(cfg.color).toBe(WHITE);
    expect(cfg.confirmButtonColor).toBe(INDIGO);
  });

  it('permite overrides', () => {
    const cfg = swalSuccess('OK', '', { timer: 1500 });
    expect(cfg.timer).toBe(1500);
    expect(cfg.icon).toBe('success');
  });
});

describe('swalError', () => {
  it('genera config de error con confirmButtonText', () => {
    const cfg = swalError('Error', 'Algo falló');
    expect(cfg.icon).toBe('error');
    expect(cfg.confirmButtonText).toBe('Aceptar');
    expect(cfg.background).toBe(DARK_BG);
  });
});

describe('swalWarning', () => {
  it('incluye showCancelButton por defecto', () => {
    const cfg = swalWarning('¿Seguro?', 'No se puede deshacer');
    expect(cfg.icon).toBe('warning');
    expect(cfg.showCancelButton).toBe(true);
    expect(cfg.confirmButtonText).toBe('Sí');
    expect(cfg.cancelButtonText).toBe('Cancelar');
  });

  it('permite sobreescribir textos de botones', () => {
    const cfg = swalWarning('¿Borrar?', '', { confirmButtonText: 'Eliminar' });
    expect(cfg.confirmButtonText).toBe('Eliminar');
  });
});

describe('swalInfo', () => {
  it('genera config de info con tema oscuro', () => {
    const cfg = swalInfo('Info', 'Sin datos');
    expect(cfg.icon).toBe('info');
    expect(cfg.background).toBe(DARK_BG);
  });
});
