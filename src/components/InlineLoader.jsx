export default function InlineLoader({
  message = 'Cargando...',
  size = 'md',
  accent = 'pink',
}) {
  const sizeClass = size === 'sm' ? 'mb-3 h-10 w-10' : 'mb-4 h-12 w-12';
  const accentClass = accent === 'orange' ? 'border-t-orange-400' : 'border-t-pink-500';

  return (
    <div className="flex flex-col items-center justify-center py-12" role="status" aria-live="polite">
      <div className={`${sizeClass} animate-spin rounded-full border-4 border-neutral-700 ${accentClass}`} aria-hidden="true" />
      <div className="text-lg text-gray-300 font-bold">{message}</div>
    </div>
  );
}
