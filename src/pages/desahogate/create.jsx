import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function CrearDesahogo() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [texto, setTexto] = useState('');
  const [tocado, setTocado] = useState(false);
  const maxChars = 400;
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        navigate('/login');
      } else {
        setUser(data.user);
      }
    });
    setTexto('');
    return () => setTexto('');
  }, [navigate]);

  if (!user) return null;

  const handleCancel = () => {
    setTexto('');
    navigate('/desahogate');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (!texto.trim()) {
      setError('El mensaje no puede estar vacío.');
      return;
    }
    const { error: dbError } = await supabase.from('desahogos').insert([
      { user_id: user.id, texto, created_at: new Date().toISOString() }
    ]);
    if (dbError) {
      setError('No se pudo guardar el mensaje.');
      return;
    }
    await MySwal.fire({
      icon: 'success',
      title: '¡Desahogo guardado!',
      text: 'Tu mensaje ha sido registrado. ¡Ánimo!',
      background: '#18181b',
      color: '#fff',
      confirmButtonColor: '#e11d48',
    });
    navigate('/desahogate');
  };

  return (
    <Layout user={user} onLogout={async () => { await supabase.auth.signOut(); navigate('/login'); }}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
        <div className="w-full max-w-md bg-neutral-800 rounded-lg shadow-2xl p-8 border border-neutral-700 flex flex-col items-center relative">
          <h1 className="text-3xl font-extrabold text-center mb-2 tracking-tight">Nuevo Desahogo</h1>
          <div className="text-pink-400 text-lg font-semibold mb-6 text-center">¿Algo que quieras compartir hoy?</div>
          {error && <div className="bg-red-500 text-white p-3 rounded mb-4 w-full text-center animate-shake">{error}</div>}
          <form onSubmit={handleCreate} className="space-y-4 w-full" autoComplete="off">
            <div>
              <label className="block text-gray-300 font-bold mb-2">Mensaje</label>
              <textarea
                value={texto}
                onChange={e => setTexto(e.target.value)}
                onBlur={() => setTocado(true)}
                maxLength={maxChars}
                className={`w-full h-40 p-3 rounded-lg bg-neutral-900 text-white border ${tocado && !texto.trim() ? 'border-red-500' : 'border-pink-400'} focus:outline-none focus:ring-2 focus:ring-pink-400 mb-2 resize-none transition-all`}
                placeholder="Escribe aquí lo que sientes..."
                required
                autoComplete="off"
              />
              <div className={`text-right text-xs ${texto.length > maxChars - 20 ? 'text-red-400 font-bold' : 'text-gray-400'}`}>{texto.length}/{maxChars} caracteres</div>
            </div>
            <div className="flex w-full gap-2 mt-6">
              <button type="button" onClick={handleCancel} className="flex-1 px-4 py-2 bg-neutral-700 text-gray-300 rounded hover:bg-red-600 hover:text-white font-bold transition flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Cancelar
              </button>
              <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-700 text-white rounded font-extrabold shadow-lg hover:from-pink-400 hover:to-pink-600 transition transform active:scale-95 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Crear Desahogo
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
} 