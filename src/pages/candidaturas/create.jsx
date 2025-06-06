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
  { value: 'descartado', label: 'Descartado' },
];

export default function CrearCandidatura() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [puesto, setPuesto] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [estado, setEstado] = useState('pendiente');
  const [fecha, setFecha] = useState('');
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
    if (!puesto.trim() || !empresa.trim() || !estado || !fecha) {
      setError('Completa todos los campos.');
      return;
    }
    const { error: dbError } = await supabase.from('candidaturas').insert([
      { user_id: user.id, puesto, empresa, estado, fecha }
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
          <form onSubmit={handleCreate} className="space-y-4 w-full">
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