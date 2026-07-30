import { getFollowUpsPendientes } from './shared';

export default function CandidaturasStats({
  candidaturas,
  followUpCount,
  onShowFollowUps,
  onFilterEstado,
}) {
  const pendientes = typeof followUpCount === 'number'
    ? followUpCount
    : getFollowUpsPendientes(candidaturas).length;

  const total = candidaturas.length;
  const contrataciones = candidaturas.filter((c) => c.estado === 'contratacion').length;
  const enProceso = candidaturas.filter((c) => c.estado !== 'rechazado' && c.estado !== 'contratacion').length;
  const rechazadas = candidaturas.filter((c) => c.estado === 'rechazado').length;

  const cardBase = 'rounded-xl p-4 text-center border shadow-2xl transition focus:outline-none focus:ring-2';

  return (
    <div className="w-full max-w-6xl mx-auto mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <button
        type="button"
        onClick={() => onFilterEstado?.('')}
        className={`${cardBase} bg-gradient-to-br from-blue-900/80 to-blue-800/60 border-blue-700 hover:border-blue-400 focus:ring-blue-300`}
        title="Ver todas las candidaturas"
      >
        <div className="text-3xl mb-1" aria-hidden="true">📋</div>
        <div className="text-2xl font-bold text-blue-300">{total}</div>
        <div className="text-sm text-blue-200">Total Candidaturas</div>
      </button>

      <button
        type="button"
        onClick={() => onFilterEstado?.('contratacion')}
        className={`${cardBase} bg-gradient-to-br from-green-900/80 to-green-800/60 border-green-700 hover:border-green-400 focus:ring-green-300`}
        title="Filtrar contrataciones"
      >
        <div className="text-3xl mb-1" aria-hidden="true">🟢</div>
        <div className="text-2xl font-bold text-green-300">{contrataciones}</div>
        <div className="text-sm text-green-200">Contrataciones</div>
      </button>

      <button
        type="button"
        onClick={() => onFilterEstado?.('en_proceso')}
        className={`${cardBase} bg-gradient-to-br from-purple-900/80 to-purple-800/60 border-purple-700 hover:border-purple-400 focus:ring-purple-300`}
        title="Ver procesos activos"
      >
        <div className="text-3xl mb-1" aria-hidden="true">🟣</div>
        <div className="text-2xl font-bold text-purple-300">{enProceso}</div>
        <div className="text-sm text-purple-200">En Proceso</div>
      </button>

      <button
        type="button"
        onClick={() => onFilterEstado?.('rechazado')}
        className={`${cardBase} bg-gradient-to-br from-red-900/80 to-red-800/60 border-red-700 hover:border-red-400 focus:ring-red-300`}
        title="Filtrar no seleccionadas"
      >
        <div className="text-3xl mb-1" aria-hidden="true">❌</div>
        <div className="text-2xl font-bold text-red-300">{rechazadas}</div>
        <div className="text-sm text-red-200">No seleccionadas</div>
      </button>

      <button
        type="button"
        onClick={onShowFollowUps}
        className={`${cardBase} bg-gradient-to-br from-yellow-900/80 to-yellow-800/60 border-yellow-600 hover:border-yellow-400 focus:ring-yellow-300`}
        title="Ver candidaturas con seguimiento pendiente"
      >
        <div className="text-3xl mb-1" aria-hidden="true">⏳</div>
        <div className="text-2xl font-bold text-yellow-300">{pendientes}</div>
        <div className="text-sm text-yellow-100">Seguimiento pendiente</div>
      </button>
    </div>
  );
}
