import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import Layout from '../../components/Layout';
import { inputBase, labelBase } from '../../styles/twHelpers';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { swalSuccess, swalError, swalWarning } from '../../utils/swalTheme';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { formatEstado, FORM_ESTADOS, FORM_ORIGENES, FRANJAS_SALARIAL, TIPOS_TRABAJO, suggestFranjaFromSalary, normalizeOrigen, toExternalUrl } from './shared';
import PageLoader from '../../components/PageLoader';
import { useAuth } from '../../hooks/useAuth';
import { useTitle } from '../../hooks/useTitle';

const CANDIDATURA_DRAFT_KEY = 'linkout_candidatura_draft';

export default function CrearCandidatura() {
  const { user, authLoading, logout } = useAuth();
  useTitle('Nueva Candidatura');
  const [error, setError] = useState('');
  const [puesto, setPuesto] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [empresaUrl, setEmpresaUrl] = useState('');
  const [estado, setEstado] = useState('entrevista_contacto');
  const [fecha, setFecha] = useState('');
  const [sueldoAnual, setSueldoAnual] = useState('');
  const [franjaSalarial, setFranjaSalarial] = useState('');
  const [tipoTrabajo, setTipoTrabajo] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [origen, setOrigen] = useState('');
  const [notas, setNotas] = useState('');
  const [draftReady, setDraftReady] = useState(false);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const savedDraft = localStorage.getItem(CANDIDATURA_DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setPuesto(draft.puesto || '');
        setEmpresa(draft.empresa || '');
        setEmpresaUrl(draft.empresaUrl || '');
        setEstado(draft.estado || 'entrevista_contacto');
        setFecha(draft.fecha || '');
        setSueldoAnual(draft.sueldoAnual || '');
        setFranjaSalarial(draft.franjaSalarial || '');
        setTipoTrabajo(draft.tipoTrabajo || '');
        setUbicacion(draft.ubicacion || '');
        setOrigen(draft.origen || '');
        setNotas(draft.notas || '');
      } catch {
        localStorage.removeItem(CANDIDATURA_DRAFT_KEY);
      }
    }
    setDraftReady(true);
  }, []);

  useEffect(() => {
    if (!draftReady) return;
    const isEmpty = !puesto && !empresa && !empresaUrl && !fecha && !sueldoAnual
      && !franjaSalarial && !tipoTrabajo && !ubicacion && !origen && !notas
      && estado === 'entrevista_contacto';
    if (isEmpty) {
      localStorage.removeItem(CANDIDATURA_DRAFT_KEY);
      return;
    }
    localStorage.setItem(
      CANDIDATURA_DRAFT_KEY,
      JSON.stringify({
        puesto,
        empresa,
        empresaUrl,
        estado,
        fecha,
        sueldoAnual,
        franjaSalarial,
        tipoTrabajo,
        ubicacion,
        origen,
        notas,
      }),
    );
  }, [draftReady, puesto, empresa, empresaUrl, estado, fecha, sueldoAnual, franjaSalarial, tipoTrabajo, ubicacion, origen, notas]);

  if (authLoading) return <PageLoader message="Preparando formulario..." />;
  if (!user) return null;

  const handleCancel = async () => {
    const result = await MySwal.fire(swalWarning('¿Cancelar candidatura?', '¿Seguro que quieres cancelar? Los datos no se guardarán.', {
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6366f1',
    }));
    if (result.isConfirmed) {
      localStorage.removeItem(CANDIDATURA_DRAFT_KEY);
      navigate('/candidaturas');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (!puesto.trim() || !empresa.trim() || !estado || !fecha || !tipoTrabajo || !ubicacion.trim() || !origen) {
      setError('Completa todos los campos obligatorios.');
      return;
    }
    const creationTimestamp = new Date().toLocaleString();
    const { error: dbError } = await supabase.from('candidaturas').insert([
      {
        user_id: user.id,
        puesto,
        empresa,
        empresa_url: toExternalUrl(empresaUrl) || empresaUrl.trim() || '',
        estado,
        fecha,
        salario_anual: sueldoAnual ? Number(sueldoAnual) : null,
        franja_salarial: franjaSalarial,
        tipo_trabajo: tipoTrabajo,
        ubicacion,
        origen: normalizeOrigen(origen),
        notas: notas.trim(),
        historial_cambios: [`[${creationTimestamp}] Candidatura creada con estado inicial: ${formatEstado(estado)}`],
        fecha_actualizacion: fecha,
      }
    ]);
    if (dbError) {
      await MySwal.fire(swalError('Error', 'No se pudo crear la candidatura.', { confirmButtonColor: '#ef4444' }));
      setError('No se pudo crear la candidatura.');
      return;
    }
    await MySwal.fire(swalSuccess('¡Candidatura creada!', 'Tu candidatura ha sido guardada.', {
      timer: 1200,
      showConfirmButton: false,
    }));
    localStorage.removeItem(CANDIDATURA_DRAFT_KEY);
    navigate('/candidaturas');
  };

  const maxDate = dayjs().format('YYYY-MM-DD');

  return (
    <Layout user={user} onLogout={logout}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full bg-neutral-900 px-4 sm:px-6 py-8">
        <div className="w-full max-w-md bg-neutral-900/90 rounded-2xl shadow-2xl p-5 sm:p-10 border border-neutral-700 flex flex-col items-center relative animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">Registrar Nueva Candidatura</h1>
          {error && <div className="bg-red-500 text-white p-3 rounded mb-4 w-full text-center animate-shake">{error}</div>}
          <form onSubmit={handleCreate} className="space-y-5 w-full text-lg">
            <div>
              <label htmlFor="cand-puesto" className={labelBase}>Puesto</label>
              <input
                id="cand-puesto"
                type="text"
                value={puesto}
                onChange={e => setPuesto(e.target.value)}
                className={inputBase + ' w-full'}
                required
              />
            </div>
            <div>
              <label htmlFor="cand-empresa" className={labelBase}>Empresa</label>
              <input
                id="cand-empresa"
                type="text"
                value={empresa}
                onChange={e => setEmpresa(e.target.value)}
                className={inputBase + ' w-full'}
                required
              />
            </div>
            <div>
              <label htmlFor="cand-empresa-url" className={labelBase + ' text-sm text-gray-400'}>URL de la empresa (opcional)</label>
              <input
                id="cand-empresa-url"
                type="text"
                inputMode="url"
                value={empresaUrl}
                onChange={e => setEmpresaUrl(e.target.value)}
                placeholder="empresa.com o https://www.empresa.com"
                className={inputBase + ' w-full text-sm'}
              />
            </div>
            <div>
              <label htmlFor="cand-estado" className={labelBase}>Estado</label>
              <select
                id="cand-estado"
                value={estado}
                onChange={e => setEstado(e.target.value)}
                className={inputBase + ' w-full'}
                required
              >
                {FORM_ESTADOS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="cand-fecha" className={labelBase}>Fecha</label>
              <input
                id="cand-fecha"
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className={inputBase + ' w-full'}
                required
                max={maxDate}
              />
            </div>
            <div>
              <label htmlFor="cand-sueldo" className={labelBase + ' text-lg'}>Sueldo anual (opcional)</label>
              <input
                id="cand-sueldo"
                type="number"
                min="0"
                step="100"
                value={sueldoAnual}
                onChange={e => {
                  setSueldoAnual(e.target.value);
                  setFranjaSalarial(suggestFranjaFromSalary(e.target.value));
                }}
                className={inputBase + ' text-lg py-3 w-full'}
                placeholder="Ej: 22000"
              />
            </div>
            <div>
              <label htmlFor="cand-franja" className={labelBase + ' text-lg'}>Franja salarial (opcional)</label>
              <select
                id="cand-franja"
                value={franjaSalarial}
                onChange={e => setFranjaSalarial(e.target.value)}
                className={inputBase + ' text-lg py-3 w-full'}
              >
                <option value="">Selecciona una franja</option>
                {FRANJAS_SALARIAL.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="cand-tipo" className={labelBase + ' text-lg'}>Tipo de trabajo</label>
              <select
                id="cand-tipo"
                value={tipoTrabajo}
                onChange={e => setTipoTrabajo(e.target.value)}
                className={inputBase + ' text-lg py-3 w-full'}
                required
              >
                <option value="">Selecciona tipo</option>
                {TIPOS_TRABAJO.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="cand-ubicacion" className={labelBase + ' text-lg'}>Ubicación</label>
              <input
                id="cand-ubicacion"
                type="text"
                value={ubicacion}
                onChange={e => setUbicacion(e.target.value)}
                className={inputBase + ' text-lg py-3 w-full'}
                required
                placeholder="Ciudad, país..."
              />
            </div>
            <div>
              <label htmlFor="cand-origen" className={labelBase + ' text-lg'}>Origen de la candidatura</label>
              <select
                id="cand-origen"
                value={origen}
                onChange={e => setOrigen(e.target.value)}
                className={inputBase + ' text-lg py-3 w-full'}
                required
              >
                <option value="">Selecciona origen</option>
                {FORM_ORIGENES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="cand-notas" className={labelBase + ' text-lg'}>Notas (opcional)</label>
              <textarea
                id="cand-notas"
                value={notas}
                onChange={e => setNotas(e.target.value)}
                className={inputBase + ' text-lg py-3 w-full min-h-[120px]'}
                placeholder="Apunta detalles de la oferta, sensaciones, dudas o próximos pasos..."
              />
            </div>
            <div className="flex w-full gap-2 mt-6 flex-col sm:flex-row">
              <button type="button" onClick={handleCancel} className="flex-1 px-4 py-3 bg-neutral-700 text-gray-300 rounded hover:bg-red-600 hover:text-white font-bold transition text-lg shadow-md">Cancelar candidatura</button>
              <button type="submit" className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-extrabold shadow-lg border-2 border-blue-700 text-lg transition-all duration-300">Crear Candidatura</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
} 