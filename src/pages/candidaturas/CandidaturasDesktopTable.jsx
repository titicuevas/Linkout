import CandidaturasEmptyState from './CandidaturasEmptyState';
import EstadoQuickSelect from './EstadoQuickSelect';
import { formatOrigen, formatInactivityLabel, needsFollowUp, isActiveProcess, toExternalUrl } from './shared';

export default function CandidaturasDesktopTable({
  candidaturas,
  sortBy,
  sortDir,
  onSort,
  onCreate,
  onEdit,
  onDelete,
  onDuplicate,
  onOpenFeedback,
  onOpenNotas,
  onGoToRetos,
  onStatusChange,
  onMarkFollowUp,
  statusUpdatingId,
  hasActiveFilters = false,
  onClearFilters,
}) {
  return (
    <table className="min-w-full divide-y divide-gray-700 bg-neutral-900 rounded-xl shadow-xl">
      <thead className="sticky top-0 z-20 bg-neutral-900/95 backdrop-blur border-b border-neutral-700 shadow-lg">
        <tr>
          <th className="px-2 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">⚡</th>
          <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => onSort('puesto')} title="Ordenar por puesto">Puesto {sortBy === 'puesto' && (sortDir === 'asc' ? '▲' : '▼')}</th>
          <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => onSort('empresa')} title="Ordenar por empresa">Empresa {sortBy === 'empresa' && (sortDir === 'asc' ? '▲' : '▼')}</th>
          <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => onSort('estado')} title="Ordenar por estado">Estado {sortBy === 'estado' && (sortDir === 'asc' ? '▲' : '▼')}</th>
          <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => onSort('origen')} title="Ordenar por origen">Origen {sortBy === 'origen' && (sortDir === 'asc' ? '▲' : '▼')}</th>
          <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => onSort('fecha')} title="Ordenar por fecha">Fecha {sortBy === 'fecha' && (sortDir === 'asc' ? '▲' : '▼')}</th>
          <th
            className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer"
            onClick={() => onSort('fecha_actualizacion')}
            title="Ordenar por fecha de actualización"
          >
            Actualizada {sortBy === 'fecha_actualizacion' && (sortDir === 'asc' ? '▲' : '▼')}
          </th>
          <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => onSort('salario_anual')} title="Ordenar por salario anual">Salario {sortBy === 'salario_anual' && (sortDir === 'asc' ? '▲' : '▼')}</th>
          <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => onSort('franja_salarial')} title="Ordenar por franja salarial">Franja {sortBy === 'franja_salarial' && (sortDir === 'asc' ? '▲' : '▼')}</th>
          <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => onSort('tipo_trabajo')} title="Ordenar por tipo de trabajo">Tipo {sortBy === 'tipo_trabajo' && (sortDir === 'asc' ? '▲' : '▼')}</th>
          <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => onSort('ubicacion')} title="Ordenar por ubicación">Ubicación {sortBy === 'ubicacion' && (sortDir === 'asc' ? '▲' : '▼')}</th>
          <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {candidaturas.length === 0 ? (
          <tr>
            <td colSpan={14} className="py-12 text-center text-gray-400 text-lg">
              <CandidaturasEmptyState
                onCreate={onCreate}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={onClearFilters}
              />
            </td>
          </tr>
        ) : (
          candidaturas.map((candidatura, index) => {
            const inactivity = formatInactivityLabel(candidatura);
            const urgent = needsFollowUp(candidatura);
            const empresaUrl = toExternalUrl(candidatura.empresa_url);

            return (
              <tr
                key={candidatura.id}
                className={`border-b border-neutral-800 ${urgent ? 'bg-yellow-500/5' : index % 2 === 0 ? 'bg-neutral-900' : 'bg-neutral-800/80'}`}
              >
                <td className="px-2 py-3 text-center">
                  {candidatura.estado !== 'contratacion' && (
                    <button title="Ir a ejercicios" className="text-yellow-400 text-xl" onClick={() => onGoToRetos(candidatura)} aria-label="Ir a ejercicios">⚡</button>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-white font-medium text-base">{candidatura.puesto}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-300 text-base">
                  <div>{candidatura.empresa}</div>
                  {empresaUrl && (
                    <a
                      href={empresaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-blue-300 hover:text-blue-200"
                    >
                      Web
                    </a>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-bold text-base">
                  <EstadoQuickSelect
                    value={candidatura.estado}
                    disabled={statusUpdatingId === candidatura.id}
                    onChange={(estado) => onStatusChange(candidatura, estado)}
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-blue-400">
                  {formatOrigen(candidatura.origen)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-400">{candidatura.fecha ? new Date(candidatura.fecha).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-400 relative group" title="Se actualiza al editar la candidatura o su estado">
                  <div>{candidatura.fecha_actualizacion ? new Date(candidatura.fecha_actualizacion).toLocaleDateString() : '-'}</div>
                  {isActiveProcess(candidatura) && inactivity && (
                    <div className={`text-[11px] font-semibold ${urgent ? 'text-yellow-300' : 'text-gray-500'}`}>
                      {urgent ? '⚠ ' : ''}{inactivity}
                    </div>
                  )}
                  {candidatura.historial_cambios && candidatura.historial_cambios.length > 0 && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-neutral-800 text-xs text-gray-200 rounded shadow-lg p-2 z-30 opacity-0 group-hover:opacity-100 pointer-events-none">
                      <div className="font-bold mb-1 text-pink-300">Historial de cambios:</div>
                      <ul>
                        {candidatura.historial_cambios.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-pink-200 font-bold text-base">{candidatura.salario_anual ? `${candidatura.salario_anual} €` : '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-pink-200 font-bold text-base">{candidatura.franja_salarial || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-pink-200 font-bold text-base">{candidatura.tipo_trabajo || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-pink-200 font-bold text-base">{candidatura.ubicacion || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap flex gap-2 items-center h-full justify-center flex-wrap">
                  {urgent && (
                    <button
                      type="button"
                      disabled={statusUpdatingId === candidatura.id}
                      onClick={() => onMarkFollowUp?.(candidatura)}
                      className="bg-pink-600 text-white px-3 py-1 rounded font-bold text-xs disabled:opacity-60"
                      title="Marcar seguimiento"
                      aria-label="He hecho seguimiento"
                    >
                      {statusUpdatingId === candidatura.id ? '…' : 'Seguimiento'}
                    </button>
                  )}
                  {candidatura.feedback && (
                    <button onClick={() => onOpenFeedback(candidatura.feedback)} className="bg-purple-600 text-white px-3 py-1 rounded font-bold text-xs" title="Ver feedback">Ver feedback</button>
                  )}
                  {candidatura.notas?.trim() && (
                    <button onClick={() => onOpenNotas(candidatura.notas)} className="bg-teal-600 text-white px-3 py-1 rounded font-bold text-xs" title="Ver notas">Ver notas</button>
                  )}
                  <button onClick={() => onEdit(candidatura)} className="bg-blue-600 text-white px-3 py-1 rounded font-bold text-xs" title="Editar candidatura">Editar</button>
                  <button onClick={() => onDuplicate(candidatura)} className="bg-indigo-600 text-white px-3 py-1 rounded font-bold text-xs" title="Duplicar candidatura">Duplicar</button>
                  <button onClick={() => onDelete(candidatura.id)} className="bg-red-600 text-white px-3 py-1 rounded font-bold text-xs" title="Borrar candidatura">Borrar</button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
