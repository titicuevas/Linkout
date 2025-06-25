import { useState } from 'react';
import { supabase } from '../../services/supabase';
import Layout from '../../components/Layout';
import { inputBase, labelBase } from '../../styles/twHelpers';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const ESTADOS = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_proceso', label: 'En proceso' },
  { value: 'aceptado', label: 'Aceptado' },
  { value: 'rechazado', label: 'Rechazado' },
];

const FRANJAS_SALARIAL = [
  '< 15.000 €',
  '15.000 - 20.000 €',
  '20.000 - 25.000 €',
  '25.000 - 30.000 €',
  '30.000 - 40.000 €',
  '> 40.000 €',
];

const TIPOS_TRABAJO = [
  'Presencial',
  'Remoto',
  'Híbrido',
];

export default function CrearCandidatura() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [puesto, setPuesto] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [estado, setEstado] = useState('pendiente');
  const [fecha, setFecha] = useState('');
  const [sueldoAnual, setSueldoAnual] = useState('');
  const [franjaSalarial, setFranjaSalarial] = useState('');
  const [tipoTrabajo, setTipoTrabajo] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  // Obtener usuario autenticado
  useState(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        navigate('/login');
      } else {
        setUser(data.user);
      }
    });
  }, []);

  if (!user) return null;

  const handleCancel = async () => {
    const result = await MySwal.fire({
      title: '¿Cancelar candidatura?',
      text: '¿Seguro que quieres cancelar? Los datos no se guardarán.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No',
      background: '#18181b',
      color: '#fff',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6366f1',
    });
    if (result.isConfirmed) navigate('/candidaturas');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (!puesto.trim() || !empresa.trim() || !estado || !fecha || !tipoTrabajo || !ubicacion.trim()) {
      setError('Completa todos los campos obligatorios.');
      return;
    }
    const { error: dbError } = await supabase.from('candidaturas').insert([
      { user_id: user.id, puesto, empresa, estado, fecha, salario_anual: sueldoAnual ? Number(sueldoAnual) : null, franja_salarial: franjaSalarial, tipo_trabajo: tipoTrabajo, ubicacion }
    ]);
    if (dbError) {
      await MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear la candidatura.',
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#ef4444',
      });
      setError('No se pudo crear la candidatura.');
      return;
    }
    await MySwal.fire({
      icon: 'success',
      title: '¡Candidatura creada!',
      text: 'Tu candidatura ha sido guardada.',
      background: '#18181b',
      color: '#fff',
      confirmButtonColor: '#6366f1',
    });
    navigate('/candidaturas');
  };

  const maxDate = dayjs().format('YYYY-MM-DD');

  return (
    <Layout user={user} onLogout={async () => { await supabase.auth.signOut(); navigate('/login'); }}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
        <div className="w-full max-w-md bg-neutral-800 rounded-lg shadow-2xl p-8 border border-neutral-700 flex flex-col items-center relative">
          <h1 className="text-3xl font-extrabold text-center mb-6 tracking-tight">Nueva Candidatura</h1>
          {error && <div className="bg-red-500 text-white p-3 rounded mb-4 w-full text-center">{error}</div>}
          <form onSubmit={handleCreate} className="space-y-6 w-full text-lg">
            <div>
              <label className={labelBase}>Puesto</label>
              <input
                type="text"
                value={puesto}
                onChange={e => setPuesto(e.target.value)}
                className={inputBase}
                required
              />
            </div>
            <div>
              <label className={labelBase}>Empresa</label>
              <input
                type="text"
                value={empresa}
                onChange={e => setEmpresa(e.target.value)}
                className={inputBase}
                required
              />
            </div>
            <div>
              <label className={labelBase}>Estado</label>
              <select
                value={estado}
                onChange={e => setEstado(e.target.value)}
                className={inputBase}
                required
              >
                {ESTADOS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelBase}>Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className={inputBase}
                required
                max={maxDate}
              />
            </div>
            <div>
              <label className={labelBase + ' text-lg'}>Sueldo anual (opcional)</label>
              <input
                type="number"
                min="0"
                step="100"
                value={sueldoAnual}
                onChange={e => {
                  setSueldoAnual(e.target.value);
                  // Sugerir franja automáticamente
                  const v = Number(e.target.value);
                  if (!v) return setFranjaSalarial('');
                  if (v < 15000) setFranjaSalarial('< 15.000 €');
                  else if (v < 20000) setFranjaSalarial('15.000 - 20.000 €');
                  else if (v < 25000) setFranjaSalarial('20.000 - 25.000 €');
                  else if (v < 30000) setFranjaSalarial('25.000 - 30.000 €');
                  else if (v < 40000) setFranjaSalarial('30.000 - 40.000 €');
                  else setFranjaSalarial('> 40.000 €');
                }}
                className={inputBase + ' text-lg py-3'}
                placeholder="Ej: 22000"
              />
            </div>
            <div>
              <label className={labelBase + ' text-lg'}>Franja salarial (opcional)</label>
              <select
                value={franjaSalarial}
                onChange={e => setFranjaSalarial(e.target.value)}
                className={inputBase + ' text-lg py-3'}
              >
                <option value="">Selecciona una franja</option>
                {FRANJAS_SALARIAL.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className={labelBase + ' text-lg'}>Tipo de trabajo</label>
              <select
                value={tipoTrabajo}
                onChange={e => setTipoTrabajo(e.target.value)}
                className={inputBase + ' text-lg py-3'}
                required
              >
                <option value="">Selecciona tipo</option>
                {TIPOS_TRABAJO.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelBase + ' text-lg'}>Ubicación</label>
              <input
                type="text"
                value={ubicacion}
                onChange={e => setUbicacion(e.target.value)}
                className={inputBase + ' text-lg py-3'}
                required
                placeholder="Ciudad, país..."
              />
            </div>
            <div className="flex w-full gap-2 mt-6">
              <button type="button" onClick={handleCancel} className="flex-1 px-4 py-2 bg-neutral-700 text-gray-300 rounded hover:bg-red-600 hover:text-white font-bold transition">Cancelar candidatura</button>
              <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 via-pink-400 to-yellow-400 text-white rounded font-extrabold shadow-lg hover:from-pink-400 hover:to-blue-400 transition">Crear Candidatura</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
} 