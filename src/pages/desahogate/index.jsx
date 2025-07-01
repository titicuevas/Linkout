import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon, ArrowLeftIcon, FaceFrownIcon } from '@heroicons/react/24/solid';
import Layout from '../../components/Layout';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function DesahogateIndex() {
  const [user, setUser] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editTexto, setEditTexto] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    document.title = 'Mis Desahogos | LinkOut';
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
    setLoading(true);
    const { data } = await supabase
      .from('desahogos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setMensajes(data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: '¿Eliminar desahogo?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#18181b',
      color: '#fff',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6366f1',
    });
    if (result.isConfirmed) {
      const { error } = await supabase.from('desahogos').delete().eq('id', id);
      if (!error) {
        fetchMensajes(user.id);
        await MySwal.fire({
          icon: 'success',
          title: 'Desahogo eliminado',
          background: '#18181b',
          color: '#fff',
          confirmButtonColor: '#6366f1',
          timer: 1200,
          showConfirmButton: false
        });
      } else {
        await MySwal.fire({
          icon: 'error',
          title: 'Error al eliminar',
          background: '#18181b',
          color: '#fff',
          confirmButtonColor: '#ef4444',
        });
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
      await MySwal.fire({
        icon: 'success',
        title: 'Desahogo actualizado',
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#6366f1',
        timer: 1200,
        showConfirmButton: false
      });
    } else {
      await MySwal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  function tiempoDesde(fecha) {
    const now = new Date();
    const then = new Date(fecha);
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return 'hace unos segundos';
    if (diff < 3600) return `hace ${Math.floor(diff/60)} min`;
    if (diff < 86400) return `hace ${Math.floor(diff/3600)} h`;
    return then.toLocaleDateString();
  }

  if (!user) return null;

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-2 py-8" style={{ background: 'linear-gradient(135deg, #18181b 60%, #312e81 100%)' }}>
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center backdrop-blur-md bg-neutral-900/80 rounded-2xl shadow-3xl p-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-2 tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">Mis Desahogos</h1>
          <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto animate-fade-in">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 backdrop-blur-md bg-neutral-900/80 rounded-2xl shadow-2xl border border-neutral-700 animate-pulse">
                <svg className="w-12 h-12 text-pink-400 animate-spin mb-4" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                <div className="text-lg text-gray-300 font-bold mb-2">Cargando...</div>
              </div>
            ) : mensajes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 backdrop-blur-md bg-neutral-900/80 rounded-2xl shadow-2xl border border-neutral-700 animate-fade-in">
                <FaceFrownIcon className="w-20 h-20 text-pink-400 mb-4 animate-bounce" />
                <div className="text-xl text-white font-bold mb-2">No tienes mensajes registrados.</div>
                <div className="text-base text-gray-400 mb-6">¡Anímate a escribir tu primer desahogo!</div>
                <button
                  onClick={() => navigate('/desahogate/create')}
                  className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full px-8 py-4 font-bold text-lg shadow-lg transition animate-fade-in"
                >
                  <PlusIcon className="w-7 h-7" />
                  Nuevo desahogo
                </button>
              </div>
            ) : (
              mensajes.map((m) => (
                <div key={m.id} className="flex items-center justify-between backdrop-blur-md bg-neutral-900/80 rounded-2xl shadow-2xl border border-neutral-700 px-6 py-5 hover:scale-[1.02] hover:shadow-pink-500/30 transition-all duration-200 group animate-fade-in">
                  <div className="flex-1">
                    <div className="text-white font-medium whitespace-pre-line mb-1 text-lg">{m.texto}</div>
                    <div className="text-xs text-pink-400 font-semibold">{tiempoDesde(m.created_at)}</div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button title="Editar" className="p-2 rounded-full bg-neutral-900 hover:bg-pink-900 transition shadow group-hover:scale-110" onClick={() => handleEdit(m.id, m.texto)}>
                      <PencilSquareIcon className="w-6 h-6 text-pink-400" />
                    </button>
                    <button title="Eliminar" className="p-2 rounded-full bg-neutral-900 hover:bg-red-900 transition shadow group-hover:scale-110" onClick={() => handleDelete(m.id)}>
                      <TrashIcon className="w-6 h-6 text-red-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-center mt-8 animate-fade-in">
            <button onClick={() => navigate('/index')} className="flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full shadow-lg transition font-bold text-lg">
              <ArrowLeftIcon className="w-6 h-6" />
              Volver al inicio
            </button>
          </div>
          {/* Botón flotante solo si hay mensajes */}
          {mensajes.length > 0 && (
            <button
              onClick={() => navigate('/desahogate/create')}
              className="fixed bottom-24 sm:bottom-8 right-8 z-50 px-7 py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-bold shadow-2xl text-lg transition-all animate-fade-in flex items-center gap-2"
            >
              <PlusIcon className="w-7 h-7" />
              Nuevo desahogo
            </button>
          )}
          <style>{`
            @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            .animate-fade-in { animation: fade-in 0.7s; }
            @media (max-width: 640px) {
              .mb-for-fab { margin-bottom: 6rem; }
            }
          `}</style>
        </div>
        {/* Modal de edición */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-neutral-900 rounded-2xl p-8 shadow-2xl w-full max-w-md relative animate-fade-in">
              <button className="absolute top-2 right-2 p-1 hover:bg-neutral-800 rounded" onClick={() => setShowModal(false)}>
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
              <form onSubmit={handleEditSave} className="flex flex-col gap-4">
                <textarea
                  value={editTexto}
                  onChange={e => setEditTexto(e.target.value)}
                  className="w-full h-32 p-3 rounded-lg bg-neutral-900 text-white border border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none transition-all"
                  required
                />
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-neutral-700 text-gray-300 rounded hover:bg-red-600 hover:text-white font-bold transition">Cancelar</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded font-extrabold shadow-lg transition">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 