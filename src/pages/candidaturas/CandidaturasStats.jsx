export default function CandidaturasStats({ candidaturas }) {
  return (
    <div className="w-full max-w-6xl mx-auto mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-blue-900/80 to-blue-800/60 rounded-xl p-4 text-center border border-blue-700 shadow-2xl">
        <div className="text-3xl mb-1">📋</div>
        <div className="text-2xl font-bold text-blue-300">{candidaturas.length}</div>
        <div className="text-sm text-blue-200">Total Candidaturas</div>
      </div>
      <div className="bg-gradient-to-br from-green-900/80 to-green-800/60 rounded-xl p-4 text-center border border-green-700 shadow-2xl">
        <div className="text-3xl mb-1">🟢</div>
        <div className="text-2xl font-bold text-green-300">
          {candidaturas.filter((candidatura) => candidatura.estado === 'contratacion').length}
        </div>
        <div className="text-sm text-green-200">Contrataciones</div>
      </div>
      <div className="bg-gradient-to-br from-purple-900/80 to-purple-800/60 rounded-xl p-4 text-center border border-purple-700 shadow-2xl">
        <div className="text-3xl mb-1">🟣</div>
        <div className="text-2xl font-bold text-purple-300">
          {candidaturas.filter((candidatura) => candidatura.estado !== 'rechazado' && candidatura.estado !== 'contratacion').length}
        </div>
        <div className="text-sm text-purple-200">En Proceso</div>
      </div>
      <div className="bg-gradient-to-br from-red-900/80 to-red-800/60 rounded-xl p-4 text-center border border-red-700 shadow-2xl">
        <div className="text-3xl mb-1">❌</div>
        <div className="text-2xl font-bold text-red-300">
          {candidaturas.filter((candidatura) => candidatura.estado === 'rechazado').length}
        </div>
        <div className="text-sm text-red-200">No seleccionadas</div>
      </div>
    </div>
  );
}
