import { FORM_ESTADOS, estadoColorClass } from './shared';

/**
 * Select compacto para cambiar el estado sin abrir el modal completo.
 */
export default function EstadoQuickSelect({ value, onChange, disabled = false }) {
  return (
    <select
      value={value || ''}
      disabled={disabled}
      aria-label="Cambiar estado"
      onChange={(e) => {
        const next = e.target.value;
        if (next && next !== value) onChange(next);
      }}
      className={`max-w-[11rem] rounded-full border border-current bg-neutral-900/80 px-2 py-1 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-60 ${estadoColorClass(value)}`}
    >
      {FORM_ESTADOS.map((estado) => (
        <option key={estado.value} value={estado.value} className="bg-neutral-900 text-white">
          {estado.label}
        </option>
      ))}
    </select>
  );
}
