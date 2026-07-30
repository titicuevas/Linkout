import { useState, useEffect, useMemo } from 'react';
import Layout from '../../components/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
import { FireIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { supabase } from '../../services/supabase';
import Confetti from 'react-confetti';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { swalSuccess } from '../../utils/swalTheme';
import PageLoader from '../../components/PageLoader';
import { useAuth } from '../../hooks/useAuth';
import { useTitle } from '../../hooks/useTitle';
import { generateLocalRetos } from '../../utils/retosLocal';
import { formatEstado, isActiveProcess } from '../candidaturas/shared';
import {
  isRetoCompletado,
  setRetoCompletado,
  isRetoLibreCompletado,
} from '../../utils/storageKeys';
import InlineLoader from '../../components/InlineLoader';
import LoadErrorState from '../../components/LoadErrorState';

const PROGRESO_NIVEL = 100;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function buildLibreCandidatura() {
  return {
    id: `libre_${todayKey()}`,
    puesto: 'tu búsqueda',
    empresa: 'hoy',
    _libre: true,
  };
}

function ProgressBar({ puntos, nivel }) {
  return (
    <div className="flex flex-col items-center w-full mb-6 mt-4">
      <div className="w-full bg-neutral-800/80 rounded-full h-7 mb-2 overflow-hidden border-2 border-pink-400 shadow-inner">
        <div
          className="bg-gradient-to-r from-pink-400 to-pink-600 h-7 rounded-full transition-all duration-500"
          style={{ width: `${((puntos % PROGRESO_NIVEL) / PROGRESO_NIVEL) * 100}%` }}
        />
      </div>
      <div className="flex justify-between w-full text-base font-bold text-pink-300">
        <span>Nivel {nivel}</span>
        <span>{puntos % PROGRESO_NIVEL} / {PROGRESO_NIVEL} pts</span>
      </div>
    </div>
  );
}

export default function RetoFisico() {
  const { user, authLoading, logout } = useAuth();
  useTitle('Retos de Bienestar');
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
  const [elegibles, setElegibles] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const MySwal = withReactContent(Swal);

  const candidaturaDone = candidatura?.id ? isRetoCompletado(candidatura.id) : false;
  const libreDone = isRetoLibreCompletado(todayKey());

  useEffect(() => {
    if (!candidatura) return;
    setLoading(true);
    setError('');
    try {
      const generated = generateLocalRetos({
        puesto: candidatura.puesto,
        empresa: candidatura.empresa,
        salt: candidatura.id || Date.now(),
      });
      setRetos(generated);
      if (!generated.length) {
        setError('No se pudieron generar los retos. Inténtalo de nuevo.');
      }
    } catch {
      setError('No se pudieron generar los retos. Inténtalo de nuevo.');
      setRetos([]);
    } finally {
      setLoading(false);
    }
  }, [candidatura]);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('puntos, nivel').eq('id', user.id).single().then(({ data }) => {
      if (data) {
        setPuntos(data.puntos || 0);
        setNivel(data.nivel || 1);
      }
    });
  }, [user]);

  useEffect(() => {
    if (candidatura?.id && isRetoCompletado(candidatura.id)) {
      setCompletado([true, true, true]);
    } else {
      setCompletado([false, false, false]);
    }
  }, [candidatura?.id]);

  useEffect(() => {
    if (!user || candidatura) return;
    let cancelled = false;

    async function loadElegibles() {
      setListLoading(true);
      setListError('');
      const { data, error: fetchError } = await supabase
        .from('candidaturas')
        .select('id, puesto, empresa, estado, fecha_actualizacion, fecha')
        .eq('user_id', user.id)
        .neq('estado', 'contratacion')
        .order('fecha_actualizacion', { ascending: false });

      if (cancelled) return;
      if (fetchError) {
        setListError('No se pudieron cargar tus candidaturas.');
        setElegibles([]);
      } else {
        setElegibles(data || []);
      }
      setListLoading(false);
    }

    loadElegibles();
    return () => { cancelled = true; };
  }, [user, candidatura]);

  const retryLoadElegibles = async () => {
    if (!user) return;
    setListLoading(true);
    setListError('');
    const { data, error: fetchError } = await supabase
      .from('candidaturas')
      .select('id, puesto, empresa, estado, fecha_actualizacion, fecha')
      .eq('user_id', user.id)
      .neq('estado', 'contratacion')
      .order('fecha_actualizacion', { ascending: false });

    if (fetchError) {
      setListError('No se pudieron cargar tus candidaturas.');
      setElegibles([]);
    } else {
      setElegibles(data || []);
    }
    setListLoading(false);
  };

  const sortedElegibles = useMemo(() => {
    return [...elegibles].sort((a, b) => {
      const aDone = isRetoCompletado(a.id) ? 1 : 0;
      const bDone = isRetoCompletado(b.id) ? 1 : 0;
      if (aDone !== bDone) return aDone - bDone;
      const aActive = isActiveProcess(a) ? 0 : 1;
      const bActive = isActiveProcess(b) ? 0 : 1;
      return aActive - bActive;
    });
  }, [elegibles]);

  const handleCompletado = async (i) => {
    if (completado[i] || !candidatura?.id || isRetoCompletado(candidatura.id)) return;

    const nuevos = [false, false, false];
    nuevos[i] = true;
    setCompletado(nuevos);
    const puntosGanados = retos[i]?.puntos || 10;
    const nuevosPuntos = puntos + puntosGanados;
    const nuevoNivel = Math.floor(nuevosPuntos / PROGRESO_NIVEL) + 1;
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ puntos: nuevosPuntos, nivel: nuevoNivel })
      .eq('id', user.id);

    if (profileError) {
      setCompletado([false, false, false]);
      setError('No se pudieron guardar los puntos. Inténtalo de nuevo.');
      return;
    }

    setPuntos(nuevosPuntos);
    setNivel(nuevoNivel);
    setRetoCompletado(candidatura.id);
    setShowConfetti(true);
    setTimeout(async () => {
      await MySwal.fire(swalSuccess(
        '¡Reto completado!',
        candidatura?._libre
          ? '¡Buen trabajo! Ya tienes tu reto libre de hoy. Vuelve mañana o elige una candidatura.'
          : '¡Enhorabuena! Has completado el reto de bienestar para esta candidatura. Sigue así, cada paso cuenta.',
        { timer: 1600, timerProgressBar: true, showConfirmButton: false },
      ));
      setShowConfetti(false);
      navigate('/retos/fisico', { replace: true });
    }, 1200);
  };

  const handleAlternativa = (i) => {
    setAlternativaVisible((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  const confettiElement = showConfetti
    ? <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={350} recycle={false} />
    : null;

  if (authLoading) return <PageLoader message="Preparando retos..." />;
  if (!user) return null;

  if (!candidatura) {
    return (
      <Layout user={user} onLogout={logout}>
        {confettiElement}
        <div
          className="min-h-[100vh] w-full flex flex-col items-center justify-center px-4 sm:px-6 py-8"
          style={{ background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)' }}
        >
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center animate-fade-in-slow rounded-2xl backdrop-blur-md bg-neutral-900/80 shadow-3xl p-4 sm:p-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-2 tracking-tight bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg flex items-center justify-center gap-3">
              <FireIcon className="w-10 sm:w-12 h-10 sm:h-12 text-orange-400" />
              Retos de Bienestar
            </h1>
            <p className="text-base sm:text-lg text-gray-300 mb-6 text-center">
              Elige una candidatura o haz el reto libre de hoy. Sin API: se generan en tu dispositivo.
            </p>

            <ProgressBar puntos={puntos} nivel={nivel} />

            <button
              type="button"
              aria-label={libreDone ? 'Reto libre de hoy (ya completado)' : 'Reto libre de hoy'}
              disabled={libreDone}
              onClick={() => !libreDone && navigate('/retos/fisico', { state: { candidatura: buildLibreCandidatura() } })}
              className={`w-full max-w-md mb-6 flex items-center justify-between gap-2 py-4 px-6 rounded-2xl shadow-lg text-base border-2 font-semibold transition-all ${
                libreDone
                  ? 'bg-green-700/80 text-white border-green-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-600 to-pink-600 text-white border-orange-300 hover:opacity-90'
              }`}
            >
              <span>
                <span className="font-bold">Reto libre de hoy</span>
                <span className="block text-sm font-normal opacity-90">Sin asociar a una candidatura</span>
              </span>
              {libreDone ? (
                <span className="flex items-center gap-1 font-bold"><CheckCircleIcon className="w-6 h-6" />Hecho</span>
              ) : (
                <span aria-hidden="true">🔥</span>
              )}
            </button>

            {listLoading ? (
              <InlineLoader message="Cargando candidaturas..." size="sm" accent="orange" />
            ) : listError ? (
              <LoadErrorState message={listError} onRetry={retryLoadElegibles} />
            ) : sortedElegibles.length > 0 ? (
              <>
                <div className="text-sm font-semibold uppercase tracking-wide text-pink-300 mb-3 w-full max-w-md">Por candidatura</div>
                <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
                  {sortedElegibles.map((c) => {
                    const done = isRetoCompletado(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        aria-label={done ? `Reto para ${c.puesto} (ya completado)` : `Reto para ${c.puesto} en ${c.empresa}`}
                        disabled={done}
                        onClick={() => !done && navigate('/retos/fisico', { state: { candidatura: c } })}
                        className={`flex items-center justify-between gap-2 py-3 px-5 rounded-xl shadow-lg text-left border-2 transition-all font-semibold ${
                          done
                            ? 'bg-green-600/80 text-white border-green-700 cursor-not-allowed opacity-90'
                            : 'bg-neutral-800/80 hover:bg-pink-600 text-white border-pink-400'
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="font-bold text-pink-200 block truncate">{c.puesto}</span>
                          <span className="text-sm text-gray-300 truncate block">{c.empresa} · {formatEstado(c.estado)}</span>
                        </span>
                        {done ? (
                          <span className="flex items-center gap-1 shrink-0"><CheckCircleIcon className="w-6 h-6" />Hecho</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400 mb-4 max-w-md">
                No tienes candidaturas activas o rechazadas. Puedes usar el reto libre de arriba o crear una candidatura.
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                type="button"
                onClick={() => navigate('/candidaturas')}
                className="bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg"
              >
                Ir a candidaturas
              </button>
              <button
                type="button"
                onClick={() => navigate('/index')}
                className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg border border-neutral-600"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (candidaturaDone) {
    return (
      <Layout user={user} onLogout={logout}>
        {confettiElement}
        <div className="w-full max-w-2xl mx-auto mt-10 sm:mt-16 flex flex-col items-center justify-center min-h-[70vh] p-4" style={{ background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)', borderRadius: '2rem' }}>
          <h1 className="text-3xl font-extrabold text-center mb-2 tracking-tight text-pink-400 flex items-center justify-center gap-3">
            <FireIcon className="w-8 h-8 text-green-400" />
            Reto completado
          </h1>
          <div className="flex flex-col items-center gap-4 mt-8">
            <CheckCircleIcon className="w-20 h-20 text-green-400" />
            <div className="text-green-300 text-xl font-bold text-center">
              {candidatura._libre
                ? '¡Ya completaste el reto libre de hoy!'
                : '¡Ya completaste el reto físico para esta candidatura!'}
            </div>
            <button
              type="button"
              onClick={() => navigate('/retos/fisico', { replace: true })}
              className="bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 px-6 rounded-full shadow text-base mt-4"
            >
              Elegir otro reto
            </button>
          </div>
          <ProgressBar puntos={puntos} nivel={nivel} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={logout}>
      {confettiElement}
      <div className="w-full max-w-2xl mx-auto mt-10 sm:mt-16 flex flex-col items-center justify-center min-h-[70vh] p-4" style={{ background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)', borderRadius: '2rem' }}>
        <h1 className="text-3xl font-extrabold text-center mb-2 tracking-tight text-pink-400 flex items-center justify-center gap-3">
          <FireIcon className="w-8 h-8 text-orange-400" />
          {candidatura._libre ? 'Reto libre de hoy' : 'Reto físico'}
        </h1>
        <div className="text-lg text-gray-300 mb-2 text-center font-medium">
          {candidatura._libre ? (
            'Un boost rápido para mantener la energía en tu búsqueda.'
          ) : (
            <>
              Candidatura: <span className="text-pink-300 font-bold">{candidatura.puesto}</span> en <span className="text-pink-300 font-bold">{candidatura.empresa}</span>
            </>
          )}
        </div>
        <div className="text-base text-pink-200 mb-6 text-center">Elige un nivel, mueve el cuerpo y marca el reto.</div>
        <ProgressBar puntos={puntos} nivel={nivel} />
        {loading ? (
          <InlineLoader message="Generando retos..." />
        ) : error ? (
          <LoadErrorState
            message={error}
            onRetry={() => {
              setLoading(true);
              setError('');
              try {
                const generated = generateLocalRetos({
                  puesto: candidatura.puesto,
                  empresa: candidatura.empresa,
                  salt: candidatura.id || Date.now(),
                });
                setRetos(generated);
                if (!generated.length) {
                  setError('No se pudieron generar los retos. Inténtalo de nuevo.');
                }
              } catch {
                setError('No se pudieron generar los retos. Inténtalo de nuevo.');
                setRetos([]);
              } finally {
                setLoading(false);
              }
            }}
          />
        ) : (
          <>
            <div className="flex flex-col gap-6 w-full">
              {retos.map((reto, i) => (
                <div key={reto.nivel} className="bg-neutral-900 rounded-3xl shadow-3xl border-2 border-pink-400 px-5 sm:px-8 py-6 flex flex-col gap-3 items-center w-full">
                  <div className="text-white text-xl font-bold flex items-center gap-2">
                    <span className="text-2xl leading-none" aria-hidden="true">{reto.emoji || '💪'}</span>
                    Reto {reto.nivel}
                  </div>
                  <div className="text-pink-200 text-lg font-semibold text-center">{reto.ejercicio}</div>
                  <button
                    type="button"
                    onClick={() => handleAlternativa(i)}
                    className="text-yellow-300 underline font-semibold hover:text-yellow-400 transition"
                    disabled={completado.some((v) => v)}
                  >
                    ¿No puedes hacer este ejercicio?
                  </button>
                  {alternativaVisible[i] && (
                    <div className="text-yellow-300 text-base font-medium bg-yellow-900/30 rounded-lg px-4 py-2 text-center">
                      <span className="font-bold">Alternativa:</span> {reto.alternativa?.trim() || 'Haz estiramientos suaves si no puedes realizar el ejercicio principal.'}
                    </div>
                  )}
                  <div className="text-pink-400 text-base italic text-center">{reto.motivacion || '¡Cada pequeño esfuerzo suma!'}</div>
                  <button
                    type="button"
                    onClick={() => handleCompletado(i)}
                    className={`bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600 hover:from-pink-400 hover:to-pink-700 text-white rounded-full font-bold shadow-lg px-8 py-3 text-lg transition-all active:scale-95 ${completado.some((v) => v) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={completado.some((v) => v)}
                  >
                    {completado[i] ? (
                      <span className="flex items-center gap-2"><CheckCircleIcon className="w-6 h-6 text-green-400" />¡Completado!</span>
                    ) : `Marcar como completado (+${reto.puntos || 10} pts)`}
                  </button>
                  {completado.some((v) => v) && !completado[i] && (
                    <div className="text-gray-400 text-sm italic">Solo puedes completar un reto por candidatura.</div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center mt-10 gap-3">
              <div className="text-pink-300 font-bold text-lg">Puntos totales: {puntos}</div>
              <button
                type="button"
                onClick={() => navigate('/retos/fisico', { replace: true })}
                className="bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 px-6 rounded-full shadow"
              >
                Cambiar de reto
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
