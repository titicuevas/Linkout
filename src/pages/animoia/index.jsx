import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import Layout from '../../components/Layout';
import { CalendarDaysIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import PageLoader from '../../components/PageLoader';
import { useAuth } from '../../hooks/useAuth';
import { useTitle } from '../../hooks/useTitle';
import { PROFILE_UPDATED_EVENT } from '../../utils/profileEvents';
import { ANIMO_ROLES, generateLocalAnimo, getAnimoRole } from '../../utils/animoLocal';
import { getDisplayName } from '../../utils/displayName';

export default function AnimoIAIndex() {
  const { user, authLoading, logout } = useAuth();
  const [mensajes, setMensajes] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [rolesSeleccionados, setRolesSeleccionados] = useState({});
  const [loading, setLoading] = useState({});
  const [profile, setProfile] = useState(null);
  const [focusId, setFocusId] = useState(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const focusHandled = useRef(false);

  useTitle('Motivación');

  useEffect(() => {
    if (!user) return;
    fetchMensajes(user.id);
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
    const focus = searchParams.get('focus');
    if (!focus || focusHandled.current || mensajes.length === 0) return;
    const exists = mensajes.some((m) => m.id === focus);
    if (!exists) {
      setSearchParams({}, { replace: true });
      return;
    }
    focusHandled.current = true;
    setFocusId(focus);
    setSearchParams({}, { replace: true });
    window.setTimeout(() => {
      document.getElementById(`animo-${focus}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, [mensajes, searchParams, setSearchParams]);

  const fetchMensajes = async (userId) => {
    const { data } = await supabase
      .from('desahogos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setMensajes(data || []);
  };

  const handleRolChange = (id, rol) => {
    setRolesSeleccionados((prev) => ({ ...prev, [id]: rol }));
  };

  const handleAnimo = (id) => {
    const mensaje = mensajes.find((m) => m.id === id);
    if (!mensaje) return;

    setLoading((prev) => ({ ...prev, [id]: true }));
    setRespuestas((prev) => ({ ...prev, [id]: '' }));

    const rol = rolesSeleccionados[id] || 'motivador';
    const nombre = getDisplayName(profile, user);
    const respuesta = generateLocalAnimo({
      texto: mensaje.texto,
      rol,
      nombre,
      salt: Date.now(),
    });

    window.setTimeout(() => {
      setRespuestas((prev) => ({ ...prev, [id]: respuesta }));
      setLoading((prev) => ({ ...prev, [id]: false }));
    }, 350);
  };

  if (authLoading) return <PageLoader message="Preparando Motivación..." />;
  if (!user) return null;

  return (
    <Layout user={user} onLogout={logout}>
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 py-8" style={{ background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)' }}>
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center animate-fade-in-slow backdrop-blur-md bg-neutral-900/80 rounded-2xl shadow-3xl p-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-2 tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg flex items-center justify-center gap-3 animate-gradient-move">
            <span className="text-4xl sm:text-5xl" aria-hidden="true">✨</span>
            Motivación
          </h1>
          <div className="text-lg sm:text-xl text-gray-300 mb-2 text-center font-medium animate-fade-in-slow">
            Elige un personaje y recibe un mensaje de <span className="text-pink-400 font-bold">ánimo personalizado</span> a partir de tus reflexiones.
          </div>
          <div className="text-base sm:text-lg text-pink-200 mb-8 text-center animate-fade-in-slow">
            Sin APIs de pago: el mensaje se genera en tu dispositivo, con tono según el personaje.
          </div>
          <div className="flex flex-col gap-8 w-full">
            {mensajes.length === 0 ? (
              <div className="text-center py-10 text-gray-400 backdrop-blur-md bg-neutral-900/80 rounded-2xl shadow-2xl border border-neutral-700 animate-fade-in px-4">
                <div className="text-5xl mb-3" aria-hidden="true">📝</div>
                <p className="text-lg text-white font-semibold mb-2">Aún no tienes reflexiones</p>
                <p className="text-sm text-gray-400 mb-6">
                  Escribe primero en tu diario personal y aquí podrás recibir motivación a medida.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/desahogate/create')}
                  className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-full font-bold shadow-lg"
                >
                  Escribir en el diario
                </button>
              </div>
            ) : (
              mensajes.map((m) => {
                const rol = rolesSeleccionados[m.id] || 'motivador';
                const personaje = getAnimoRole(rol);

                return (
                  <div
                    id={`animo-${m.id}`}
                    key={m.id}
                    className={`backdrop-blur-md bg-gradient-to-br from-neutral-900/90 via-neutral-900/80 to-blue-900/60 rounded-2xl shadow-3xl border-2 px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-4 items-center animate-fade-in-slow ${
                      focusId === m.id ? 'border-green-400 ring-2 ring-green-400/40' : 'border-pink-400'
                    }`}
                  >
                    <div className="w-full text-white font-semibold text-base sm:text-lg mb-1 bg-neutral-800/80 rounded-2xl p-3 sm:p-4 shadow-inner border border-neutral-700 flex flex-col gap-2">
                      <span className="block mb-2 text-pink-300 font-bold text-sm sm:text-base flex items-center gap-2">
                        <UserCircleIcon className="w-5 h-5 text-pink-200" />
                        Tu mensaje:
                      </span>
                      <span className="whitespace-pre-line text-base sm:text-lg">{m.texto}</span>
                    </div>
                    <div className="w-full flex flex-col sm:flex-row items-center gap-3 mt-2">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label className="text-xs sm:text-sm text-pink-300 font-bold" htmlFor={`rol-${m.id}`}>Personaje:</label>
                        <select
                          id={`rol-${m.id}`}
                          className="bg-neutral-900/80 text-white border-2 border-pink-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-base font-semibold"
                          value={rol}
                          onChange={(e) => handleRolChange(m.id, e.target.value)}
                        >
                          {ANIMO_ROLES.map((r) => (
                            <option key={r.value} value={r.value}>
                              {r.emoji} {r.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAnimo(m.id)}
                        className={`flex items-center gap-2 px-7 sm:px-10 py-3 bg-gradient-to-r ${personaje.bgColor} hover:opacity-80 text-white rounded-full font-extrabold shadow-lg transition-all duration-200 mt-2 sm:mt-0 text-lg active:scale-95 animate-glow`}
                        disabled={loading[m.id]}
                      >
                        {loading[m.id] ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-7 w-7 text-yellow-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Generando...
                          </span>
                        ) : (
                          <>
                            <span className="text-2xl leading-none" aria-hidden="true">{personaje.emoji}</span>
                            Recibir Motivación
                          </>
                        )}
                      </button>
                    </div>
                    {respuestas[m.id] && (
                      <div className="w-full bg-pink-900/90 text-pink-100 rounded-2xl p-5 sm:p-6 mt-2 animate-fade-in border-2 border-pink-700 shadow-inner flex flex-col gap-2 relative overflow-hidden" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                        <span className="font-bold text-pink-200 flex items-center gap-2">
                          <span className="text-2xl leading-none" aria-hidden="true">{personaje.emoji}</span>
                          {personaje.label}:
                        </span>
                        <p className="whitespace-pre-line">{respuestas[m.id]}</p>
                        <div className="absolute bottom-2 right-4 text-xs text-pink-300 opacity-60 select-none">¡Tú puedes!</div>
                      </div>
                    )}
                    <div className="w-full text-right text-xs text-gray-400 mt-1 flex items-center gap-1 justify-end">
                      <CalendarDaysIcon className="w-4 h-4 inline-block mr-1" />
                      {m.created_at ? new Date(m.created_at).toLocaleDateString('es-ES') : ''}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="flex justify-center mt-10 sm:mt-12 animate-fade-in-slow gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => navigate('/desahogate')}
              className="bg-pink-700 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg text-lg transition-all"
            >
              Ir al diario
            </button>
            <button
              type="button"
              onClick={() => navigate('/index')}
              className="bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg text-lg transition-all"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
