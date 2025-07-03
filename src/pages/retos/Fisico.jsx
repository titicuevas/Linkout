import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
import { SparklesIcon, FireIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { supabase } from '../../services/supabase';
import Confetti from 'react-confetti';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ENDPOINT = import.meta.env.VITE_BACKEND_URL + '/api/retos'; // Cambia esto por tu endpoint real
const NIVELES = ['Fácil', 'Medio', 'Difícil'];
const PROGRESO_NIVEL = 100;

export default function RetoFisico() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const candidatura = location.state?.candidatura;
  const [retos, setRetos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completado, setCompletado] = useState([false, false, false]);
  const [puntos, setPuntos] = useState(0);
  const [alternativaVisible, setAlternativaVisible] = useState([false, false, false]);
  const [nivel, setNivel] = useState(1);
  const [rechazadas, setRechazadas] = useState([]);
  const [seleccionando, setSeleccionando] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        navigate('/login');
      } else {
        setUser(data.user);
      }
    });
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  useEffect(() => {
    if (!candidatura) return;
    setLoading(true);
    setError('');
    // Llamada a la IA para obtener retos personalizados
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        puesto: candidatura.puesto,
        empresa: candidatura.empresa,
        niveles: NIVELES
      })
    })
      .then(res => res.json())
      .then(data => {
        setRetos(data.retos || []);
        if (!data.retos || data.retos.length === 0) {
          setError(data.error || 'No se pudieron generar los retos. Intenta de nuevo.');
        }
        setLoading(false);
      })
      .catch(async (err) => {
        let msg = 'No se pudieron generar los retos. Intenta de nuevo.';
        if (err && err.response) {
          try {
            const data = await err.response.json();
            msg = data.error || msg;
          } catch {
            // No hacer nada si falla el parseo del error
          }
        }
        setError(msg);
        setLoading(false);
      });
  }, [candidatura]);

  useEffect(() => {
    if (!user) return;
    // Leer puntos y nivel desde Supabase
    supabase.from('profiles').select('puntos, nivel').eq('id', user.id).single().then(({ data }) => {
      if (data) {
        setPuntos(data.puntos || 0);
        setNivel(data.nivel || 1);
      }
    });
  }, [user]);

  const candidaturaKey = candidatura ? `reto_completado_${candidatura.id}` : null;
  useEffect(() => {
    if (candidaturaKey && localStorage.getItem(candidaturaKey)) {
      setCompletado([true, true, true]);
    }
  }, [candidaturaKey]);

  useEffect(() => {
    if (!user) return;
    if (!candidatura) {
      // Buscar candidaturas rechazadas del usuario
      supabase
        .from('candidaturas')
        .select('*')
        .eq('user_id', user.id)
        .eq('estado', 'rechazado')
        .then(({ data }) => {
          setRechazadas(data || []);
          setSeleccionando(true);
        });
    }
  }, [user, candidatura]);

  const handleCompletado = async (i) => {
    if (!completado[i] && candidaturaKey && !localStorage.getItem(candidaturaKey)) {
      const nuevos = [false, false, false];
      nuevos[i] = true;
      setCompletado(nuevos);
      const puntosGanados = retos[i]?.puntos || 10;
      const nuevosPuntos = puntos + puntosGanados;
      const nuevoNivel = Math.floor(nuevosPuntos / PROGRESO_NIVEL) + 1;
      setPuntos(nuevosPuntos);
      setNivel(nuevoNivel);
      // Actualizar en Supabase
      await supabase.from('profiles').update({ puntos: nuevosPuntos, nivel: nuevoNivel }).eq('id', user.id);
      localStorage.setItem(candidaturaKey, '1');
      setShowConfetti(true);
      setTimeout(async () => {
        await MySwal.fire({
          icon: 'success',
          title: '¡Reto completado!',
          text: '¡Enhorabuena! Has completado el reto de bienestar para esta candidatura. Sigue así, cada paso cuenta.',
          background: '#18181b',
          color: '#fff',
          confirmButtonColor: '#6366f1',
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false
        });
        setShowConfetti(false);
        navigate('/retos/fisico');
      }, 1200);
    }
  };

  const handleAlternativa = (i) => {
    setAlternativaVisible(prev => prev.map((v, idx) => idx === i ? !v : v));
  };

  // Renderizado global del confeti
  const confettiElement = showConfetti ? <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={350} recycle={false} /> : null;

  if (!user) return null;

  if (!candidatura) {
    return (
      <Layout user={user} onLogout={handleLogout}>
        {confettiElement}
        <div
          className="min-h-[100vh] w-full flex flex-col items-center justify-center px-2 py-8"
          style={{ background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)' }}
        >
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center animate-fade-in-slow rounded-2xl backdrop-blur-md bg-neutral-900/80 shadow-3xl p-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-2 tracking-tight bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg flex items-center justify-center gap-3 animate-gradient-move">
              <FireIcon className="w-10 sm:w-12 h-10 sm:h-12 text-orange-400 animate-bounce-slow" />
              Retos de Bienestar
            </h1>
            {seleccionando && rechazadas.length > 0 ? (
              <>
                <div className="text-lg text-gray-300 mb-8 text-center font-medium animate-fade-in-slow">Selecciona una candidatura rechazada para desbloquear retos de bienestar:</div>
                <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
                  {rechazadas.map(c => {
                    const completado = localStorage.getItem(`reto_completado_${c.id}`);
                    return (
                      <button
                        key={c.id}
                        onClick={() => !completado && navigate('/retos/fisico', { state: { candidatura: c } })}
                        className={`flex items-center justify-between gap-2 py-3 px-6 rounded-xl shadow-lg text-base border-2 transition-all font-semibold
                          ${completado ? 'bg-green-600 text-white border-green-700 cursor-not-allowed opacity-80' : 'bg-neutral-800/80 hover:bg-pink-600 text-white border-pink-400'}`}
                        disabled={!!completado}
                      >
                        <span>
                          <span className="font-bold text-pink-300">{c.puesto}</span> en <span className="text-pink-200">{c.empresa}</span>
                        </span>
                        {completado ? (
                          <span className="flex items-center gap-1 text-white font-bold"><CheckCircleIcon className="w-6 h-6 text-white" />Completado</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="text-lg text-gray-300 mb-8 text-center font-medium animate-fade-in-slow">Para desbloquear retos de bienestar, primero asocia una candidatura rechazada.</div>
                <button
                  onClick={() => navigate('/candidaturas')}
                  className="bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-3 px-10 rounded-full shadow-lg text-lg transition-all mt-8"
                >
                  Volver a candidaturas
                </button>
              </>
            )}
            {/* Barra de progreso y nivel */}
            <div className="flex flex-col items-center w-full mb-8 mt-4">
              <div className="w-full bg-neutral-800/80 rounded-full h-7 mb-2 overflow-hidden border-2 border-pink-400 shadow-inner">
                <div
                  className="bg-gradient-to-r from-pink-400 to-pink-600 h-7 rounded-full transition-all duration-500 animate-glow"
                  style={{ width: `${(puntos % PROGRESO_NIVEL) / PROGRESO_NIVEL * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between w-full text-base font-bold text-pink-300">
                <span>Nivel {nivel}</span>
                <span>{puntos % PROGRESO_NIVEL} / {PROGRESO_NIVEL} pts</span>
              </div>
            </div>
            {/* Botón volver al inicio */}
            <button
              onClick={() => navigate('/index')}
              className="bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-3 px-10 rounded-full shadow-lg text-lg transition-all mt-2"
            >
              Volver al inicio
            </button>
          </div>
          <style>{`
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
            .animate-glow { box-shadow: 0 0 16px 2px #f472b6, 0 0 32px 4px #fbbf24aa; }
          `}</style>
        </div>
      </Layout>
    );
  }

  if (candidaturaKey && localStorage.getItem(candidaturaKey)) {
    return (
      <Layout user={user} onLogout={handleLogout}>
        {confettiElement}
        <div className="w-full max-w-2xl mx-auto mt-16 flex flex-col items-center justify-center min-h-[70vh] p-4" style={{background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)', borderRadius: '2rem'}}>
          <h1 className="text-3xl font-extrabold text-center mb-2 tracking-tight text-pink-400 flex items-center justify-center gap-3 animate-fade-in-slow">
            <FireIcon className="w-8 h-8 text-green-400 animate-bounce-slow" />
            Reto Físico Completado
          </h1>
          <div className="flex flex-col items-center gap-4 mt-8">
            <CheckCircleIcon className="w-20 h-20 text-green-400 animate-bounce" />
            <div className="text-green-300 text-2xl font-bold text-center">¡Ya completaste el reto físico para esta candidatura!</div>
            <button
              onClick={() => navigate('/candidaturas')}
              className="bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 px-6 rounded shadow text-base mt-8"
            >
              Volver a candidaturas
            </button>
          </div>
          {/* Barra de progreso y nivel */}
          <div className="flex flex-col items-center w-full mb-8 mt-4">
            <div className="w-full bg-neutral-800 rounded-full h-6 mb-2 overflow-hidden border-2 border-pink-400 shadow-inner">
              <div
                className="bg-gradient-to-r from-pink-400 to-pink-600 h-6 rounded-full transition-all duration-500"
                style={{ width: `${(puntos % PROGRESO_NIVEL) / PROGRESO_NIVEL * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between w-full text-sm font-bold text-pink-300">
              <span>Nivel {nivel}</span>
              <span>{puntos % PROGRESO_NIVEL} / {PROGRESO_NIVEL} pts</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      {confettiElement}
      <div className="w-full max-w-2xl mx-auto mt-16 flex flex-col items-center justify-center min-h-[70vh] p-4" style={{background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)', borderRadius: '2rem'}}>
        <h1 className="text-3xl font-extrabold text-center mb-2 tracking-tight text-pink-400 flex items-center justify-center gap-3 animate-fade-in-slow">
          <FireIcon className="w-8 h-8 text-orange-400 animate-bounce-slow" />
          Reto Físico
        </h1>
        <div className="text-lg text-gray-300 mb-2 text-center font-medium animate-fade-in-slow">Candidatura: <span className="text-pink-300 font-bold">{candidatura.puesto}</span> en <span className="text-pink-300 font-bold">{candidatura.empresa}</span></div>
        <div className="text-base text-pink-200 mb-8 text-center animate-fade-in-slow">¡Convierte la frustración en energía positiva! Elige tu reto físico y libera endorfinas.</div>
        <div className="flex flex-col items-center w-full mb-8">
          <div className="w-full bg-neutral-800 rounded-full h-6 mb-2 overflow-hidden border-2 border-pink-400 shadow-inner">
            <div
              className="bg-gradient-to-r from-pink-400 to-pink-600 h-6 rounded-full transition-all duration-500"
              style={{ width: `${(puntos % PROGRESO_NIVEL) / PROGRESO_NIVEL * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between w-full text-sm font-bold text-pink-300">
            <span>Nivel {nivel}</span>
            <span>{puntos % PROGRESO_NIVEL} / {PROGRESO_NIVEL} pts</span>
          </div>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 animate-pulse">
            <svg className="w-12 h-12 text-pink-400 animate-spin mb-4" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            <div className="text-lg text-gray-300 font-bold mb-2">Generando retos personalizados...</div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-red-400 font-bold mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded shadow text-base"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-8 w-full">
              {retos.map((reto, i) => (
                <div key={reto.nivel} className="bg-neutral-900 rounded-3xl shadow-3xl border-2 border-pink-400 px-8 py-7 flex flex-col gap-4 items-center animate-fade-in-slow w-full">
                  <div className="text-white text-xl font-bold flex items-center gap-2 mb-2"><SparklesIcon className="w-6 h-6 text-pink-300 animate-pulse" />Reto {reto.nivel}</div>
                  <div className="text-pink-200 text-lg font-semibold mb-2">{reto.ejercicio}</div>
                  <button
                    onClick={() => handleAlternativa(i)}
                    className="text-yellow-300 underline font-semibold hover:text-yellow-400 transition mb-2"
                    type="button"
                    disabled={completado.some(v => v)}
                  >
                    ¿No puedes hacer este ejercicio?
                  </button>
                  {alternativaVisible[i] && (
                    <div className="text-yellow-300 text-base font-medium mb-2 bg-yellow-900/30 rounded-lg px-4 py-2 text-center">
                      <span className="font-bold">Alternativa:</span> {reto.alternativa && reto.alternativa.trim() ? reto.alternativa : 'Haz estiramientos suaves si no puedes realizar el ejercicio principal.'}
                    </div>
                  )}
                  <div className="text-pink-400 text-base italic mb-4">{reto.motivacion || '¡Recuerda que cada pequeño esfuerzo suma y te ayuda a liberar endorfinas!'}</div>
                  <button
                    onClick={() => handleCompletado(i)}
                    className={`bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600 hover:from-pink-400 hover:to-pink-700 text-white rounded-full font-bold shadow-lg px-8 py-3 text-lg transition-all duration-200 active:scale-95 ${completado.some(v => v) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={completado.some(v => v)}
                  >
                    {completado[i] ? (
                      <span className="flex items-center gap-2"><CheckCircleIcon className="w-6 h-6 text-green-400" />¡Completado!</span>
                    ) : `Marcar como completado (+${reto.puntos || 10} pts)`}
                  </button>
                  {completado[i] && (
                    <div className="text-green-400 font-bold text-xl mt-2 animate-fade-in flex items-center gap-2">🎉 ¡Enhorabuena! Has completado el reto para esta candidatura. <CheckCircleIcon className="w-6 h-6" /></div>
                  )}
                  {completado.some(v => v) && !completado[i] && (
                    <div className="text-gray-400 text-sm italic">Solo puedes completar un reto por candidatura.</div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center mt-10">
              <div className="text-pink-300 font-bold text-lg mb-2">Puntos totales: {puntos}</div>
              <button
                onClick={() => navigate('/index')}
                className="bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 px-6 rounded shadow text-base"
              >
                Volver al inicio
              </button>
            </div>
          </>
        )}
      </div>
      <style>{`
        @keyframes fade-in-slow { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }
        .animate-fade-in-slow { animation: fade-in-slow 1.2s cubic-bezier(.4,0,.2,1); }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 1.8s infinite; }
        .shadow-3xl { box-shadow: 0 12px 48px 0 rgba(0,0,0,0.35); }
      `}</style>
    </Layout>
  );
} 