import { useState } from 'react';
import { supabase } from '../../services/supabase';
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { swalSuccess, swalInfo } from '../../utils/swalTheme';
import PageLoader from '../../components/PageLoader';
import { useAuth } from '../../hooks/useAuth';
import { useTitle } from '../../hooks/useTitle';

export default function CrearDesahogo() {
  const { user, authLoading, logout } = useAuth();
  useTitle('Nueva Reflexión');
  const [error, setError] = useState('');
  const [texto, setTexto] = useState('');
  const [tocado, setTocado] = useState(false);
  const maxChars = 400;
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  if (authLoading) return <PageLoader message="Preparando tu diario..." />;
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
    await MySwal.fire(swalSuccess('¡Entrada guardada!', 'Tu reflexión ha sido compartida. ¡Gracias por motivar a otros desarrolladores!', { confirmButtonColor: '#e11d48' }));

    const goMotivation = await MySwal.fire(swalInfo(
      '¿Quieres recibir motivación?',
      'Puedes generar un mensaje de ánimo a partir de esta reflexión.',
      {
        showCancelButton: true,
        confirmButtonText: 'Sí, motivarme',
        cancelButtonText: 'Volver al diario',
        confirmButtonColor: '#db2777',
      },
    ));

    navigate(goMotivation.isConfirmed ? '/animoia' : '/desahogate');
  };

  return (
    <Layout user={user} onLogout={logout}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full bg-neutral-900 px-2 py-8">
        <div className="w-full max-w-md backdrop-blur-md bg-neutral-900/80 rounded-2xl shadow-2xl p-6 sm:p-10 border border-neutral-700 flex flex-col items-center relative animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-2 tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">Nueva Entrada en mi Diario</h1>
          <div className="text-pink-400 text-lg font-semibold mb-6 text-center animate-fade-in">Comparte tus reflexiones y experiencias</div>
          {error && <div className="bg-red-500 text-white p-3 rounded mb-4 w-full text-center animate-shake">{error}</div>}
          <form onSubmit={handleCreate} className="space-y-5 w-full" autoComplete="off">
            <div>
              <label className="block text-gray-300 font-bold mb-2">Mensaje</label>
              <textarea
                value={texto}
                onChange={e => setTexto(e.target.value)}
                onBlur={() => setTocado(true)}
                maxLength={maxChars}
                className={`w-full h-44 p-4 rounded-lg bg-neutral-900 text-white border ${tocado && !texto.trim() ? 'border-red-500' : 'border-pink-400'} focus:outline-none focus:ring-2 focus:ring-pink-400 mb-2 resize-none transition-all text-lg`}
                placeholder="Suelta todo lo que llevas dentro... ¿Qué has aprendido hoy? ¿Qué te motiva a seguir? ¿Qué reflexiones tienes sobre tu proceso? Comparte desde el corazón y ayuda a otros desarrolladores en su camino."
                required
                autoComplete="off"
              />
              <div className={`text-right text-xs ${texto.length > maxChars - 20 ? 'text-red-400 font-bold' : 'text-gray-400'}`}>{texto.length}/{maxChars} caracteres</div>
              <div className="text-blue-300 text-sm italic mt-2 bg-blue-900/20 rounded-lg p-3 border border-blue-700">
                💙 <strong>Recuerda:</strong> Este es un espacio para compartir experiencias constructivas y motivar a otros desarrolladores. Sé auténtico, comparte aprendizajes y mantén un tono positivo.
              </div>
            </div>
            <div className="flex w-full gap-2 mt-6 flex-col sm:flex-row">
              <button type="button" onClick={handleCancel} className="flex-1 px-4 py-3 bg-neutral-700 text-gray-300 rounded hover:bg-red-600 hover:text-white font-bold transition text-lg shadow-md flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Cancelar
              </button>
              <button type="submit" className="flex-1 px-4 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded font-extrabold shadow-lg text-lg transition-all flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Guardar Entrada
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
} 