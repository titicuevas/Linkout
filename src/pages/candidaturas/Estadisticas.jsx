import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import Layout from '../../components/Layout';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import PageLoader from '../../components/PageLoader';
import { useAuth } from '../../hooks/useAuth';
import { useTitle } from '../../hooks/useTitle';
import { formatOrigen, formatEstado, isActiveProcess, getFollowUpsPendientes } from './shared';

const COLORS = ['#6366f1', '#e11d48', '#f59e42', '#10b981', '#fbbf24', '#3b82f6', '#ef4444', '#a21caf', '#f472b6'];

const campos = [
  { key: 'estado', label: 'Estado' },
  { key: 'origen', label: 'Origen' },
  { key: 'tipo_trabajo', label: 'Tipo de trabajo' },
  { key: 'ubicacion', label: 'Ubicación' },
  { key: 'franja_salarial', label: 'Franja salarial' },
];

export default function EstadisticasCandidaturas() {
  const { user, authLoading, logout } = useAuth();
  useTitle('Estadísticas');
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function fetchCandidaturas() {
      if (!user) return;
      setLoading(true);
      setLoadError('');
      const { data, error } = await supabase.from('candidaturas').select('*').eq('user_id', user.id);
      if (cancelled) return;
      if (error) {
        setLoadError('No se pudieron cargar las estadísticas. Inténtalo de nuevo.');
        setCandidaturas([]);
      } else {
        setCandidaturas(data || []);
      }
      setLoading(false);
    }
    fetchCandidaturas();
    return () => { cancelled = true; };
  }, [user]);

  const getDataByField = (field) => {
    const counts = {};
    candidaturas.forEach((c) => {
      let val = c[field] || 'Sin especificar';
      if (field === 'origen') {
        const formatted = formatOrigen(c[field]);
        val = formatted === '-' ? 'Sin especificar' : formatted;
      } else if (field === 'estado') {
        val = c[field] ? formatEstado(c[field]) : 'Sin especificar';
      }
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }));
  };

  const procesosActivos = candidaturas.filter(isActiveProcess);
  const contrataciones = candidaturas.filter((candidatura) => candidatura.estado === 'contratacion').length;
  const rechazo = candidaturas.filter((candidatura) => candidatura.estado === 'rechazado').length;
  const followUpsPendientes = getFollowUpsPendientes(candidaturas).length;
  const ratioExito = candidaturas.length > 0 ? Math.round((contrataciones / candidaturas.length) * 100) : 0;
  const insightPrincipal = followUpsPendientes > 0
    ? `Tienes ${followUpsPendientes} proceso${followUpsPendientes === 1 ? '' : 's'} que probablemente necesitan seguimiento.`
    : procesosActivos.length > 0
      ? 'Tus procesos activos están en movimiento. Buen momento para preparar entrevistas o reforzar candidaturas.'
      : 'No hay procesos activos ahora mismo. Tal vez conviene reactivar la búsqueda esta semana.';

  const insightCta = followUpsPendientes > 0
    ? { label: 'Ver seguimientos', path: '/candidaturas?seguimiento=1' }
    : procesosActivos.length > 0
      ? { label: 'Ver procesos activos', path: '/candidaturas?estado=en_proceso' }
      : { label: 'Crear candidatura', path: '/candidaturas/create' };

  if (authLoading) return <PageLoader message="Preparando estadísticas..." />;
  if (!user) return null;

  return (
    <Layout user={user} onLogout={logout}>
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-neutral-900 px-4 sm:px-6 py-8 relative">
        <div className="w-full flex justify-start mb-8">
          <button
            type="button"
            onClick={() => navigate('/candidaturas')}
            className="flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-pink-600 text-white rounded-full shadow-lg font-extrabold text-lg border-2 border-pink-400 outline-none focus:ring-4 focus:ring-pink-200 transition-all drop-shadow-lg tracking-wide"
          >
            ← Volver a candidaturas
          </button>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">Estadísticas de Candidaturas</h1>
        {loading ? (
          <PageLoader message="Cargando estadísticas..." />
        ) : loadError ? (
          <div className="text-center py-10">
            <p className="text-lg text-red-300 font-bold mb-4">{loadError}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold"
            >
              Reintentar
            </button>
          </div>
        ) : candidaturas.length === 0 ? (
          <div className="w-full max-w-xl text-center rounded-3xl border border-neutral-700 bg-neutral-800/80 p-8 shadow-2xl">
            <p className="text-xl font-bold text-white mb-2">Aún no hay datos que mostrar</p>
            <p className="text-gray-400 mb-6">Crea tu primera candidatura para ver ratios, orígenes y seguimientos aquí.</p>
            <button
              type="button"
              onClick={() => navigate('/candidaturas/create')}
              className="rounded-full bg-pink-600 px-6 py-3 font-bold text-white hover:bg-pink-500"
            >
              Crear candidatura
            </button>
          </div>
        ) : (
          <>
            <div className="w-full max-w-6xl mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => navigate('/candidaturas')}
                className="rounded-2xl border border-blue-800 bg-blue-950/60 p-5 shadow-xl text-left transition hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <div className="text-sm font-semibold text-blue-200">Total registradas</div>
                <div className="mt-2 text-3xl font-extrabold text-white">{candidaturas.length}</div>
              </button>
              <button
                type="button"
                onClick={() => navigate('/candidaturas?estado=en_proceso')}
                className="rounded-2xl border border-purple-800 bg-purple-950/60 p-5 shadow-xl text-left transition hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                <div className="text-sm font-semibold text-purple-200">Procesos activos</div>
                <div className="mt-2 text-3xl font-extrabold text-white">{procesosActivos.length}</div>
              </button>
              <button
                type="button"
                onClick={() => navigate('/candidaturas?estado=contratacion')}
                className="rounded-2xl border border-green-800 bg-green-950/60 p-5 shadow-xl text-left transition hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-300"
                title="Ver contrataciones"
              >
                <div className="text-sm font-semibold text-green-200">Ratio de contratación</div>
                <div className="mt-2 text-3xl font-extrabold text-white">{ratioExito}%</div>
              </button>
              <button
                type="button"
                onClick={() => navigate('/candidaturas?seguimiento=1')}
                className="rounded-2xl border border-yellow-700 bg-yellow-950/50 p-5 shadow-xl text-left transition hover:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              >
                <div className="text-sm font-semibold text-yellow-200">Seguimientos pendientes</div>
                <div className="mt-2 text-3xl font-extrabold text-white">{followUpsPendientes}</div>
              </button>
            </div>

            <div className="w-full max-w-6xl mb-8 rounded-3xl border border-neutral-700 bg-neutral-800/80 p-5 sm:p-6 shadow-2xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-wide text-pink-300">Lectura rápida</div>
                  <p className="mt-2 text-base sm:text-lg font-medium text-white">{insightPrincipal}</p>
                  <p className="mt-2 text-sm text-gray-400">
                    No seleccionadas: {rechazo}. Contrataciones: {contrataciones}. Usa esta lectura para decidir si te conviene hacer seguimiento o abrir más procesos nuevos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(insightCta.path)}
                  className="rounded-full bg-pink-600 px-5 py-3 text-sm sm:text-base font-bold text-white shadow-lg transition hover:bg-pink-500 shrink-0"
                >
                  {insightCta.label}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
              {campos.map((campo) => {
                const data = getDataByField(campo.key);
                return (
                  <div key={campo.key} className="bg-neutral-800/80 rounded-2xl shadow-2xl p-6 border border-neutral-700 flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-4 text-pink-300">{campo.label}</h2>
                    {data.length === 0 ? (
                      <div className="text-gray-400">Sin datos</div>
                    ) : (
                      <ResponsiveContainer width="100%" height={260}>
                        {data.length <= 6 ? (
                          <PieChart>
                            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                              {data.map((entry, i) => <Cell key={`cell-${i}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        ) : (
                          <BarChart data={data}>
                            <XAxis dataKey="name" stroke="#fff" fontSize={12} />
                            <YAxis stroke="#fff" fontSize={12} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#e11d48" />
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
