import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PageLoader from '../components/PageLoader';
import InlineLoader from '../components/InlineLoader';
import LoadErrorState from '../components/LoadErrorState';
import { useAuth } from '../hooks/useAuth';
import { useTitle } from '../hooks/useTitle';
import { supabase } from '../services/supabase';
import { isAdminUser } from '../utils/admin';

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return '—';
  }
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-neutral-700 bg-neutral-900/80 p-5 shadow-xl">
      <div className="text-sm font-semibold text-gray-400">{label}</div>
      <div className="mt-2 text-3xl font-extrabold text-white tabular-nums">{value ?? '—'}</div>
      {hint ? <div className="mt-1 text-xs text-gray-500">{hint}</div> : null}
    </div>
  );
}

export default function Admin() {
  const { user, authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useTitle('Admin');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const [{ data: statsData, error: statsError }, { data: usersData, error: usersError }] = await Promise.all([
      supabase.rpc('admin_dashboard_stats'),
      supabase.rpc('admin_recent_users', { limit_count: 40 }),
    ]);

    if (statsError || usersError) {
      setError(statsError?.message || usersError?.message || 'No se pudieron cargar las métricas.');
      setStats(null);
      setUsers([]);
      setLoading(false);
      return;
    }

    setStats(statsData || null);
    setUsers(Array.isArray(usersData) ? usersData : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    if (!isAdminUser(user)) {
      navigate('/index', { replace: true });
      return;
    }
    load();
  }, [authLoading, user, navigate, load]);

  if (authLoading || !user) {
    return <PageLoader message="Cargando panel de administración..." />;
  }

  if (!isAdminUser(user)) {
    return <PageLoader message="Redirigiendo..." />;
  }

  return (
    <Layout user={user} onLogout={logout}>
      <div
        className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-10"
        style={{ background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)' }}
      >
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Panel de control
            </h1>
            <p className="mt-2 text-gray-300 text-sm sm:text-base">
              Uso global de LinkOut: usuarios, actividad y contenido.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={load}
              className="rounded-full bg-neutral-800 px-5 py-2 text-sm font-bold text-white border border-neutral-600 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              Actualizar
            </button>
            <Link
              to="/index"
              className="rounded-full bg-pink-600 px-5 py-2 text-sm font-bold text-white hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-300 text-center"
            >
              Volver al panel
            </Link>
          </div>
        </div>

        {loading ? (
          <InlineLoader message="Cargando métricas..." />
        ) : error ? (
          <LoadErrorState
            message={error}
            onRetry={load}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <StatCard label="Usuarios totales" value={stats?.users_total} />
              <StatCard label="Activos (7 días)" value={stats?.users_active_7d} hint="Con last_seen reciente" />
              <StatCard label="Activos (30 días)" value={stats?.users_active_30d} />
              <StatCard label="Altas (7 días)" value={stats?.users_new_7d} />
              <StatCard label="Candidaturas" value={stats?.candidaturas_total} />
              <StatCard label="Entradas del diario" value={stats?.desahogos_total} />
            </div>

            <div className="rounded-2xl border border-neutral-700 bg-neutral-900/80 shadow-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-neutral-700 flex items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-white">Usuarios recientes</h2>
                <span className="text-xs text-gray-400">
                  Actualizado: {formatDate(stats?.generated_at)}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-neutral-800/80 text-gray-300 uppercase tracking-wide text-xs">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Usuario</th>
                      <th className="px-4 py-3 font-semibold">Alta</th>
                      <th className="px-4 py-3 font-semibold">Última actividad</th>
                      <th className="px-4 py-3 font-semibold">Candidaturas</th>
                      <th className="px-4 py-3 font-semibold">Diario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                          Aún no hay perfiles registrados.
                        </td>
                      </tr>
                    ) : (
                      users.map((row) => (
                        <tr key={row.id} className="border-t border-neutral-800 text-gray-200">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-white">{row.nombre || '—'}</div>
                            <div className="text-xs text-gray-400 break-all">{row.email || row.id}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">{formatDate(row.created_at)}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{formatDate(row.last_seen_at)}</td>
                          <td className="px-4 py-3 tabular-nums">{row.candidaturas_count ?? 0}</td>
                          <td className="px-4 py-3 tabular-nums">{row.desahogos_count ?? 0}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
