export default function LoadErrorState({
  message = 'No se pudieron cargar los datos. Inténtalo de nuevo.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <p className="text-lg text-red-300 font-bold mb-4" role="alert">{message}</p>
      {typeof onRetry === 'function' && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-500"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
