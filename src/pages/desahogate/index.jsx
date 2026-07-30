import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowLeftIcon,
  FaceFrownIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/solid';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { swalSuccess, swalError, swalWarning } from '../../utils/swalTheme';
import PageLoader from '../../components/PageLoader';
import { useAuth } from '../../hooks/useAuth';
import { useTitle } from '../../hooks/useTitle';
import { STORAGE_KEYS } from '../../utils/storageKeys';
import InlineLoader from '../../components/InlineLoader';
import LoadErrorState from '../../components/LoadErrorState';

const DESAHOGO_DRAFT_KEY = STORAGE_KEYS.desahogoDraft;

function hasDraft() {
  try {
    const raw = localStorage.getItem(DESAHOGO_DRAFT_KEY);
    if (!raw) return false;
    const draft = JSON.parse(raw);
    return Boolean(draft?.texto?.trim());
  } catch {
    return false;
  }
}

export default function DesahogateIndex() {
  const { user, authLoading, logout } = useAuth();
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTexto, setEditTexto] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [draftPending, setDraftPending] = useState(false);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  useTitle('Mi Diario de Reflexiones');

  useEffect(() => {
    setDraftPending(hasDraft());
  }, []);

  const fetchMensajes = async (userId) => {
    setLoading(true);
    setLoadError('');
    const { data, error } = await supabase
      .from('desahogos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      setLoadError('No se pudieron cargar tus reflexiones. Inténtalo de nuevo.');
      setMensajes([]);
    } else {
      setMensajes(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError('');
      const { data, error } = await supabase
        .from('desahogos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (error) {
        setLoadError('No se pudieron cargar tus reflexiones. Inténtalo de nuevo.');
        setMensajes([]);
      } else {
        setMensajes(data || []);
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [user]);

  const handleDelete = async (id) => {
    const result = await MySwal.fire(swalWarning('¿Eliminar reflexión?', 'Esta acción no se puede deshacer.', {
      confirmButtonText: 'Sí, eliminar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6366f1',
    }));
    if (result.isConfirmed) {
      const { error } = await supabase.from('desahogos').delete().eq('id', id);
      if (!error) {
        fetchMensajes(user.id);
        await MySwal.fire(swalSuccess('Reflexión eliminada', '', { timer: 1200, showConfirmButton: false }));
      } else {
        await MySwal.fire(swalError('Error al eliminar', ''));
      }
    }
  };

  const handleEdit = (id, texto) => {
    setEditId(id);
    setEditTexto(texto);
    setShowModal(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editTexto.trim()) return;
    const { error } = await supabase.from('desahogos').update({ texto: editTexto }).eq('id', editId);
    if (!error) {
      setShowModal(false);
      setEditId(null);
      setEditTexto('');
      fetchMensajes(user.id);
      await MySwal.fire(swalSuccess('Reflexión actualizada', '', { timer: 1200, showConfirmButton: false }));
    } else {
      await MySwal.fire(swalError('Error al actualizar', ''));
    }
  };

  function tiempoDesde(fecha) {
    const now = new Date();
    const then = new Date(fecha);
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return 'hace unos segundos';
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
    return then.toLocaleDateString();
  }

  if (authLoading) return <PageLoader message="Cargando tus reflexiones..." />;
  if (!user) return null;

  return (
    <Layout user={user} onLogout={logout}>
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 py-8" style={{ background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)' }}>
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center backdrop-blur-md bg-neutral-900/80 rounded-2xl shadow-3xl p-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-2 tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">Mi Diario de Reflexiones</h1>
          {!loading && !loadError && (
            <p className="text-sm text-gray-400 mb-4">
              {mensajes.length === 0
                ? 'Todavía no hay entradas'
                : `${mensajes.length} reflexión${mensajes.length === 1 ? '' : 'es'}`}
            </p>
          )}

          {draftPending && (
            <button
              type="button"
              onClick={() => navigate('/desahogate/create')}
              className="w-full mb-4 rounded-2xl border border-pink-700/70 bg-pink-950/40 px-4 py-3 text-left transition hover:border-pink-400"
            >
              <div className="text-sm font-semibold text-pink-300">Borrador pendiente</div>
              <div className="text-sm text-pink-100/80">Tienes una reflexión sin guardar. Continúa escribiendo.</div>
            </button>
          )}

          <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto animate-fade-in">
            {loading ? (
              <div className="backdrop-blur-md bg-neutral-900/80 rounded-2xl shadow-2xl border border-neutral-700">
                <InlineLoader message="Cargando tus reflexiones..." />
              </div>
            ) : loadError ? (
              <div className="backdrop-blur-md bg-neutral-900/80 rounded-2xl shadow-2xl border border-neutral-700">
                <LoadErrorState message={loadError} onRetry={() => fetchMensajes(user.id)} />
              </div>
            ) : mensajes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 backdrop-blur-md bg-neutral-900/80 rounded-2xl shadow-2xl border border-neutral-700 animate-fade-in text-center px-4">
                <FaceFrownIcon className="w-16 h-16 text-pink-400 mb-4" />
                <div className="text-xl text-white font-bold mb-2">Tu diario está vacío</div>
                <div className="text-base text-gray-400 mb-6 max-w-sm">
                  Escribe cómo te sientes hoy. Después podrás pedir motivación a partir de esa reflexión.
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => navigate('/desahogate/create')}
                    className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full px-6 py-3 font-bold shadow-lg"
                  >
                    <PlusIcon className="w-6 h-6" />
                    Nueva reflexión
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/animoia')}
                    className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full px-6 py-3 font-bold border border-neutral-600"
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-400" />
                    Ir a Motivación
                  </button>
                </div>
              </div>
            ) : (
              mensajes.map((m) => (
                <div key={m.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between backdrop-blur-md bg-neutral-900/80 rounded-2xl shadow-2xl border border-neutral-700 px-5 py-5 hover:border-pink-500/40 transition-all duration-200 group animate-fade-in">
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium whitespace-pre-line mb-1 text-lg">{m.texto}</div>
                    <div className="text-xs text-pink-400 font-semibold">{tiempoDesde(m.created_at)}</div>
                  </div>
                  <div className="flex items-center gap-2 sm:ml-4 shrink-0">
                    <button type="button"
                      title="Recibir motivación"
                      aria-label="Recibir motivación"
                      className="p-2 rounded-full bg-neutral-900 hover:bg-green-900 transition shadow"
                      onClick={() => navigate(`/animoia?focus=${m.id}`)}
                    >
                      <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-400" />
                    </button>
                    <button type="button" title="Editar" aria-label="Editar reflexión" className="p-2 rounded-full bg-neutral-900 hover:bg-pink-900 transition shadow" onClick={() => handleEdit(m.id, m.texto)}>
                      <PencilSquareIcon className="w-6 h-6 text-pink-400" />
                    </button>
                    <button type="button" title="Eliminar" aria-label="Eliminar reflexión" className="p-2 rounded-full bg-neutral-900 hover:bg-red-900 transition shadow" onClick={() => handleDelete(m.id)}>
                      <TrashIcon className="w-6 h-6 text-red-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="hidden sm:flex justify-center mt-8 gap-4 animate-fade-in">
            <button type="button" onClick={() => navigate('/index')} className="flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full shadow-lg transition font-bold text-lg">
              <ArrowLeftIcon className="w-6 h-6" />
              Volver al inicio
            </button>
            <button
              type="button"
              onClick={() => navigate('/desahogate/create')}
              className="flex items-center gap-2 px-7 py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-bold shadow-2xl text-lg transition-all"
            >
              <PlusIcon className="w-7 h-7" />
              Nueva reflexión
            </button>
          </div>
          {mensajes.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('/desahogate/create')}
              className="fixed bottom-8 right-8 z-50 px-7 py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-bold shadow-2xl text-lg transition-all flex items-center gap-2 sm:hidden"
            >
              <PlusIcon className="w-7 h-7" />
              Nueva reflexión
            </button>
          )}
          <div className="flex justify-center mt-8 animate-fade-in sm:hidden">
            <button type="button" onClick={() => navigate('/index')} className="flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full shadow-lg transition font-bold text-lg">
              <ArrowLeftIcon className="w-6 h-6" />
              Volver al inicio
            </button>
          </div>
        </div>
        {showModal && (
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            labelledBy="edit-desahogo-title"
          >
            <h2 id="edit-desahogo-title" className="text-xl font-bold text-white text-center mb-4 pr-8">
              Editar reflexión
            </h2>
            <form onSubmit={handleEditSave} className="flex flex-col gap-4 min-w-[min(100%,20rem)] sm:min-w-[28rem]">
              <label htmlFor="edit-desahogo-texto" className="block text-sm font-bold text-gray-300">
                Texto de la reflexión
              </label>
              <textarea
                id="edit-desahogo-texto"
                value={editTexto}
                onChange={(e) => setEditTexto(e.target.value)}
                className="w-full h-32 p-3 rounded-lg bg-neutral-900 text-white border border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none transition-all"
                required
              />
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-neutral-700 text-gray-300 rounded hover:bg-red-600 hover:text-white font-bold transition">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded font-extrabold shadow-lg transition">Guardar</button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </Layout>
  );
}
