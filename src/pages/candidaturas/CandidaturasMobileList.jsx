import { formatOrigen, formatInactivityLabel, needsFollowUp, isActiveProcess, toExternalUrl } from './shared';
import CandidaturasEmptyState from './CandidaturasEmptyState';
import EstadoQuickSelect from './EstadoQuickSelect';

export default function CandidaturasMobileList({
  candidaturas,
  onCreate,
  onOpenFeedback,
  onOpenNotas,
  onEdit,
  onDelete,
  onDuplicate,
  onGoToRetos,
  onStatusChange,
  onMarkFollowUp,
  statusUpdatingId,
  hasActiveFilters = false,
  onClearFilters,
}) {
  if (candidaturas.length === 0) {
    return (
      <CandidaturasEmptyState
        onCreate={onCreate}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
      />
    );
  }

  return (
    <>
      {candidaturas.map((candidatura) => {
        const inactivity = formatInactivityLabel(candidatura);
        const urgent = needsFollowUp(candidatura);
        const empresaUrl = toExternalUrl(candidatura.empresa_url);

        return (
          <article
            key={candidatura.id}
            className={`rounded-2xl border p-4 shadow-xl ${urgent ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-neutral-700 bg-neutral-900/90'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-white break-words">{candidatura.puesto}</h2>
                <p className="text-sm text-gray-300 break-words">{candidatura.empresa}</p>
                {empresaUrl && (
                  <a
                    href={empresaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs font-semibold text-blue-300 hover:text-blue-200 break-all"
                  >
                    Abrir web de la empresa
                  </a>
                )}
                {isActiveProcess(candidatura) && inactivity && (
                  <p className={`mt-1 text-xs font-semibold ${urgent ? 'text-yellow-300' : 'text-gray-400'}`}>
                    {urgent ? '⚠ ' : ''}{inactivity}
                  </p>
                )}
              </div>
              <EstadoQuickSelect
                value={candidatura.estado}
                disabled={statusUpdatingId === candidatura.id}
                onChange={(estado) => onStatusChange(candidatura, estado)}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-neutral-800/80 p-3">
                <div className="text-gray-400">Origen</div>
                <div className="mt-1 font-semibold text-blue-300">{formatOrigen(candidatura.origen)}</div>
              </div>
              <div className="rounded-xl bg-neutral-800/80 p-3">
                <div className="text-gray-400">Fecha</div>
                <div className="mt-1 font-semibold text-white">{candidatura.fecha ? new Date(candidatura.fecha).toLocaleDateString() : '-'}</div>
              </div>
              <div className="rounded-xl bg-neutral-800/80 p-3">
                <div className="text-gray-400">Actualizada</div>
                <div className="mt-1 font-semibold text-white">{candidatura.fecha_actualizacion ? new Date(candidatura.fecha_actualizacion).toLocaleDateString() : '-'}</div>
              </div>
              <div className="rounded-xl bg-neutral-800/80 p-3">
                <div className="text-gray-400">Salario</div>
                <div className="mt-1 font-semibold text-pink-200">{candidatura.salario_anual ? `${candidatura.salario_anual} €` : '-'}</div>
              </div>
              <div className="rounded-xl bg-neutral-800/80 p-3">
                <div className="text-gray-400">Franja</div>
                <div className="mt-1 font-semibold text-pink-200">{candidatura.franja_salarial || '-'}</div>
              </div>
              <div className="rounded-xl bg-neutral-800/80 p-3">
                <div className="text-gray-400">Tipo</div>
                <div className="mt-1 font-semibold text-pink-200">{candidatura.tipo_trabajo || '-'}</div>
              </div>
            </div>

            <div className="mt-3 rounded-xl bg-neutral-800/80 p-3 text-sm">
              <div className="text-gray-400">Ubicación</div>
              <div className="mt-1 font-semibold text-pink-200 break-words">{candidatura.ubicacion || '-'}</div>
            </div>

            {candidatura.feedback && (
              <button onClick={() => onOpenFeedback(candidatura.feedback)} className="mt-3 w-full rounded-xl bg-purple-600 px-4 py-2 text-sm font-bold text-white shadow-lg" title="Ver feedback">
                Ver feedback
              </button>
            )}

            {candidatura.notas?.trim() && (
              <button onClick={() => onOpenNotas(candidatura.notas)} className="mt-3 w-full rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white shadow-lg" title="Ver notas">
                Ver notas
              </button>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {urgent && (
                <button
                  type="button"
                  disabled={statusUpdatingId === candidatura.id}
                  onClick={() => onMarkFollowUp?.(candidatura)}
                  className="w-full rounded-xl bg-pink-600 px-4 py-2 text-sm font-bold text-white shadow-lg disabled:opacity-60"
                  title="Marcar seguimiento"
                >
                  {statusUpdatingId === candidatura.id ? 'Guardando…' : 'He hecho seguimiento'}
                </button>
              )}
              <button onClick={() => onEdit(candidatura)} className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg" title="Editar candidatura">
                Editar
              </button>
              <button onClick={() => onDuplicate(candidatura)} className="flex-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg" title="Duplicar candidatura">
                Duplicar
              </button>
              <button onClick={() => onDelete(candidatura.id)} className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-lg" title="Borrar candidatura">
                Borrar
              </button>
              {candidatura.estado !== 'contratacion' && (
                <button title="Ir a ejercicios" className="w-full rounded-xl bg-yellow-500 px-4 py-2 text-sm font-bold text-neutral-900 shadow-lg" onClick={() => onGoToRetos(candidatura)} aria-label="Ir a ejercicios">
                  Reto de bienestar
                </button>
              )}
            </div>
          </article>
        );
      })}
    </>
  );
}
