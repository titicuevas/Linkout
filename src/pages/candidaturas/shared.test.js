import { describe, it, expect } from 'vitest';
import {
  formatEstado,
  formatOrigen,
  estadoColorClass,
  formatHistoryValue,
  buildChangeHistory,
  isActiveProcess,
  needsFollowUp,
  getFollowUpsPendientes,
  matchesCandidaturaSearch,
  buildStatusUpdate,
  buildFollowUpUpdate,
  escapeCsvValue,
  buildCandidaturasCsv,
  formatInactivityLabel,
  sortByInactivityDesc,
  buildDuplicatePayload,
  createSavedView,
  removeSavedView,
  hasActiveCandidaturaFilters,
  toExternalUrl,
  isRecentApplication,
} from './shared';

// ─── formatEstado ───────────────────────────────────────────────────────────

describe('formatEstado', () => {
  it('convierte claves conocidas a etiquetas legibles', () => {
    expect(formatEstado('entrevista_contacto')).toBe('Entrevista de contacto');
    expect(formatEstado('prueba_tecnica')).toBe('Prueba técnica');
    expect(formatEstado('segunda_entrevista')).toBe('2ª Entrevista');
    expect(formatEstado('entrevista_final')).toBe('Entrevista final');
    expect(formatEstado('contratacion')).toBe('Contratación');
    expect(formatEstado('rechazado')).toBe('No seleccionado');
  });

  it('devuelve "Sin estado" para valores vacíos', () => {
    expect(formatEstado('')).toBe('Sin estado');
    expect(formatEstado(null)).toBe('Sin estado');
    expect(formatEstado(undefined)).toBe('Sin estado');
  });

  it('devuelve el valor tal cual si no está en el mapa', () => {
    expect(formatEstado('desconocido')).toBe('desconocido');
  });
});

// ─── formatOrigen ───────────────────────────────────────────────────────────

describe('formatOrigen', () => {
  it('devuelve "-" para valores vacíos', () => {
    expect(formatOrigen('')).toBe('-');
    expect(formatOrigen(null)).toBe('-');
    expect(formatOrigen(undefined)).toBe('-');
  });

  it('convierte "correo_directo" a etiqueta legible', () => {
    expect(formatOrigen('correo_directo')).toBe('Correo directo empresa');
  });

  it('usa etiquetas canónicas para valores conocidos', () => {
    expect(formatOrigen('linkedin')).toBe('LinkedIn');
    expect(formatOrigen('LinkedIn')).toBe('LinkedIn');
    expect(formatOrigen('infojobs')).toBe('InfoJobs');
  });
});

// ─── estadoColorClass ────────────────────────────────────────────────────────

describe('estadoColorClass', () => {
  it('devuelve verde para contratacion', () => {
    expect(estadoColorClass('contratacion')).toBe('text-green-400');
  });

  it('devuelve rojo para rechazado', () => {
    expect(estadoColorClass('rechazado')).toBe('text-red-500');
  });

  it('devuelve un color para cada estado conocido', () => {
    expect(estadoColorClass('entrevista_contacto')).toBe('text-blue-400');
    expect(estadoColorClass('prueba_tecnica')).toBe('text-orange-400');
    expect(estadoColorClass('segunda_entrevista')).toBe('text-violet-400');
    expect(estadoColorClass('entrevista_final')).toBe('text-fuchsia-400');
  });

  it('devuelve gris claro para estados desconocidos', () => {
    expect(estadoColorClass('otro')).toBe('text-gray-300');
    expect(estadoColorClass('')).toBe('text-gray-300');
  });
});

// ─── formatHistoryValue ──────────────────────────────────────────────────────

describe('formatHistoryValue', () => {
  it('devuelve "Sin especificar" para valores vacíos', () => {
    expect(formatHistoryValue('puesto', '')).toBe('Sin especificar');
    expect(formatHistoryValue('puesto', null)).toBe('Sin especificar');
    expect(formatHistoryValue('puesto', undefined)).toBe('Sin especificar');
  });

  it('formatea el campo "estado"', () => {
    expect(formatHistoryValue('estado', 'rechazado')).toBe('No seleccionado');
  });

  it('formatea el campo "origen"', () => {
    expect(formatHistoryValue('origen', 'correo_directo')).toBe('Correo directo empresa');
  });

  it('añade "€" para salario_anual', () => {
    expect(formatHistoryValue('salario_anual', 40000)).toBe('40000 €');
  });

  it('devuelve string para campos genéricos', () => {
    expect(formatHistoryValue('puesto', 'Desarrollador')).toBe('Desarrollador');
    expect(formatHistoryValue('empresa', 42)).toBe('42');
  });
});

// ─── buildChangeHistory ──────────────────────────────────────────────────────

describe('buildChangeHistory', () => {
  it('devuelve array vacío cuando no hay cambios', () => {
    const prev = { estado: 'rechazado', empresa: 'ACME' };
    const next = { estado: 'rechazado', empresa: 'ACME' };
    expect(buildChangeHistory(prev, next)).toEqual([]);
  });

  it('genera una entrada cuando cambia un campo', () => {
    const prev = { estado: 'prueba_tecnica' };
    const next = { estado: 'entrevista_final' };
    const result = buildChangeHistory(prev, next);
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('Estado:');
    expect(result[0]).toContain('Prueba técnica');
    expect(result[0]).toContain('Entrevista final');
    expect(result[0]).toContain('->');
  });

  it('incluye todos los campos que cambiaron en la misma entrada', () => {
    const prev = { estado: 'prueba_tecnica', empresa: 'ACME' };
    const next = { estado: 'entrevista_final', empresa: 'ACME Corp' };
    const result = buildChangeHistory(prev, next);
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('Estado:');
    expect(result[0]).toContain('Empresa:');
  });

  it('incluye notas cuando cambian', () => {
    const prev = { notas: 'Primera llamada pendiente' };
    const next = { notas: 'Primera llamada hecha' };
    const result = buildChangeHistory(prev, next);
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('Notas:');
  });

  it('ignora campos que no están en el mapa de etiquetas', () => {
    const prev = { campo_extra: 'foo' };
    const next = { campo_extra: 'bar' };
    expect(buildChangeHistory(prev, next)).toEqual([]);
  });
});

// ─── follow-ups ──────────────────────────────────────────────────────────────

describe('isActiveProcess', () => {
  it('excluye rechazados y contrataciones', () => {
    expect(isActiveProcess({ estado: 'rechazado' })).toBe(false);
    expect(isActiveProcess({ estado: 'contratacion' })).toBe(false);
    expect(isActiveProcess({ estado: 'prueba_tecnica' })).toBe(true);
  });
});

describe('needsFollowUp / getFollowUpsPendientes', () => {
  it('detecta procesos activos sin movimiento reciente', () => {
    const stale = {
      estado: 'prueba_tecnica',
      fecha_actualizacion: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    };
    const fresh = {
      estado: 'prueba_tecnica',
      fecha_actualizacion: new Date().toISOString(),
    };
    const closed = {
      estado: 'rechazado',
      fecha_actualizacion: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    expect(needsFollowUp(stale)).toBe(true);
    expect(needsFollowUp(fresh)).toBe(false);
    expect(needsFollowUp(closed)).toBe(false);
    expect(getFollowUpsPendientes([stale, fresh, closed])).toHaveLength(1);
  });
});

describe('sortByInactivityDesc', () => {
  it('pone primero los procesos con más días sin movimiento', () => {
    const older = {
      id: '1',
      empresa: 'Vieja',
      estado: 'prueba_tecnica',
      fecha_actualizacion: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    const newer = {
      id: '2',
      empresa: 'Reciente',
      estado: 'prueba_tecnica',
      fecha_actualizacion: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    };
    expect(sortByInactivityDesc([newer, older]).map((c) => c.id)).toEqual(['1', '2']);
  });
});

describe('matchesCandidaturaSearch', () => {
  it('devuelve true si no hay query', () => {
    expect(matchesCandidaturaSearch({ puesto: 'Dev', empresa: 'ACME' }, '')).toBe(true);
  });

  it('busca en puesto y empresa', () => {
    const c = { puesto: 'Frontend Developer', empresa: 'ACME Corp', ubicacion: 'Madrid' };
    expect(matchesCandidaturaSearch(c, 'frontend')).toBe(true);
    expect(matchesCandidaturaSearch(c, 'acme')).toBe(true);
    expect(matchesCandidaturaSearch(c, 'madrid')).toBe(true);
    expect(matchesCandidaturaSearch(c, 'backend')).toBe(false);
  });

  it('también busca dentro de las notas', () => {
    const c = { puesto: 'Frontend Developer', empresa: 'ACME Corp', notas: 'Preguntar por guardias y equipo' };
    expect(matchesCandidaturaSearch(c, 'guardias')).toBe(true);
  });
});

describe('buildStatusUpdate', () => {
  it('genera payload con nuevo estado, fecha e historial', () => {
    const candidatura = {
      estado: 'prueba_tecnica',
      historial_cambios: ['[antes] creado'],
    };
    const payload = buildStatusUpdate(candidatura, 'entrevista_final');
    expect(payload.estado).toBe('entrevista_final');
    expect(payload.fecha_actualizacion).toBeTruthy();
    expect(payload.historial_cambios.length).toBe(2);
    expect(payload.historial_cambios[1]).toContain('Estado:');
  });
});

describe('buildFollowUpUpdate', () => {
  it('actualiza fecha y añade entrada de seguimiento al historial', () => {
    const candidatura = {
      historial_cambios: ['[antes] creado'],
    };
    const now = new Date('2026-07-30T12:00:00');
    const payload = buildFollowUpUpdate(candidatura, now);
    expect(payload.fecha_actualizacion).toBe('2026-07-30');
    expect(payload.historial_cambios).toHaveLength(2);
    expect(payload.historial_cambios[1]).toContain('Seguimiento registrado');
  });

  it('crea historial si no existía', () => {
    const payload = buildFollowUpUpdate({}, new Date('2026-07-30T12:00:00'));
    expect(payload.historial_cambios).toHaveLength(1);
    expect(payload.historial_cambios[0]).toContain('Seguimiento registrado');
  });
});

describe('buildCandidaturasCsv', () => {
  it('escapa comillas y comas', () => {
    expect(escapeCsvValue('hola "mundo"')).toBe('"hola ""mundo"""');
  });

  it('genera cabeceras y filas con estados/orígenes legibles', () => {
    const csv = buildCandidaturasCsv([
      {
        puesto: 'Dev, Senior',
        empresa: 'Acme "Labs"',
        empresa_url: 'https://acme.test',
        estado: 'entrevista_contacto',
        origen: 'linkedin',
        fecha: '2026-07-01',
        fecha_actualizacion: '2026-07-10',
        salario_anual: 40000,
        franja_salarial: '30k-45k',
        tipo_trabajo: 'Remoto',
        ubicacion: 'Madrid',
        feedback: 'Bien',
        notas: 'Seguir',
      },
    ]);

    expect(csv.startsWith('Puesto,Empresa,')).toBe(true);
    expect(csv).toContain('"Dev, Senior"');
    expect(csv).toContain('"Acme ""Labs"""');
    expect(csv).toContain('"Entrevista de contacto"');
    expect(csv).toContain('"LinkedIn"');
  });

  it('devuelve solo cabeceras si no hay datos', () => {
    const csv = buildCandidaturasCsv([]);
    expect(csv).toBe('Puesto,Empresa,URL empresa,Estado,Origen,Fecha,Fecha actualizacion,Salario anual,Franja salarial,Tipo de trabajo,Ubicacion,Feedback,Notas');
  });
});

describe('formatInactivityLabel', () => {
  it('devuelve "Hoy" si la fecha es de hoy', () => {
    expect(formatInactivityLabel({
      estado: 'prueba_tecnica',
      fecha_actualizacion: new Date().toISOString(),
    })).toBe('Hoy');
  });

  it('devuelve null sin fecha de referencia', () => {
    expect(formatInactivityLabel({ estado: 'prueba_tecnica' })).toBe(null);
  });
});

describe('buildDuplicatePayload', () => {
  it('copia campos relevantes y reinicia historial/feedback/fecha', () => {
    const source = {
      id: 'abc',
      puesto: 'Frontend',
      empresa: 'ACME',
      empresa_url: 'https://acme.test',
      estado: 'prueba_tecnica',
      salario_anual: 30000,
      franja_salarial: '30.000 - 40.000 €',
      tipo_trabajo: 'Remoto',
      ubicacion: 'Madrid',
      origen: 'LinkedIn',
      feedback: 'No copiar',
      notas: 'Preguntar por el stack real',
    };

    const payload = buildDuplicatePayload(source, 'user-1');
    expect(payload.user_id).toBe('user-1');
    expect(payload.puesto).toBe('Frontend');
    expect(payload.empresa).toBe('ACME');
    expect(payload.origen).toBe('linkedin');
    expect(payload.feedback).toBe('');
    expect(payload.notas).toBe('Preguntar por el stack real');
    expect(payload.historial_cambios).toHaveLength(1);
    expect(payload.historial_cambios[0]).toContain('duplicada');
    expect(payload.id).toBeUndefined();
    expect(payload.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('createSavedView / removeSavedView', () => {
  it('crea una vista con los filtros actuales', () => {
    const { error, views } = createSavedView('Seguimiento LinkedIn', {
      filtroEstado: 'prueba_tecnica',
      filtroOrigen: 'linkedin',
      filtroSeguimiento: true,
      searchQuery: 'remoto',
    }, []);

    expect(error).toBeNull();
    expect(views).toHaveLength(1);
    expect(views[0].name).toBe('Seguimiento LinkedIn');
    expect(views[0].filtroEstado).toBe('prueba_tecnica');
    expect(views[0].filtroOrigen).toBe('linkedin');
    expect(views[0].filtroSeguimiento).toBe(true);
    expect(views[0].searchQuery).toBe('remoto');
  });

  it('rechaza nombres vacíos o duplicados', () => {
    const existing = [{ id: '1', name: 'Activas' }];
    expect(createSavedView('   ', {}, existing).error).toBe('empty');
    expect(createSavedView('activas', {}, existing).error).toBe('duplicate');
  });

  it('elimina una vista por id', () => {
    const existing = [
      { id: '1', name: 'Activas' },
      { id: '2', name: 'LinkedIn' },
    ];
    expect(removeSavedView('1', existing)).toEqual([{ id: '2', name: 'LinkedIn' }]);
  });
});

describe('hasActiveCandidaturaFilters', () => {
  it('detecta si hay algún filtro activo', () => {
    expect(hasActiveCandidaturaFilters({
      filtroEstado: '',
      filtroOrigen: '',
      filtroSeguimiento: false,
      filtroRecientes: false,
      searchQuery: '',
    })).toBe(false);

    expect(hasActiveCandidaturaFilters({
      filtroEstado: 'prueba_tecnica',
      filtroOrigen: '',
      filtroSeguimiento: false,
      searchQuery: '',
    })).toBe(true);

    expect(hasActiveCandidaturaFilters({
      filtroEstado: '',
      filtroOrigen: '',
      filtroSeguimiento: true,
      searchQuery: '',
    })).toBe(true);

    expect(hasActiveCandidaturaFilters({
      filtroEstado: '',
      filtroOrigen: '',
      filtroSeguimiento: false,
      filtroRecientes: true,
      searchQuery: '',
    })).toBe(true);

    expect(hasActiveCandidaturaFilters({
      filtroEstado: '',
      filtroOrigen: '',
      filtroSeguimiento: false,
      searchQuery: 'remoto',
    })).toBe(true);
  });
});

describe('isRecentApplication', () => {
  it('detecta candidaturas de los últimos 7 días', () => {
    const today = new Date().toISOString().slice(0, 10);
    const old = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    expect(isRecentApplication({ fecha: today })).toBe(true);
    expect(isRecentApplication({ fecha: old })).toBe(false);
    expect(isRecentApplication({})).toBe(false);
  });
});

describe('toExternalUrl', () => {
  it('normaliza URLs y rechaza valores inválidos', () => {
    expect(toExternalUrl('https://acme.test')).toBe('https://acme.test/');
    expect(toExternalUrl('acme.test')).toBe('https://acme.test/');
    expect(toExternalUrl('')).toBeNull();
    expect(toExternalUrl('javascript:alert(1)')).toBeNull();
  });
});
