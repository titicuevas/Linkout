export const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'entrevista_contacto', label: 'Entrevista de contacto' },
  { value: 'prueba_tecnica', label: 'Prueba técnica' },
  { value: 'segunda_entrevista', label: '2ª Entrevista' },
  { value: 'entrevista_final', label: 'Entrevista final' },
  { value: 'contratacion', label: 'Contratación' },
  { value: 'rechazado', label: 'No seleccionado' },
];

export const ORIGENES = [
  { value: '', label: 'Todos' },
  { value: 'infojobs', label: 'InfoJobs' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'joppy', label: 'Joppy' },
  { value: 'tecnoempleo', label: 'Tecnoempleo' },
  { value: 'correo_directo', label: 'Correo directo empresa' },
  { value: 'otro', label: 'Otro' },
];

/** Opciones de formulario (sin "Todos") */
export const FORM_ESTADOS = ESTADOS.filter((e) => e.value !== '');
export const FORM_ORIGENES = ORIGENES.filter((o) => o.value !== '');

/** Chip de filtro (no es un estado real de BD) */
export const FILTRO_EN_PROCESO = { value: 'en_proceso', label: 'En proceso' };

export const SORT_OPTIONS = [
  { value: 'fecha', label: 'Fecha' },
  { value: 'fecha_actualizacion', label: 'Actualizada' },
  { value: 'puesto', label: 'Puesto' },
  { value: 'empresa', label: 'Empresa' },
  { value: 'estado', label: 'Estado' },
  { value: 'origen', label: 'Origen' },
  { value: 'salario_anual', label: 'Salario' },
  { value: 'ubicacion', label: 'Ubicación' },
];

export const FRANJAS_SALARIAL = [
  '< 15.000 €',
  '15.000 - 20.000 €',
  '20.000 - 25.000 €',
  '25.000 - 30.000 €',
  '30.000 - 40.000 €',
  '> 40.000 €',
];

export const TIPOS_TRABAJO = ['Presencial', 'Remoto', 'Híbrido'];

const ESTADO_LABELS = Object.fromEntries(FORM_ESTADOS.map((e) => [e.value, e.label]));
const ORIGEN_LABELS = Object.fromEntries(FORM_ORIGENES.map((o) => [o.value, o.label]));

/** Normaliza orígenes legacy (LinkedIn, Email, etc.) al valor canónico */
export function normalizeOrigen(origen) {
  if (!origen) return '';
  const map = {
    linkedin: 'linkedin',
    LinkedIn: 'linkedin',
    infojobs: 'infojobs',
    InfoJobs: 'infojobs',
    joppy: 'joppy',
    Joppy: 'joppy',
    tecnoempleo: 'tecnoempleo',
    Tecnoempleo: 'tecnoempleo',
    correo_directo: 'correo_directo',
    Email: 'correo_directo',
    email: 'correo_directo',
    otro: 'otro',
    Otros: 'otro',
    Otro: 'otro',
  };
  return map[origen] || origen.toLowerCase();
}

export function formatEstado(estado) {
  if (!estado) return 'Sin estado';
  return ESTADO_LABELS[estado] || estado;
}

export function formatOrigen(origen) {
  if (!origen) return '-';
  const normalized = normalizeOrigen(origen);
  return ORIGEN_LABELS[normalized] || origen.charAt(0).toUpperCase() + origen.slice(1);
}

export function estadoColorClass(estado) {
  if (estado === 'contratacion') return 'text-green-400';
  if (estado === 'rechazado') return 'text-red-500';
  if (estado === 'entrevista_contacto') return 'text-blue-400';
  if (estado === 'prueba_tecnica') return 'text-orange-400';
  if (estado === 'segunda_entrevista') return 'text-violet-400';
  if (estado === 'entrevista_final') return 'text-fuchsia-400';
  return 'text-gray-300';
}

export const FOLLOW_UP_DAYS = 10;

export function isActiveProcess(candidatura) {
  return candidatura.estado !== 'rechazado' && candidatura.estado !== 'contratacion';
}

export function getReferenceDate(candidatura) {
  return candidatura.fecha_actualizacion || candidatura.fecha || candidatura.created_at;
}

export function daysSince(dateValue) {
  if (!dateValue) return null;
  return Math.floor((Date.now() - new Date(dateValue).getTime()) / (1000 * 60 * 60 * 24));
}

export function formatInactivityLabel(candidatura) {
  const elapsed = daysSince(getReferenceDate(candidatura));
  if (elapsed === null) return null;
  if (elapsed === 0) return 'Hoy';
  if (elapsed === 1) return 'Hace 1 día';
  return `Hace ${elapsed} días`;
}

export function needsFollowUp(candidatura, days = FOLLOW_UP_DAYS) {
  if (!isActiveProcess(candidatura)) return false;
  const elapsed = daysSince(getReferenceDate(candidatura));
  return elapsed !== null && elapsed >= days;
}

export function getFollowUpsPendientes(candidaturas, days = FOLLOW_UP_DAYS) {
  return candidaturas.filter((candidatura) => needsFollowUp(candidatura, days));
}

/** Ordena por inactividad (más días sin movimiento primero). */
export function sortByInactivityDesc(candidaturas = []) {
  return [...candidaturas].sort((a, b) => {
    const daysA = daysSince(getReferenceDate(a));
    const daysB = daysSince(getReferenceDate(b));
    return (daysB ?? -1) - (daysA ?? -1);
  });
}

export function formatHistoryValue(field, value) {
  if (value === null || value === undefined || value === '') return 'Sin especificar';
  if (field === 'estado') return formatEstado(value);
  if (field === 'origen') return formatOrigen(value);
  if (field === 'fecha' || field === 'fecha_actualizacion') return new Date(value).toLocaleDateString();
  if (field === 'salario_anual') return `${value} €`;
  return String(value);
}

export function buildChangeHistory(previousValues, nextValues) {
  const labels = {
    puesto: 'Puesto',
    empresa: 'Empresa',
    estado: 'Estado',
    fecha: 'Fecha',
    salario_anual: 'Salario anual',
    franja_salarial: 'Franja salarial',
    tipo_trabajo: 'Tipo de trabajo',
    ubicacion: 'Ubicación',
    origen: 'Origen',
    feedback: 'Feedback',
    notas: 'Notas',
    empresa_url: 'URL de la empresa',
  };

  const entries = Object.entries(labels).flatMap(([field, label]) => {
    const previous = previousValues[field] ?? '';
    const next = nextValues[field] ?? '';

    if (previous === next) return [];

    return [`${label}: ${formatHistoryValue(field, previous)} -> ${formatHistoryValue(field, next)}`];
  });

  if (entries.length === 0) return [];

  const timestamp = new Date().toLocaleString();
  return [`[${timestamp}] ${entries.join(' | ')}`];
}

export function suggestFranjaFromSalary(value) {
  const v = Number(value);
  if (!v) return '';
  if (v < 15000) return '< 15.000 €';
  if (v < 20000) return '15.000 - 20.000 €';
  if (v < 25000) return '20.000 - 25.000 €';
  if (v < 30000) return '25.000 - 30.000 €';
  if (v < 40000) return '30.000 - 40.000 €';
  return '> 40.000 €';
}

export function matchesCandidaturaSearch(candidatura, query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    candidatura.puesto,
    candidatura.empresa,
    candidatura.ubicacion,
    candidatura.feedback,
    candidatura.notas,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

export const SAVED_VIEWS_KEY = 'linkout_candidaturas_saved_views';

/** Snapshot de filtros actuales listo para guardar como vista. */
export function buildSavedViewFilters({
  filtroEstado,
  filtroOrigen,
  filtroSeguimiento,
  filtroRecientes,
  searchQuery,
}) {
  return {
    filtroEstado: filtroEstado || '',
    filtroOrigen: filtroOrigen || '',
    filtroSeguimiento: Boolean(filtroSeguimiento),
    filtroRecientes: Boolean(filtroRecientes),
    searchQuery: searchQuery || '',
  };
}

export function loadSavedViews(storage = localStorage) {
  try {
    const raw = storage.getItem(SAVED_VIEWS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistSavedViews(views, storage = localStorage) {
  storage.setItem(SAVED_VIEWS_KEY, JSON.stringify(views));
}

export function createSavedView(name, filters, existingViews = []) {
  const trimmed = (name || '').trim();
  if (!trimmed) return { error: 'empty', views: existingViews };

  const alreadyExists = existingViews.some(
    (view) => view.name.toLowerCase() === trimmed.toLowerCase(),
  );
  if (alreadyExists) return { error: 'duplicate', views: existingViews };

  const nextViews = [
    {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: trimmed,
      ...buildSavedViewFilters(filters),
      createdAt: new Date().toISOString(),
    },
    ...existingViews,
  ];

  return { error: null, views: nextViews };
}

export function removeSavedView(viewId, existingViews = []) {
  return existingViews.filter((view) => view.id !== viewId);
}

export function hasActiveCandidaturaFilters({
  filtroEstado,
  filtroOrigen,
  filtroSeguimiento,
  filtroRecientes,
  searchQuery,
}) {
  return Boolean(
    (filtroEstado || '').trim()
    || (filtroOrigen || '').trim()
    || filtroSeguimiento
    || filtroRecientes
    || (searchQuery || '').trim(),
  );
}

/** True si la candidatura se registró en los últimos N días. */
export function isRecentApplication(candidatura, days = 7) {
  if (!candidatura?.fecha) return false;
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - days);
  return new Date(candidatura.fecha) >= threshold;
}

/** Devuelve una URL segura para abrir en nueva pestaña, o null si está vacía/inválida. */
export function toExternalUrl(value) {
  const raw = (value || '').trim();
  if (!raw) return null;

  try {
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const url = new URL(withProtocol);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Payload para actualizar solo el estado (historial + fecha_actualizacion) */
export function buildStatusUpdate(candidatura, newEstado) {
  const nextValues = { ...candidatura, estado: newEstado };
  const historyEntries = buildChangeHistory(candidatura, nextValues);
  return {
    estado: newEstado,
    fecha_actualizacion: new Date().toISOString().slice(0, 10),
    historial_cambios: historyEntries.length > 0
      ? [...(candidatura.historial_cambios || []), ...historyEntries]
      : candidatura.historial_cambios || [],
  };
}

/** Payload al marcar un seguimiento manual (fecha + historial). */
export function buildFollowUpUpdate(candidatura, now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  const stamp = now.toLocaleString();
  const entry = `[${stamp}] Seguimiento registrado`;
  return {
    fecha_actualizacion: today,
    historial_cambios: [...(candidatura?.historial_cambios || []), entry],
  };
}

/** Escapa un valor para CSV (comillas y comas). */
export function escapeCsvValue(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

const CSV_HEADERS = [
  'Puesto',
  'Empresa',
  'URL empresa',
  'Estado',
  'Origen',
  'Fecha',
  'Fecha actualizacion',
  'Salario anual',
  'Franja salarial',
  'Tipo de trabajo',
  'Ubicacion',
  'Feedback',
  'Notas',
];

/** Construye el contenido CSV (sin BOM) de candidaturas filtradas/ordenadas. */
export function buildCandidaturasCsv(candidaturas = []) {
  const rows = candidaturas.map((candidatura) => {
    const origenLabel = formatOrigen(candidatura.origen);
    return [
      candidatura.puesto,
      candidatura.empresa,
      candidatura.empresa_url,
      formatEstado(candidatura.estado),
      origenLabel === '-' ? '' : origenLabel,
      candidatura.fecha,
      candidatura.fecha_actualizacion,
      candidatura.salario_anual,
      candidatura.franja_salarial,
      candidatura.tipo_trabajo,
      candidatura.ubicacion,
      candidatura.feedback,
      candidatura.notas,
    ].map(escapeCsvValue).join(',');
  });

  return [CSV_HEADERS.join(','), ...rows].join('\n');
}

/**
 * Crea el payload de una copia nueva a partir de una candidatura existente.
 * No incluye id ni created_at (los genera la BD).
 */
export function buildDuplicatePayload(candidatura, userId) {
  const now = new Date();
  const timestamp = now.toLocaleString();
  const today = now.toISOString().slice(0, 10);

  return {
    user_id: userId,
    puesto: candidatura.puesto || '',
    empresa: candidatura.empresa || '',
    empresa_url: candidatura.empresa_url || '',
    estado: candidatura.estado || 'entrevista_contacto',
    fecha: today,
    salario_anual: candidatura.salario_anual ?? null,
    franja_salarial: candidatura.franja_salarial || '',
    tipo_trabajo: candidatura.tipo_trabajo || '',
    ubicacion: candidatura.ubicacion || '',
    origen: normalizeOrigen(candidatura.origen) || '',
    feedback: '',
    notas: candidatura.notas || '',
    fecha_actualizacion: now.toISOString(),
    historial_cambios: [
      `[${timestamp}] Candidatura duplicada desde "${candidatura.puesto || 'sin puesto'}" en "${candidatura.empresa || 'sin empresa'}" con estado: ${formatEstado(candidatura.estado)}`,
    ],
  };
}
