import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { PlusIcon } from '@heroicons/react/24/solid';
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';

export default function CandidaturasIndex() {
  const [user, setUser] = useState(null);
  const [candidaturas, setCandidaturas] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Mis Candidaturas';
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        navigate('/login');
      } else {
        setUser(data.user);
      }
    });
  }, [navigate]);

  useEffect(() => {
    async function fetchCandidaturas() {
      if (!user) return;
      setError('');
      const { data, error } = await supabase.from('candidaturas').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (error) setError('Error al cargar candidaturas');
      setCandidaturas(data || []);
    }
    fetchCandidaturas();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="w-full max-w-5xl mx-auto mt-16 relative">
        <h1 className="text-2xl font-extrabold tracking-tight mb-8">Mis Candidaturas</h1>
        <div className="bg-neutral-800 rounded-xl shadow-xl border border-neutral-700 overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Puesto</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {candidaturas.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">No tienes candidaturas registradas.</td></tr>
              ) : (
                candidaturas.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-700 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{c.puesto}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{c.empresa}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-bold " style={{background: c.estado === 'aceptado' ? '#22c55e' : c.estado === 'rechazado' ? '#ef4444' : c.estado === 'en_proceso' ? '#f59e42' : '#64748b', color: 'white'}}>{c.estado.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">{c.fecha ? new Date(c.fecha).toLocaleDateString() : ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => navigate('/candidaturas/create')}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl p-4 flex items-center gap-2 font-bold text-lg z-50 transition"
          style={{boxShadow:'0 8px 32px 0 rgba(0,0,0,0.25)'}}
        >
          <PlusIcon className="w-6 h-6" />
          Crear candidatura
        </button>
      </div>
    </Layout>
  );
} 