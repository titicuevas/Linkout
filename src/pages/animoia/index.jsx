import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import Layout from '../../components/Layout';
import { ArrowLeftIcon, SparklesIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';

const ROLES = [
  { value: 'madre', label: 'Madre' },
  { value: 'hermano', label: 'Hermano/a' },
  { value: 'mejor_amigo', label: 'Mejor amigo/a' },
  { value: 'motivador', label: 'Motivador profesional' },
  { value: 'psicologo', label: 'Psicólogo' },
  { value: 'companero', label: 'Compañero de trabajo' },
  { value: 'futuro', label: 'Tú del futuro' },
];

const BACKEND_URL = 'http://localhost:4000/api/animo';

export default function AnimoIAIndex() {
  const [user, setUser] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [rolesSeleccionados, setRolesSeleccionados] = useState({});
  const [loading, setLoading] = useState({});
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
        body: JSON.stringify({ texto: mensaje.texto, rol: rolesSeleccionados[id] || 'motivador', nombre: user?.user_metadata?.nombre || user?.email || 'Usuario' })
      });
      const data = await res.json();
      setRespuestas(prev => ({ ...prev, [id]: data.respuesta }));
    } catch (err) {
      setRespuestas(prev => ({ ...prev, [id]: 'Error al obtener respuesta de la IA.' }));
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  if (!user) return null;

  return (
    <Layout user={user} onLogout={async () => { await supabase.auth.signOut(); navigate('/login'); }}>
      <div className="w-full max-w-2xl mx-auto mt-16 relative">
        <div className="mb-6 flex items-center gap-2">
          <button onClick={() => navigate('/index')} className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg shadow transition font-bold">
            <ArrowLeftIcon className="w-5 h-5" />
            Volver al inicio
          </button>
        </div>
        <h1 className="text-3xl font-extrabold text-center mb-4 tracking-tight text-pink-400 flex items-center justify-center gap-2">
          <SparklesIcon className="w-8 h-8 text-pink-300 animate-fade-in" /> Ánimo IA
        </h1>
        <p className="text-lg text-gray-300 mb-10 text-center font-medium">
          Selecciona un rol y recibe un mensaje de ánimo personalizado para cada uno de tus desahogos.
        </p>
        <div className="flex flex-col gap-8">
          {mensajes.length === 0 ? (
            <div className="text-center py-8 text-gray-400 bg-neutral-800 rounded-xl shadow-xl border border-neutral-700">
              No tienes desahogos registrados.
            </div>
          ) : (
            mensajes.map((m) => (
              <div key={m.id} className="bg-neutral-900 rounded-2xl shadow-xl border border-pink-400 px-8 py-6 flex flex-col gap-3 items-center animate-fade-in">
                <div className="w-full text-white font-semibold text-lg mb-1 bg-neutral-800 rounded p-4 shadow-inner border border-neutral-700">
                  <span className="block mb-2 text-pink-300 font-bold">Tu mensaje:</span>
                  <span className="whitespace-pre-line">{m.texto}</span>
                </div>
                <div className="w-full flex flex-col sm:flex-row items-center gap-3 mt-2">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label className="text-sm text-pink-300 font-bold">Rol:</label>
                    <select
                      className="bg-neutral-900 text-white border border-pink-400 rounded px-2 py-1 focus:outline-none"
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
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600 hover:from-pink-400 hover:to-pink-700 text-white rounded-full font-bold shadow-lg transition-all duration-200 mt-2 sm:mt-0"
                    disabled={loading[m.id]}
                  >
                    {loading[m.id] ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-yellow-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                        Generando...
                      </span>
                    ) : (
                      <><SparklesIcon className="w-5 h-5 text-yellow-200" />Recibir ánimo IA</>
                    )}
                  </button>
                </div>
                {respuestas[m.id] && (
                  <div className="w-full bg-pink-900 text-pink-100 rounded-xl p-4 mt-2 animate-fade-in border border-pink-700 shadow-inner" style={{fontSize: '1.1rem', lineHeight: '1.6'}}>
                    <span className="font-bold text-pink-200">IA:</span> <ReactMarkdown>{respuestas[m.id]}</ReactMarkdown>
                  </div>
                )}
                <div className="w-full text-right text-xs text-gray-400 mt-1">{m.created_at ? new Date(m.created_at).toLocaleString() : ''}</div>
              </div>
            ))
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.7s; }
      `}</style>
    </Layout>
  );
} 