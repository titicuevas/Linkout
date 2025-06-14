import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import Layout from '../../components/Layout';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function DesahogateIndex() {
  const [user, setUser] = useState(null);
  const [mensajes, setMensajes] = useState([]);
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
    const { data } = await supabase
      .from('desahogos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setMensajes(data || []);
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

  if (!user) return null;

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="w-full max-w-2xl mx-auto mt-16 relative">
        <div className="mb-6 flex items-center gap-2">
          
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight mb-8">Mis Desahogos</h1>
        <div className="flex flex-col gap-4">
          {mensajes.length === 0 ? (
            <div className="text-center py-8 text-gray-400 bg-neutral-800 rounded-xl shadow-xl border border-neutral-700">
              No tienes mensajes registrados.
            </div>
          ) : (
            mensajes.map((m) => (
              <div key={m.id} className="flex items-center justify-between bg-neutral-800 rounded-xl shadow border border-neutral-700 px-5 py-4 hover:bg-neutral-700 transition">
                <div className="flex-1">
                  <div className="text-white font-medium whitespace-pre-line mb-1">{m.texto}</div>
                  <div className="text-xs text-gray-400">{m.created_at ? new Date(m.created_at).toLocaleString() : ''}</div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button title="Editar" className="p-2 rounded hover:bg-pink-900 transition" onClick={() => handleEdit(m.id, m.texto)}>
                    <PencilSquareIcon className="w-5 h-5 text-pink-400" />
                  </button>
                  <button title="Eliminar" className="p-2 rounded hover:bg-red-900 transition" onClick={() => handleDelete(m.id)}>
                    <TrashIcon className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <br />
        <button onClick={() => navigate('/index')} className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg shadow transition font-bold">
            <ArrowLeftIcon className="w-5 h-5" />
            Volver al inicio
          </button>
        <button
          onClick={() => navigate('/desahogate/create')}
          className="fixed bottom-8 right-8 bg-pink-600 hover:bg-pink-700 text-white rounded-full shadow-2xl p-4 flex items-center gap-2 font-bold text-lg z-50 transition"
          style={{boxShadow:'0 8px 32px 0 rgba(0,0,0,0.25)'}}
        >
            
          <PlusIcon className="w-6 h-6" />
          Nuevo desahogo
        </button>

        {/* Modal de edición */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-neutral-900 rounded-xl p-8 shadow-2xl w-full max-w-md relative">
              <button className="absolute top-2 right-2 p-1 hover:bg-neutral-800 rounded" onClick={() => setShowModal(false)}>
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
              <h2 className="text-xl font-bold mb-4 text-pink-400">Editar desahogo</h2>
              <form onSubmit={handleEditSave} className="flex flex-col gap-4">
                <textarea
                  className="w-full h-32 p-3 rounded-lg bg-neutral-800 text-white border border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
                  value={editTexto}
                  onChange={e => setEditTexto(e.target.value)}
                  required
                />
                <div className="flex gap-2">
                  <button type="button" className="flex-1 px-4 py-2 bg-neutral-700 text-gray-300 rounded hover:bg-red-600 hover:text-white font-bold transition" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-pink-600 text-white rounded font-extrabold shadow-lg hover:bg-pink-700 transition">Guardar cambios</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 