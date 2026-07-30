export default function PageLoader({ message = 'Cargando...' }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-900 px-4">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neutral-700 border-t-pink-500" aria-hidden="true" />
        <p className="text-base font-semibold text-gray-300" role="status">{message}</p>
      </div>
    </div>
  );
}
