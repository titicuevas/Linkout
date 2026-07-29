export default function CandidaturasEmptyState({ onCreate }) {
  return (
    <div className="py-12 text-center text-gray-400 text-lg">
      <div className="flex flex-col items-center gap-2">
        <span className="text-5xl">😕</span>
        <span>No tienes candidaturas registradas.</span>
        <span className="text-sm text-gray-500">¡Empieza a crear tu primera candidatura!</span>
        <button onClick={onCreate} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-bold shadow-lg text-base">
          + Crear candidatura
        </button>
      </div>
    </div>
  );
}
