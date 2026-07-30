import { SORT_OPTIONS } from './shared';

export default function CandidaturasFilters({
  estados,
  origenes,
  filtroEstado,
  filtroOrigen,
  filtroSeguimiento,
  filtroRecientes = false,
  followUpCount = 0,
  searchQuery,
  sortBy = 'fecha',
  sortDir = 'desc',
  onSelectEstado,
  onSelectOrigen,
  onToggleSeguimiento,
  onToggleRecientes,
  onSearchChange,
  onSortChange,
  onSortDirChange,
  onClearFilters,
  hasActiveFilters = false,
  onOpenStats,
  onExport,
  resultCount,
  savedViews = [],
  onSaveView,
  onApplyView,
  onDeleteView,
}) {
  return (
    <div className="flex flex-col gap-4 mb-4 w-full max-w-6xl mx-auto">
      <div className="w-full">
        <label htmlFor="candidaturas-search" className="sr-only">Buscar candidaturas</label>
        <input
          id="candidaturas-search"
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por puesto, empresa, ubicación, feedback o notas..."
          className="w-full rounded-2xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          {typeof resultCount === 'number' && (
            <p className="text-sm text-gray-400">
              {resultCount} resultado{resultCount === 1 ? '' : 's'}
            </p>
          )}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-sm font-semibold text-pink-300 hover:text-pink-200"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3 sm:hidden">
        <div className="flex-1 min-w-[10rem]">
          <label htmlFor="candidaturas-sort-by" className="mb-1 block text-xs font-semibold text-gray-400">
            Ordenar por
          </label>
          <select
            id="candidaturas-sort-by"
            value={sortBy}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="min-w-[8rem]">
          <label htmlFor="candidaturas-sort-dir" className="mb-1 block text-xs font-semibold text-gray-400">
            Dirección
          </label>
          <select
            id="candidaturas-sort-dir"
            value={sortDir}
            onChange={(e) => onSortDirChange?.(e.target.value)}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-700 bg-neutral-900/70 p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-blue-200">Vistas guardadas</div>
            <p className="text-xs text-gray-400 mt-1">
              Guarda la combinación actual de filtros para reutilizarla.
            </p>
          </div>
          <button
            type="button"
            onClick={onSaveView}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-blue-500"
          >
            Guardar vista actual
          </button>
        </div>

        {savedViews.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">Aún no tienes vistas guardadas.</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {savedViews.map((view) => (
              <div
                key={view.id}
                className="flex items-center gap-1 rounded-full border border-neutral-600 bg-neutral-800 pl-3 pr-1 py-1"
              >
                <button
                  type="button"
                  onClick={() => onApplyView(view)}
                  className="text-sm font-semibold text-white hover:text-pink-200"
                  title="Aplicar esta vista"
                >
                  {view.name}
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteView(view.id)}
                  className="ml-1 rounded-full px-2 py-0.5 text-xs font-bold text-red-300 hover:bg-red-500/20"
                  aria-label={`Eliminar vista ${view.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-pressed={filtroSeguimiento}
          aria-label="Filtrar por seguimiento pendiente"
          onClick={onToggleSeguimiento}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border-2 font-bold text-xs sm:text-sm shadow-lg focus:ring-2 focus:ring-yellow-300 ${
            filtroSeguimiento
              ? 'bg-yellow-400 text-neutral-900 border-yellow-300'
              : 'bg-neutral-800 text-yellow-200 border-yellow-500/60'
          }`}
        >
          Seguimiento pendiente
          {followUpCount > 0 && (
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${filtroSeguimiento ? 'bg-neutral-900 text-yellow-300' : 'bg-yellow-500/20 text-yellow-200'}`}>
              {followUpCount}
            </span>
          )}
        </button>
        <button
          type="button"
          aria-pressed={filtroRecientes}
          onClick={onToggleRecientes}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border-2 font-bold text-xs sm:text-sm shadow-lg focus:ring-2 focus:ring-green-300 ${
            filtroRecientes
              ? 'bg-green-500 text-neutral-900 border-green-300'
              : 'bg-neutral-800 text-green-200 border-green-500/60'
          }`}
        >
          Últimos 7 días
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap" role="group" aria-label="Filtrar por estado">
          {estados.map((estado) => (
            <button
              key={estado.value}
              type="button"
              aria-pressed={estado.value === filtroEstado}
              onClick={() => onSelectEstado(estado.value)}
              className={`flex items-center px-3 sm:px-4 py-2 rounded-full border-2 font-bold text-xs sm:text-sm shadow-lg focus:ring-2 focus:ring-pink-400 bg-neutral-800 text-pink-200 border-pink-400 ${estado.value === filtroEstado ? 'bg-pink-600 text-white' : ''}`}
            >
              {estado.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap" role="group" aria-label="Filtrar por origen">
          {origenes.map((origen) => (
            <button
              key={origen.value}
              type="button"
              aria-pressed={origen.value === filtroOrigen}
              onClick={() => onSelectOrigen(origen.value)}
              className={`flex items-center px-3 sm:px-4 py-2 rounded-full border-2 font-bold text-xs sm:text-sm shadow-lg focus:ring-2 focus:ring-pink-400 bg-neutral-800 text-pink-200 border-pink-400 ${origen.value === filtroOrigen ? 'bg-pink-600 text-white' : ''}`}
            >
              {origen.label}
            </button>
          ))}
        </div>

        <div className="flex w-full sm:w-auto gap-3 flex-col sm:flex-row">
          <button
            type="button"
            onClick={onExport}
            className="w-full sm:w-auto justify-center flex items-center gap-2 px-5 py-3 bg-neutral-800 text-white rounded-full shadow-xl font-bold text-sm sm:text-base border border-neutral-600 outline-none focus:ring-4 focus:ring-blue-200"
          >
            <span className="text-lg" aria-hidden="true">⬇</span> Exportar CSV
          </button>
          <button
            type="button"
            onClick={onOpenStats}
            className="w-full sm:w-auto justify-center flex items-center gap-2 px-5 sm:px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-500 to-pink-500 text-white rounded-full shadow-2xl font-extrabold text-base sm:text-lg border-2 border-white outline-none focus:ring-4 focus:ring-pink-200 drop-shadow-lg tracking-wide"
            style={{ boxShadow: '0 6px 32px 0 rgba(37,99,235,0.18)' }}
          >
            <span className="text-xl" aria-hidden="true">📊</span> Ver estadísticas
          </button>
        </div>
      </div>
    </div>
  );
}
