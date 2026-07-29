import { formatOrigen, formatInactivityLabel, needsFollowUp, isActiveProcess } from './shared';
import CandidaturasEmptyState from './CandidaturasEmptyState';
import EstadoQuickSelect from './EstadoQuickSelect';

export default function CandidaturasMobileList({
  candidaturas,
  onCreate,
  onOpenFeedback,
  onEdit,
  onDelete,
  onDuplicate,
  onGoToRetos,
  onStatusChange,
  statusUpdatingId,
}) {
  if (candidaturas.length === 0) {
    return <CandidaturasEmptyState onCreate={onCreate} />;
  }

  return (
    <>
      {candidaturas.map((candidatura) => {
        const inactivity = formatInactivityLabel(candidatura);
        const urgent = needsFollowUp(candidatura);

        return (
          <article
            key={candidatura.id}
            className={`rounded-2xl border p-4 shadow-xl ${urgent ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-neutral-700 bg-neutral-900/90'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-white break-words">{candidatura.puesto}</h2>
                <p className="text-sm text-gray-300 break-words">{candidatura.empresa}</p>
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

            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => onEdit(candidatura)} className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg" title="Editar candidatura">
                Editar
              </button>
              <button onClick={() => onDuplicate(candidatura)} className="flex-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg" title="Duplicar candidatura">
                Duplicar
              </button>
              <button onClick={() => onDelete(candidatura.id)} className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-lg" title="Borrar candidatura">
                Borrar
              </button>
              {candidatura.estado === 'rechazado' && (
                <button title="Ir a ejercicios" className="w-full rounded-xl bg-yellow-500 px-4 py-2 text-sm font-bold text-neutral-900 shadow-lg" onClick={onGoToRetos} aria-label="Ir a ejercicios">
                  Ir a retos de bienestar
                </button>
              )}
            </div>
          </article>
        );
      })}
    </>
  );
}
