import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import Layout from '../../components/Layout';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#6366f1', '#e11d48', '#f59e42', '#10b981', '#fbbf24', '#3b82f6', '#ef4444', '#a21caf', '#f472b6'];

const campos = [
  { key: 'estado', label: 'Estado' },
  { key: 'origen', label: 'Origen' },
  { key: 'tipo_trabajo', label: 'Tipo de trabajo' },
  { key: 'ubicacion', label: 'Ubicación' },
  { key: 'franja_salarial', label: 'Franja salarial' },
];

export default function EstadisticasCandidaturas() {
  const [user, setUser] = useState(null);
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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
      setLoading(true);
      const { data, error } = await supabase.from('candidaturas').select('*').eq('user_id', user.id);
      if (error) console.error('Error al cargar candidaturas:', error);
      setCandidaturas(data || []);
      setLoading(false);
    }
    fetchCandidaturas();
  }, [user]);

  // Agrupa y cuenta por campo
  const getDataByField = (field) => {
    const counts = {};
    candidaturas.forEach(c => {
      const val = c[field] || 'Sin especificar';
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }));
  };

  if (!user) return null;

  return (
    <Layout user={user}>
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-neutral-900 px-2 py-8 relative">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">Estadísticas de Candidaturas</h1>
        {loading ? (
          <div className="text-lg text-gray-300 font-bold mb-2">Cargando estadísticas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
            {campos.map((campo, idx) => {
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
        )}
      </div>
    </Layout>
  );
} 