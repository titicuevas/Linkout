import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { ClipboardDocumentListIcon, PencilSquareIcon, ChatBubbleLeftRightIcon, BoltIcon } from '@heroicons/react/24/solid';
import Layout from '../components/Layout';
import PageLoader from '../components/PageLoader';
import { useAuth } from '../hooks/useAuth';
import { useTitle } from '../hooks/useTitle';
import {
  isActiveProcess,
  getFollowUpsPendientes,
  getReferenceDate,
  formatEstado,
  formatInactivityLabel,
} from './candidaturas/shared';
import { PROFILE_UPDATED_EVENT } from '../utils/profileEvents';
import { getDisplayName } from '../utils/displayName';

export default function Index() {
  const { user, authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [candidaturas, setCandidaturas] = useState([]);
  const [updatingFollowUpId, setUpdatingFollowUpId] = useState(null);
  const [followUpError, setFollowUpError] = useState('');

  useTitle('Panel');

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => setProfile(data));
  }, [user]);

  useEffect(() => {
    const handleProfileUpdated = (event) => {
      setProfile((current) => ({ ...(current || {}), ...(event.detail || {}) }));
    };

    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);
    return () => window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchCandidaturas() {
      if (!user) return;
      const { data, error } = await supabase
        .from('candidaturas')
        .select('id, empresa, puesto, estado, fecha, fecha_actualizacion, created_at')
        .eq('user_id', user.id);

      if (cancelled) return;
      if (!error) {
        setCandidaturas(data || []);
      }
    }

    fetchCandidaturas();
    return () => { cancelled = true; };
  }, [user]);

  const followUps = useMemo(() => getFollowUpsPendientes(candidaturas), [candidaturas]);

  const resumen = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const activeStates = candidaturas.filter(isActiveProcess);
    const recentApplications = candidaturas.filter((candidatura) => candidatura.fecha && new Date(candidatura.fecha) >= sevenDaysAgo).length;

    const latestUpdate = [...candidaturas]
      .map(getReferenceDate)
      .filter(Boolean)
      .sort((a, b) => new Date(b) - new Date(a))[0];

    return {
      total: candidaturas.length,
      activeProcesses: activeStates.length,
      recentApplications,
      followUpsPending: followUps.length,
      latestUpdate: latestUpdate ? new Date(latestUpdate).toLocaleDateString() : null,
    };
  }, [candidaturas, followUps]);

  const insightMessage = resumen.followUpsPending > 0
    ? `Tienes ${resumen.followUpsPending} proceso${resumen.followUpsPending === 1 ? '' : 's'} sin movimiento reciente. Quizá toca hacer seguimiento.`
    : resumen.activeProcesses > 0
      ? 'Tus procesos activos están al día. Buen momento para seguir aplicando o preparar entrevistas.'
      : 'Aún no tienes procesos activos. Crear una nueva candidatura puede ser tu mejor siguiente paso.';

  const insightCta = resumen.followUpsPending > 0
    ? { label: 'Ver seguimientos', path: '/candidaturas?seguimiento=1' }
    : resumen.activeProcesses > 0
      ? { label: 'Ver procesos activos', path: '/candidaturas?estado=en_proceso' }
      : { label: 'Crear candidatura', path: '/candidaturas/create' };

  const handleMarkFollowUp = async (candidaturaId) => {
    if (!user || updatingFollowUpId) return;
    setUpdatingFollowUpId(candidaturaId);
    setFollowUpError('');
    const today = new Date().toISOString().slice(0, 10);
    const { error } = await supabase
      .from('candidaturas')
      .update({ fecha_actualizacion: today })
      .eq('id', candidaturaId)
      .eq('user_id', user.id);

    if (error) {
      setFollowUpError('No se pudo marcar el seguimiento. Inténtalo de nuevo.');
      setUpdatingFollowUpId(null);
      return;
    }

    setCandidaturas((current) =>
      current.map((item) =>
        item.id === candidaturaId ? { ...item, fecha_actualizacion: today } : item,
      ),
    );
    setUpdatingFollowUpId(null);
  };

  if (authLoading) return <PageLoader message="Preparando tu panel..." />;
  if (!user) return null;

  return (
    <Layout user={user} onLogout={logout}>
      <div className="min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-center px-4 sm:px-6 py-8" style={{ background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)' }}>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-2 tracking-tight drop-shadow-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in">
          ¡Hola, <span className="text-blue-400">{getDisplayName(profile, user)}</span>!
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-white animate-fade-in">Tu centro de control para la búsqueda de trabajo</h2>
        <div className="text-lg sm:text-xl text-gray-200 mb-6 max-w-2xl text-center font-medium animate-fade-in">
          Organiza tus candidaturas, mantén tu motivación y supera nuevos retos. ¡Este es tu espacio para crecer profesionalmente!
        </div>
        <div className="text-pink-300 text-center font-semibold mb-10 animate-fade-in-slow text-lg flex items-center justify-center gap-2">
          <span>💡 Recuerda: ¡Cada candidatura es un paso hacia tu próximo trabajo! 🚀</span>
        </div>
        <div className="w-full max-w-5xl mx-auto mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => navigate('/candidaturas')}
              className="rounded-2xl border border-blue-800 bg-blue-950/60 p-5 shadow-xl text-left transition hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <div className="text-sm font-semibold text-blue-200">Candidaturas totales</div>
              <div className="mt-2 text-3xl font-extrabold text-white">{resumen.total}</div>
            </button>
            <button
              type="button"
              onClick={() => navigate('/candidaturas?estado=en_proceso')}
              className="rounded-2xl border border-purple-800 bg-purple-950/60 p-5 shadow-xl text-left transition hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <div className="text-sm font-semibold text-purple-200">Procesos activos</div>
              <div className="mt-2 text-3xl font-extrabold text-white">{resumen.activeProcesses}</div>
            </button>
            <button
              type="button"
              onClick={() => navigate('/candidaturas?recientes=1')}
              className="rounded-2xl border border-green-800 bg-green-950/60 p-5 shadow-xl text-left transition hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <div className="text-sm font-semibold text-green-200">Últimos 7 días</div>
              <div className="mt-2 text-3xl font-extrabold text-white">{resumen.recentApplications}</div>
            </button>
            <button
              type="button"
              onClick={() => navigate('/candidaturas?seguimiento=1')}
              className="rounded-2xl border border-pink-800 bg-pink-950/60 p-5 shadow-xl text-left transition hover:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <div className="text-sm font-semibold text-pink-200">Seguimientos pendientes</div>
              <div className="mt-2 text-3xl font-extrabold text-white">{resumen.followUpsPending}</div>
            </button>
          </div>
        </div>
        <div className="w-full max-w-5xl mx-auto mb-10 rounded-3xl border border-neutral-700 bg-neutral-900/70 p-5 sm:p-6 shadow-2xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-pink-300">Siguiente foco recomendado</div>
              <p className="mt-2 text-base sm:text-lg font-medium text-white">{insightMessage}</p>
              <p className="mt-2 text-sm text-gray-400">
                {resumen.latestUpdate ? `Última actividad registrada: ${resumen.latestUpdate}.` : 'Todavía no hay actividad registrada en candidaturas.'}
              </p>
            </div>
            <button
              onClick={() => navigate(insightCta.path)}
              className="rounded-full bg-pink-600 px-5 py-3 text-sm sm:text-base font-bold text-white shadow-lg transition hover:bg-pink-500"
            >
              {insightCta.label}
            </button>
          </div>
        </div>
        {followUps.length > 0 && (
          <div className="w-full max-w-5xl mx-auto mb-10 rounded-3xl border border-pink-800/60 bg-pink-950/30 p-5 sm:p-6 shadow-2xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-4">
              <div>
                <div className="text-sm font-semibold uppercase tracking-wide text-pink-300">Seguimientos a mano</div>
                <p className="mt-1 text-sm text-pink-100/80">Procesos sin movimiento en 10+ días. Márcalos cuando hayas contactado.</p>
              </div>
              {followUps.length > 5 && (
                <button
                  type="button"
                  onClick={() => navigate('/candidaturas?seguimiento=1')}
                  className="text-sm font-semibold text-pink-300 hover:text-pink-200"
                >
                  Ver todos ({followUps.length})
                </button>
              )}
            </div>
            {followUpError && (
              <p className="mb-3 text-sm font-semibold text-red-300">{followUpError}</p>
            )}
            <ul className="space-y-3">
              {followUps.slice(0, 5).map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-3 rounded-2xl border border-neutral-700 bg-neutral-900/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="truncate font-bold text-white">{item.empresa || 'Sin empresa'}</div>
                    <div className="truncate text-sm text-gray-300">{item.puesto || 'Sin puesto'}</div>
                    <div className="mt-1 text-xs text-gray-400">
                      {formatEstado(item.estado)} · {formatInactivityLabel(item) || 'Sin fecha'}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
                    <button
                      type="button"
                      onClick={() => navigate(`/candidaturas?id=${item.id}`)}
                      className="rounded-full border border-neutral-600 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:border-blue-400 hover:text-white"
                    >
                      Abrir
                    </button>
                    <button
                      type="button"
                      disabled={updatingFollowUpId === item.id}
                      onClick={() => handleMarkFollowUp(item.id)}
                      className="rounded-full bg-pink-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-pink-500 disabled:opacity-60"
                    >
                      {updatingFollowUpId === item.id ? 'Guardando…' : 'He hecho seguimiento'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="w-full max-w-5xl mx-auto mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
            <Link to="/candidaturas" className="flex flex-col items-center w-full bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-blue-900/60 rounded-3xl p-8 sm:p-10 transition-transform hover:scale-105 hover:shadow-blue-400/40 hover:border-blue-400 cursor-pointer group shadow-2xl border-2 border-blue-900 hover:bg-blue-900/80 focus:outline-none focus:ring-2 focus:ring-blue-400 animate-fade-in-card">
              <ClipboardDocumentListIcon width={56} height={56} className="mb-3 text-blue-400 group-hover:text-white transition-colors duration-200 drop-shadow-lg" />
              <div className="font-extrabold text-white text-xl text-center mb-2 group-hover:text-white transition-colors duration-200">Mi Diario de Candidaturas</div>
              <div className="text-base text-blue-100 text-center break-words whitespace-pre-line">Seguimiento completo de todos tus procesos de selección.</div>
            </Link>
            <Link to="/desahogate" className="flex flex-col items-center w-full bg-gradient-to-br from-pink-900/80 via-pink-800/70 to-pink-900/60 rounded-3xl p-8 sm:p-10 transition-transform hover:scale-105 hover:shadow-pink-400/40 hover:border-pink-400 cursor-pointer group shadow-2xl border-2 border-pink-900 hover:bg-pink-900/80 focus:outline-none focus:ring-2 focus:ring-pink-400 animate-fade-in-card">
              <PencilSquareIcon width={56} height={56} className="mb-3 text-pink-400 group-hover:text-white transition-colors duration-200 drop-shadow-lg" />
              <div className="font-extrabold text-white text-xl text-center mb-2 group-hover:text-white transition-colors duration-200">Mi Diario Personal</div>
              <div className="text-base text-pink-100 text-center break-words whitespace-pre-line">Reflexiona y documenta tu proceso de búsqueda.</div>
            </Link>
            <Link to="/animoia" className="flex flex-col items-center w-full bg-gradient-to-br from-green-900/80 via-green-800/70 to-green-900/60 rounded-3xl p-8 sm:p-10 transition-transform hover:scale-105 hover:shadow-green-400/40 hover:border-green-400 cursor-pointer group shadow-2xl border-2 border-green-900 hover:bg-green-900/80 focus:outline-none focus:ring-2 focus:ring-green-400 animate-fade-in-card">
              <ChatBubbleLeftRightIcon width={56} height={56} className="mb-3 text-green-400 group-hover:text-white transition-colors duration-200 drop-shadow-lg" />
              <div className="font-extrabold text-white text-xl text-center mb-2 group-hover:text-white transition-colors duration-200">Motivación</div>
              <div className="text-base text-green-100 text-center break-words whitespace-pre-line">Recibe mensajes de ánimo personalizados a partir de tus reflexiones.</div>
            </Link>
            <Link to="/retos/fisico" className="flex flex-col items-center w-full bg-gradient-to-br from-yellow-900/80 via-yellow-800/70 to-yellow-900/60 rounded-3xl p-8 sm:p-10 transition-transform hover:scale-105 hover:shadow-yellow-400/40 hover:border-yellow-400 cursor-pointer group shadow-2xl border-2 border-yellow-900 hover:bg-yellow-900/80 focus:outline-none focus:ring-2 focus:ring-yellow-400 animate-fade-in-card">
              <BoltIcon width={56} height={56} className="mb-3 text-yellow-300 group-hover:text-yellow-100 transition-colors duration-200 drop-shadow-lg" />
              <div className="font-extrabold text-white text-xl text-center mb-2 group-hover:text-yellow-100 transition-colors duration-200">Retos de Bienestar</div>
              <div className="text-base text-yellow-100 text-center break-words whitespace-pre-line">Mantén tu energía y motivación activa.</div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
} 