import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import Modal from '../../components/Modal';
import Swal from 'sweetalert2';
import { PencilSquareIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/solid';
import {
  buildChangeHistory,
  FORM_ESTADOS,
  FORM_ORIGENES,
  FRANJAS_SALARIAL,
  TIPOS_TRABAJO,
  normalizeOrigen,
} from './shared';
import { swalSuccess, swalError } from '../../utils/swalTheme';

const inputCls = 'bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600';
const labelCls = 'flex flex-col gap-1';
const spanCls = 'text-sm font-semibold text-gray-300';

export default function CandidaturaEditModal({ isOpen, candidatura, onClose, onSaved }) {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && candidatura) {
      setEstadoSeleccionado(candidatura.estado || '');
    }
  }, [isOpen, candidatura]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!candidatura || saving) return;

    const form = e.target;
    const updated = {
      puesto: form.puesto.value,
      empresa: form.empresa.value,
      estado: form.estado.value,
      fecha: form.fecha.value,
      salario_anual: form.salario_anual.value ? Number(form.salario_anual.value) : null,
      franja_salarial: form.franja_salarial.value,
      tipo_trabajo: form.tipo_trabajo.value,
      ubicacion: form.ubicacion.value,
      origen: normalizeOrigen(form.origen.value),
      empresa_url: form.empresa_url.value.trim(),
      feedback: form.feedback.value,
      notas: form.notas.value,
      fecha_actualizacion: new Date().toISOString(),
    };

    const historyEntries = buildChangeHistory(candidatura, updated);
    const updatedPayload = {
      ...updated,
      historial_cambios: historyEntries.length > 0
        ? [...(candidatura.historial_cambios || []), ...historyEntries]
        : candidatura.historial_cambios || [],
    };

    if (candidatura.estado === 'rechazado' && updated.estado !== 'rechazado') {
      localStorage.removeItem(`reto_completado_${candidatura.id}`);
    }

    setSaving(true);
    const { error } = await supabase.from('candidaturas').update(updatedPayload).eq('id', candidatura.id);
    setSaving(false);

    if (!error) {
      onClose();
      await Swal.fire(swalSuccess('Candidatura actualizada', 'Los cambios se han guardado correctamente.', { timer: 1800, showConfirmButton: false }));
      onSaved({ ...candidatura, ...updatedPayload });
    } else {
      await Swal.fire(swalError('Error', 'No se pudieron guardar los cambios.'));
    }
  };

  if (!candidatura) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        key={candidatura.id}
        className="flex flex-col gap-5 w-full min-w-0 sm:min-w-[320px]"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 mx-auto">
            <PencilSquareIcon className="w-6 h-6 text-blue-500" />
            <h2 id="edit-candidatura-title" className="text-xl font-bold text-center">Editar candidatura</h2>
          </div>
          <button type="button" className="ml-2 p-1 rounded" onClick={onClose} aria-label="Cerrar">
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <label className={labelCls}>
          <span className={spanCls}>Puesto</span>
          <input name="puesto" defaultValue={candidatura.puesto} className={inputCls} required />
        </label>

        <label className={labelCls}>
          <span className={spanCls}>Empresa</span>
          <input name="empresa" defaultValue={candidatura.empresa} className={inputCls} required />
        </label>

        <label className={labelCls}>
          <span className={`${spanCls} text-gray-400`}>URL de la empresa (opcional)</span>
          <input
            name="empresa_url"
            type="url"
            defaultValue={candidatura.empresa_url || ''}
            className={`${inputCls} text-sm`}
            placeholder="https://www.empresa.com"
          />
        </label>

        <label className={labelCls}>
          <span className={spanCls}>Estado</span>
          <select
            name="estado"
            value={estadoSeleccionado}
            onChange={(e) => setEstadoSeleccionado(e.target.value)}
            className={inputCls}
            required
          >
            {FORM_ESTADOS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>

        <label className={labelCls}>
          <span className={spanCls}>Fecha</span>
          <input
            name="fecha"
            type="date"
            defaultValue={candidatura.fecha ? new Date(candidatura.fecha).toISOString().split('T')[0] : ''}
            className={inputCls}
            required
          />
        </label>

        <label className={labelCls}>
          <span className={spanCls}>Salario anual (opcional)</span>
          <input
            name="salario_anual"
            type="number"
            min="0"
            step="100"
            defaultValue={candidatura.salario_anual || ''}
            className={`${inputCls} text-lg`}
            placeholder="Ej: 22000"
          />
        </label>

        <label className={labelCls}>
          <span className={spanCls}>Franja salarial (opcional)</span>
          <select name="franja_salarial" defaultValue={candidatura.franja_salarial || ''} className={`${inputCls} text-lg`}>
            <option value="">Selecciona una franja</option>
            {FRANJAS_SALARIAL.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </label>

        <label className={labelCls}>
          <span className={spanCls}>Tipo de trabajo</span>
          <select name="tipo_trabajo" defaultValue={candidatura.tipo_trabajo || ''} className={`${inputCls} text-lg`} required>
            <option value="">Selecciona tipo</option>
            {TIPOS_TRABAJO.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>

        <label className={labelCls}>
          <span className={spanCls}>Ubicación</span>
          <input
            name="ubicacion"
            type="text"
            defaultValue={candidatura.ubicacion || ''}
            className={`${inputCls} text-lg`}
            required
            placeholder="Ciudad, país..."
          />
        </label>

        <label className={labelCls}>
          <span className={spanCls}>Origen de la candidatura</span>
          <select
            name="origen"
            defaultValue={normalizeOrigen(candidatura.origen) || ''}
            className={`${inputCls} text-lg`}
            required
          >
            <option value="">Selecciona origen</option>
            {FORM_ORIGENES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>

        <label className={labelCls}>
          <span className={spanCls}>Feedback de reclutador</span>
          <textarea
            name="feedback"
            defaultValue={candidatura.feedback || ''}
            className={`${inputCls} min-h-[60px]`}
            placeholder="Feedback recibido, comentarios de entrevistas... (opcional)"
          />
        </label>

        <label className={labelCls}>
          <span className={spanCls}>Notas personales</span>
          <textarea
            name="notas"
            defaultValue={candidatura.notas || ''}
            className={`${inputCls} min-h-[120px]`}
            placeholder="Detalles de la oferta, sensaciones, acciones pendientes... (opcional)"
          />
        </label>

        <div className="rounded-xl border border-neutral-700 bg-neutral-900/70 p-3">
          <div className="text-sm font-semibold text-pink-300 mb-2">Historial de cambios</div>
          {Array.isArray(candidatura.historial_cambios) && candidatura.historial_cambios.length > 0 ? (
            <ul className="max-h-40 overflow-y-auto space-y-2 text-xs text-gray-300">
              {[...candidatura.historial_cambios].reverse().map((entry, idx) => (
                <li key={`${idx}-${entry}`} className="border-b border-neutral-800 pb-2 last:border-0">
                  {entry}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500">Todavía no hay cambios registrados para esta candidatura.</p>
          )}
        </div>

        <div className="flex gap-2 justify-end mt-2 flex-col-reverse sm:flex-row">
          <button
            type="button"
            className="bg-neutral-700 text-white font-semibold py-2 px-4 rounded flex items-center gap-2"
            onClick={onClose}
          >
            <XMarkIcon className="w-5 h-5" />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded flex items-center gap-2 disabled:opacity-60"
          >
            <CheckIcon className="w-5 h-5" />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
