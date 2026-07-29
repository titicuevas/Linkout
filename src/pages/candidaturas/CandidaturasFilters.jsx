export default function CandidaturasFilters({
  estados,
  origenes,
  filtroEstado,
  filtroOrigen,
  filtroSeguimiento,
  followUpCount = 0,
  searchQuery,
  onSelectEstado,
  onSelectOrigen,
  onToggleSeguimiento,
  onSearchChange,
  onOpenStats,
  onExport,
  resultCount,
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
          placeholder="Buscar por puesto, empresa, ubicación o feedback..."
          className="w-full rounded-2xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        {typeof resultCount === 'number' && (
          <p className="mt-2 text-sm text-gray-400">
            {resultCount} resultado{resultCount === 1 ? '' : 's'}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-pressed={filtroSeguimiento}
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
