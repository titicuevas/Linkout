import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import Layout from '../../components/Layout';
import { ArrowLeftIcon, SparklesIcon, CalendarDaysIcon, UserCircleIcon, BoltIcon, FireIcon, HeartIcon, StarIcon, EyeIcon, CloudIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';

const ROLES = [
  { value: 'madre', label: 'Madre' },
  { value: 'hermano', label: 'Hermano/a' },
  { value: 'mejor_amigo', label: 'Mejor amigo/a' },
  { value: 'motivador', label: 'Motivador profesional' },
  { value: 'psicologo', label: 'Psicólogo' },
  { value: 'companero', label: 'Compañero de trabajo' },
  { value: 'futuro', label: 'Tú del futuro' },
  { value: 'goku', label: 'Goku (Dragon Ball)' },
  { value: 'naruto', label: 'Naruto Uzumaki' },
  { value: 'luffy', label: 'Monkey D. Luffy (One Piece)' },
  { value: 'asta', label: 'Asta (Black Clover)' },
  { value: 'deku', label: 'Deku (My Hero Academia)' },
  { value: 'tanjiro', label: 'Tanjiro (Demon Slayer)' },
  { value: 'itadori', label: 'Itadori (Jujutsu Kaisen)' },
  { value: 'gojo', label: 'Gojo (Jujutsu Kaisen)' },
];

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL + '/api/animo';

// Componentes de iconos personalizados
const SombreroPajaIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
  </svg>
);

const ToroIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
  </svg>
);

// Función para obtener el icono y color de cada personaje
const getPersonajeInfo = (rol) => {
  switch (rol) {
    case 'goku':
      return { icon: CloudIcon, color: 'text-orange-400', bgColor: 'from-orange-500 to-red-500' };
    case 'naruto':
      return { icon: BoltIcon, color: 'text-yellow-400', bgColor: 'from-yellow-500 to-orange-500' };
    case 'luffy':
      return { icon: SombreroPajaIcon, color: 'text-red-400', bgColor: 'from-red-500 to-pink-500' };
    case 'asta':
      return { icon: ToroIcon, color: 'text-green-400', bgColor: 'from-green-500 to-emerald-500' };
    case 'deku':
      return { icon: HeartIcon, color: 'text-green-400', bgColor: 'from-green-500 to-emerald-500' };
    case 'tanjiro':
      return { icon: FireIcon, color: 'text-red-400', bgColor: 'from-red-500 to-orange-500' };
    case 'itadori':
      return { icon: HeartIcon, color: 'text-pink-400', bgColor: 'from-pink-500 to-rose-500' };
    case 'gojo':
      return { icon: EyeIcon, color: 'text-purple-400', bgColor: 'from-purple-500 to-indigo-500' };
    default:
      return { icon: SparklesIcon, color: 'text-pink-400', bgColor: 'from-pink-500 to-purple-500' };
  }
};

export default function AnimoIAIndex() {
  const [user, setUser] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [rolesSeleccionados, setRolesSeleccionados] = useState({});
  const [loading, setLoading] = useState({});
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Ánimo IA | LinkOut';
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        navigate('/login');
      } else {
        setUser(data.user);
        fetchMensajes(data.user.id);
      }
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user) {
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        setProfile(data);
      });
    }
  }, [user]);

  const fetchMensajes = async (userId) => {
    const { data } = await supabase
      .from('desahogos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setMensajes(data || []);
  };

  const handleRolChange = (id, rol) => {
    setRolesSeleccionados(prev => ({ ...prev, [id]: rol }));
  };

  const handleAnimoIA = async (id) => {
    setLoading(prev => ({ ...prev, [id]: true }));
    setRespuestas(prev => ({ ...prev, [id]: '' }));
    const mensaje = mensajes.find(m => m.id === id);
    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texto: mensaje.texto,
          rol: rolesSeleccionados[id] || 'motivador',
          nombre: profile?.nombre || user?.user_metadata?.nombre || user?.email || 'Usuario'
        })
      });
      const data = await res.json();
      setRespuestas(prev => ({ ...prev, [id]: data.respuesta }));
    } catch {
      setRespuestas(prev => ({ ...prev, [id]: 'Error al obtener respuesta de la IA.' }));
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  if (!user) return null;

  return (
    <Layout user={user} onLogout={async () => { await supabase.auth.signOut(); navigate('/login'); }}>
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-2 py-8" style={{ background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)' }}>
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center animate-fade-in-slow backdrop-blur-md bg-neutral-900/80 rounded-2xl shadow-3xl p-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-2 tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg flex items-center justify-center gap-3 animate-gradient-move">
            <span className="relative flex items-center justify-center">
              <SparklesIcon className="w-10 sm:w-12 h-10 sm:h-12 text-pink-300 animate-bounce-slow" />
            </span>
            Ánimo <span className="text-white">IA</span>
          </h1>
          <div className="text-lg sm:text-xl text-gray-300 mb-2 text-center font-medium animate-fade-in-slow">Selecciona un personaje y recibe un mensaje de <span className="text-pink-400 font-bold">ánimo personalizado</span> para cada uno de tus desahogos.</div>
          <div className="text-base sm:text-lg text-pink-200 mb-8 text-center animate-fade-in-slow">¡Incluye personajes de anime con historias inspiradoras de superación! 💪✨</div>
          <div className="flex flex-col gap-8 w-full">
            {mensajes.length === 0 ? (
              <div className="text-center py-10 text-gray-400 backdrop-blur-md bg-neutral-900/80 rounded-2xl shadow-2xl border border-neutral-700 animate-fade-in">
                No tienes desahogos registrados.
              </div>
            ) : (
              mensajes.map((m) => (
                <div key={m.id} className="backdrop-blur-md bg-gradient-to-br from-neutral-900/90 via-neutral-900/80 to-blue-900/60 rounded-2xl shadow-3xl border-2 border-pink-400 px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-4 items-center animate-fade-in-slow">
                  <div className="w-full text-white font-semibold text-base sm:text-lg mb-1 bg-neutral-800/80 rounded-2xl p-3 sm:p-4 shadow-inner border border-neutral-700 flex flex-col gap-2">
                    <span className="block mb-2 text-pink-300 font-bold text-sm sm:text-base flex items-center gap-2"><UserCircleIcon className="w-5 h-5 text-pink-200" />Tu mensaje:</span>
                    <span className="whitespace-pre-line text-base sm:text-lg">{m.texto}</span>
                  </div>
                  <div className="w-full flex flex-col sm:flex-row items-center gap-3 mt-2">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <label className="text-xs sm:text-sm text-pink-300 font-bold">Personaje:</label>
                      <select
                        className="bg-neutral-900/80 text-white border-2 border-pink-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-base font-semibold"
                        value={rolesSeleccionados[m.id] || 'motivador'}
                        onChange={e => handleRolChange(m.id, e.target.value)}
                      >
                        {ROLES.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => handleAnimoIA(m.id)}
                      className={`flex items-center gap-2 px-7 sm:px-10 py-3 bg-gradient-to-r ${getPersonajeInfo(rolesSeleccionados[m.id] || 'motivador').bgColor} hover:opacity-80 text-white rounded-full font-extrabold shadow-lg transition-all duration-200 mt-2 sm:mt-0 text-lg active:scale-95 animate-glow`}
                      disabled={loading[m.id]}
                    >
                      {loading[m.id] ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-7 w-7 text-yellow-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                          Generando...
                        </span>
                      ) : (
                        <>
                          {(() => {
                            const IconComponent = getPersonajeInfo(rolesSeleccionados[m.id] || 'motivador').icon;
                            return <IconComponent className="w-7 h-7 text-yellow-200 animate-pulse" />;
                          })()}
                          Recibir ánimo IA
                        </>
                      )}
                    </button>
                  </div>
                  {respuestas[m.id] && (
                    <div className="w-full bg-pink-900/90 text-pink-100 rounded-2xl p-5 sm:p-6 mt-2 animate-fade-in border-2 border-pink-700 shadow-inner flex flex-col gap-2 relative overflow-hidden" style={{fontSize: '1.1rem', lineHeight: '1.7'}}>
                      <span className="font-bold text-pink-200 flex items-center gap-2">
                        {(() => {
                          const IconComponent = getPersonajeInfo(rolesSeleccionados[m.id] || 'motivador').icon;
                          return <IconComponent className="w-6 h-6 text-yellow-200 animate-pulse" />;
                        })()}
                        {ROLES.find(r => r.value === (rolesSeleccionados[m.id] || 'motivador'))?.label}:
                      </span>
                      <ReactMarkdown>{respuestas[m.id]}</ReactMarkdown>
                      <div className="absolute bottom-2 right-4 text-xs text-pink-300 opacity-60 select-none">¡Tú puedes! 💖</div>
                    </div>
                  )}
                  <div className="w-full text-right text-xs text-gray-400 mt-1 flex items-center gap-1 justify-end">
                    <CalendarDaysIcon className="w-4 h-4 inline-block mr-1" />
                    {m.created_at ? new Date(m.created_at).toLocaleDateString('es-ES') : ''}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-center mt-10 sm:mt-12 animate-fade-in-slow">
            <button
              onClick={() => navigate('/index')}
              className="bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-3 px-10 rounded-full shadow-lg text-lg transition-all"
            >
              Volver al inicio
            </button>
          </div>
        </div>
        <style>{`
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in { animation: fade-in 0.7s; }
          @keyframes fade-in-slow { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }
          .animate-fade-in-slow { animation: fade-in-slow 1.2s cubic-bezier(.4,0,.2,1); }
          @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          .animate-bounce-slow { animation: bounce-slow 1.8s infinite; }
          @keyframes gradient-move {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-move {
            background-size: 200% 200%;
            animation: gradient-move 3s ease-in-out infinite;
          }
          .shadow-3xl { box-shadow: 0 12px 48px 0 rgba(0,0,0,0.35); }
          .animate-glow { box-shadow: 0 0 16px 2px #f472b6, 0 0 32px 4px #a78bfa33; }
        `}</style>
      </div>
    </Layout>
  );
} 