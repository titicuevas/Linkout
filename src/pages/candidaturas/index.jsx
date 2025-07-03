import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { PlusIcon, PencilSquareIcon, XMarkIcon, CheckIcon, FaceFrownIcon, BoltIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/Modal';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';

export default function CandidaturasIndex() {
  const [user, setUser] = useState(null);
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCandidatura, setSelectedCandidatura] = useState(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
  const [sortBy, setSortBy] = useState('fecha');
  const [sortDir, setSortDir] = useState('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 4;
  const totalPages = Math.ceil(candidaturas.length / pageSize);
  const paginatedCandidaturas = candidaturas.slice(currentPage*pageSize, (currentPage+1)*pageSize);

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
      setLoading(true);
      const { data, error } = await supabase.from('candidaturas').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (error) console.error('Error al cargar candidaturas:', error);
      setCandidaturas(data || []);
      setLoading(false);
    }
    fetchCandidaturas();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleEditClick = (candidatura) => {
    setSelectedCandidatura(candidatura);
    setEstadoSeleccionado(candidatura.estado);
    setModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase.from('candidaturas').delete().eq('id', id);
        if (!error) {
          setCandidaturas(candidaturas.filter(c => c.id !== id));
          Swal.fire('¡Borrado!', 'La candidatura ha sido eliminada.', 'success');
        } else {
          Swal.fire('Error', 'No se pudo borrar la candidatura.', 'error');
        }
      }
    });
  };

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  if (!user) return null;

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-neutral-900 px-2 py-8 relative">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-2 tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">Mi Diario de Candidaturas</h1>
        <div className="text-gray-400 text-center mb-8 text-lg animate-fade-in">Seguimiento completo de todos tus procesos de selección.</div>
        
        {/* Contador y estadísticas */}
        {!loading && candidaturas.length > 0 && (
          <div className="w-full max-w-6xl mx-auto mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
            <div className="bg-gradient-to-br from-blue-900/80 to-blue-800/60 rounded-xl p-4 text-center border border-blue-700">
              <div className="text-2xl font-bold text-blue-300">{candidaturas.length}</div>
              <div className="text-sm text-blue-200">Total Candidaturas</div>
            </div>
            <div className="bg-gradient-to-br from-green-900/80 to-green-800/60 rounded-xl p-4 text-center border border-green-700">
              <div className="text-2xl font-bold text-green-300">
                {candidaturas.filter(c => c.estado === 'contratacion').length}
              </div>
              <div className="text-sm text-green-200">Contrataciones</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/80 to-purple-800/60 rounded-xl p-4 text-center border border-purple-700">
              <div className="text-2xl font-bold text-purple-300">
                {candidaturas.filter(c => c.estado !== 'rechazado' && c.estado !== 'contratacion').length}
              </div>
              <div className="text-sm text-purple-200">En Proceso</div>
            </div>
            <div className="bg-gradient-to-br from-red-900/80 to-red-800/60 rounded-xl p-4 text-center border border-red-700">
              <div className="text-2xl font-bold text-red-300">
                {candidaturas.filter(c => c.estado === 'rechazado').length}
              </div>
              <div className="text-sm text-red-200">No seleccionadas</div>
            </div>
          </div>
        )}
        <div className="backdrop-blur-md bg-neutral-900/80 rounded-2xl shadow-2xl border border-neutral-700 overflow-x-auto w-full max-w-6xl mx-auto p-2 sm:p-6 animate-fade-in">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 animate-pulse">
              <svg className="w-12 h-12 text-blue-400 animate-spin mb-4" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              <div className="text-lg text-gray-300 font-bold mb-2">Cargando...</div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-neutral-700 text-lg" style={{minWidth:'1200px'}}>
              <thead>
                <tr>
                  <th className="px-10 py-4 text-left text-base font-bold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('puesto')}>Puesto {sortBy==='puesto' && (sortDir==='asc'?<ChevronUpIcon className="inline w-5 h-5"/>:<ChevronDownIcon className="inline w-5 h-5"/>)}</th>
                  <th className="px-10 py-4 text-left text-base font-bold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('empresa')}>Empresa {sortBy==='empresa' && (sortDir==='asc'?<ChevronUpIcon className="inline w-5 h-5"/>:<ChevronDownIcon className="inline w-5 h-5"/>)}</th>
                  <th className="px-10 py-4 text-left text-base font-bold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('estado')}>Estado {sortBy==='estado' && (sortDir==='asc'?<ChevronUpIcon className="inline w-5 h-5"/>:<ChevronDownIcon className="inline w-5 h-5"/>)}</th>
                  <th className="px-10 py-4 text-left text-base font-bold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('fecha')}>Fecha {sortBy==='fecha' && (sortDir==='asc'?<ChevronUpIcon className="inline w-5 h-5"/>:<ChevronDownIcon className="inline w-5 h-5"/>)}</th>
                  <th className="px-10 py-4 text-left text-base font-bold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('salario_anual')}>Salario {sortBy==='salario_anual' && (sortDir==='asc'?<ChevronUpIcon className="inline w-5 h-5"/>:<ChevronDownIcon className="inline w-5 h-5"/>)}</th>
                  <th className="px-10 py-4 text-left text-base font-bold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('tipo_trabajo')}>Tipo {sortBy==='tipo_trabajo' && (sortDir==='asc'?<ChevronUpIcon className="inline w-5 h-5"/>:<ChevronDownIcon className="inline w-5 h-5"/>)}</th>
                  <th className="px-10 py-4 text-left text-base font-bold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('ubicacion')}>Ubicación {sortBy==='ubicacion' && (sortDir==='asc'?<ChevronUpIcon className="inline w-5 h-5"/>:<ChevronDownIcon className="inline w-5 h-5"/>)}</th>
                  <th className="px-10 py-4 text-left text-base font-bold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('origen')}>Origen {sortBy==='origen' && (sortDir==='asc'?<ChevronUpIcon className="inline w-5 h-5"/>:<ChevronDownIcon className="inline w-5 h-5"/>)}</th>
                  <th className="px-10 py-4 text-left text-base font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {paginatedCandidaturas.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-20 text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
                        <FaceFrownIcon className="w-16 h-16 text-blue-400 mb-2 animate-bounce" />
                        <span className="text-xl font-bold">No tienes candidaturas registradas.</span>
                        <span className="text-base text-gray-400 mb-2">¡Empieza a crear tu primera candidatura!</span>
                        <button onClick={() => navigate('/candidaturas/create')} className="mt-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg text-lg transition-all animate-fade-in">+ Crear candidatura</button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedCandidaturas.map((c) => (
                    <tr key={c.id} className="hover:bg-neutral-700 transition" style={{height:'64px'}}>
                      <td className="px-8 py-4 whitespace-nowrap text-white font-medium text-lg">{c.puesto}</td>
                      <td className="px-8 py-4 whitespace-nowrap text-gray-300 text-lg">{c.empresa}</td>
                      <td className="px-8 py-4 whitespace-nowrap">
                        <span className="px-4 py-2 rounded-full text-base font-bold " style={{
                          background: c.estado === 'contratacion' ? '#22c55e' : 
                                    c.estado === 'rechazado' ? '#ef4444' : 
                                    c.estado === 'entrevista_final' ? '#10b981' :
                                    c.estado === 'segunda_entrevista' ? '#3b82f6' :
                                    c.estado === 'prueba_tecnica' ? '#f59e0b' :
                                    c.estado === 'entrevista_contacto' ? '#8b5cf6' : '#64748b', 
                          color: 'white'
                        }}>
                          {c.estado.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-gray-400 text-lg">{c.fecha ? new Date(c.fecha).toLocaleDateString() : ''}</td>
                      <td className="px-8 py-4 whitespace-nowrap text-pink-200 font-bold text-lg">{c.salario_anual ? `${c.salario_anual} €` : c.franja_salarial || '-'}</td>
                      <td className="px-8 py-4 whitespace-nowrap text-pink-200 font-bold text-lg">{c.tipo_trabajo || '-'}</td>
                      <td className="px-8 py-4 whitespace-nowrap text-pink-200 font-bold text-lg">{c.ubicacion || '-'}</td>
                      <td className="px-8 py-4 whitespace-nowrap text-blue-200 font-bold text-lg">{c.origen ? c.origen.replace('_', ' ').toUpperCase() : '-'}</td>
                      <td className="px-8 py-4 whitespace-nowrap flex gap-3">
                        <button onClick={() => handleEditClick(c)} className="bg-blue-600 hover:bg-blue-700 rounded-full p-3 transition" title="Editar" style={{fontSize:'1.3rem'}}>
                          <PencilSquareIcon className="w-7 h-7 text-white" />
                        </button>
                        <button onClick={() => handleDeleteClick(c.id)} className="bg-red-600 hover:bg-red-700 rounded-full p-3 transition" title="Borrar" style={{fontSize:'1.3rem'}}>
                          <XMarkIcon className="w-7 h-7 text-white" />
                        </button>
                        {c.estado === 'rechazado' && (
                          <button
                            onClick={() => navigate('/retos/fisico', { state: { candidatura: c } })}
                            className="bg-yellow-400 hover:bg-yellow-500 rounded-full p-3 transition flex items-center justify-center"
                            title="Reto físico"
                            style={{fontSize:'1.3rem'}}
                          >
                            <BoltIcon className="w-7 h-7 text-yellow-900" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          breakLabel={'...'}
          pageCount={totalPages}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName={'flex justify-center items-center gap-2 mt-6 animate-fade-in'}
          pageClassName={'px-3 py-2 rounded-full bg-neutral-700 hover:bg-pink-500 text-white font-bold transition-all'}
          activeClassName={'bg-pink-500 text-white font-extrabold'}
          previousClassName={'px-3 py-2 rounded-full bg-neutral-700 hover:bg-blue-500 text-white font-bold transition-all'}
          nextClassName={'px-3 py-2 rounded-full bg-neutral-700 hover:bg-blue-500 text-white font-bold transition-all'}
          disabledClassName={'bg-neutral-700 text-gray-400'}
          forcePage={currentPage}
        />
        <div className="flex justify-center mt-8 animate-fade-in">
          <button
            onClick={() => navigate('/index')}
            className="bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg text-lg transition-all"
          >
            Volver al inicio
          </button>
        </div>
        {/* Botón flotante para crear candidatura */}
        <button
          onClick={() => navigate('/candidaturas/create')}
          className="fixed bottom-8 right-8 z-50 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-2xl text-lg transition-all animate-fade-in flex items-center gap-2"
        >
          <PlusIcon className="w-6 h-6" />
          Crear candidatura
        </button>
        <style>{`
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in { animation: fade-in 0.7s; }
        `}</style>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedCandidatura && (
          <form
            className="flex flex-col gap-5 min-w-[320px] animate-fade-in"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const updated = {
                puesto: form.puesto.value,
                empresa: form.empresa.value,
                estado: form.estado.value,
                fecha: form.fecha.value,
                salario_anual: form.salario_anual.value ? Number(form.salario_anual.value) : null,
                franja_salarial: form.franja_salarial.value,
                tipo_trabajo: form.tipo_trabajo.value,
                ubicacion: form.ubicacion.value,
                origen: form.origen.value,
              };
              if (selectedCandidatura.estado === 'rechazado' && updated.estado !== 'rechazado') {
                localStorage.removeItem(`reto_completado_${selectedCandidatura.id}`);
              }
              const { error } = await supabase.from('candidaturas').update(updated).eq('id', selectedCandidatura.id);
              if (!error) {
                setCandidaturas(candidaturas.map(c => c.id === selectedCandidatura.id ? { ...c, ...updated } : c));
                setModalOpen(false);
              } else {
                alert('Error al guardar los cambios');
              }
            }}
            autoComplete="off"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 mx-auto">
                <PencilSquareIcon className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-bold text-center">Editar candidatura</h2>
              </div>
              <button type="button" className="ml-2 p-1 rounded hover:bg-neutral-800 transition" onClick={() => setModalOpen(false)}>
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-300">Puesto</span>
              <input
                name="puesto"
                defaultValue={selectedCandidatura.puesto}
                className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-300">Empresa</span>
              <input
                name="empresa"
                defaultValue={selectedCandidatura.empresa}
                className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-300">Estado</span>
              <select
                name="estado"
                value={estadoSeleccionado}
                onChange={e => setEstadoSeleccionado(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="entrevista_contacto">Entrevista de contacto</option>
                <option value="prueba_tecnica">Prueba técnica</option>
                <option value="segunda_entrevista">Segunda entrevista</option>
                <option value="entrevista_final">Entrevista final</option>
                <option value="contratacion">Contratación</option>
                <option value="rechazado">No seleccionado</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-300">Fecha</span>
              <input
                name="fecha"
                type="date"
                defaultValue={selectedCandidatura.fecha ? new Date(selectedCandidatura.fecha).toISOString().split('T')[0] : ''}
                className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-300">Salario anual (opcional)</span>
              <input
                name="salario_anual"
                type="number"
                min="0"
                step="100"
                defaultValue={selectedCandidatura.salario_anual || ''}
                className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
                placeholder="Ej: 22000"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-300">Franja salarial (opcional)</span>
              <select
                name="franja_salarial"
                defaultValue={selectedCandidatura.franja_salarial || ''}
                className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
              >
                <option value="">Selecciona una franja</option>
                <option value="< 15.000 €">{'< 15.000 €'}</option>
                <option value="15.000 - 20.000 €">15.000 - 20.000 €</option>
                <option value="20.000 - 25.000 €">20.000 - 25.000 €</option>
                <option value="25.000 - 30.000 €">25.000 - 30.000 €</option>
                <option value="30.000 - 40.000 €">30.000 - 40.000 €</option>
                <option value="> 40.000 €">{'>'} 40.000 €</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-300">Tipo de trabajo</span>
              <select
                name="tipo_trabajo"
                defaultValue={selectedCandidatura.tipo_trabajo || ''}
                className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
                required
              >
                <option value="">Selecciona tipo</option>
                <option value="Presencial">Presencial</option>
                <option value="Remoto">Remoto</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-300">Ubicación</span>
              <input
                name="ubicacion"
                type="text"
                defaultValue={selectedCandidatura.ubicacion || ''}
                className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
                required
                placeholder="Ciudad, país..."
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-300">Origen de la candidatura</span>
              <select
                name="origen"
                defaultValue={selectedCandidatura.origen || ''}
                className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
                required
              >
                <option value="">Selecciona origen</option>
                <option value="infojobs">InfoJobs</option>
                <option value="linkedin">LinkedIn</option>
                <option value="joppy">Joppy</option>
                <option value="tecnoempleo">Tecnoempleo</option>
                <option value="correo_directo">Correo directo empresa</option>
                <option value="otro">Otro</option>
              </select>
            </label>
            <div className="flex gap-2 justify-end mt-2">
              <button
                type="button"
                className="bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 px-4 rounded flex items-center gap-2"
                onClick={() => setModalOpen(false)}
              >
                <XMarkIcon className="w-5 h-5" />
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center gap-2"
              >
                <CheckIcon className="w-5 h-5" />
                Guardar cambios
              </button>
            </div>
          </form>
        )}
      </Modal>
    </Layout>
  );
} 