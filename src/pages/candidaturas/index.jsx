import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { PlusIcon, PencilSquareIcon, XMarkIcon, CheckIcon, FaceFrownIcon, BoltIcon, ChevronUpIcon, ChevronDownIcon, ChartBarIcon, AdjustmentsHorizontalIcon, BuildingOffice2Icon, BriefcaseIcon, GlobeAltIcon, CurrencyEuroIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/solid';
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
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroOrigen, setFiltroOrigen] = useState('');
  const [tooltipFeedback, setTooltipFeedback] = useState({ show: false, text: '', x: 0, y: 0 });

  // Filtros visuales mejorados
  const ESTADOS = [
    { value: '', label: 'Todos' },
    { value: 'entrevista_contacto', label: 'Entrevista contacto' },
    { value: 'prueba_tecnica', label: 'Prueba técnica' },
    { value: 'segunda_entrevista', label: '2ª Entrevista' },
    { value: 'entrevista_final', label: 'Entrevista final' },
    { value: 'contratacion', label: 'Contratación' },
    { value: 'rechazado', label: 'No seleccionado' },
  ];
  const ORIGENES = [
    { value: '', label: 'Todos' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'InfoJobs', label: 'InfoJobs' },
    { value: 'Joppy', label: 'Joppy' },
    { value: 'Tecnoempleo', label: 'Tecnoempleo' },
    { value: 'Email', label: 'Email' },
    { value: 'Otros', label: 'Otros' },
  ];

  // Filtrado insensible a mayúsculas/minúsculas y espacios
  const candidaturasFiltradas = candidaturas.filter(c =>
    (filtroEstado === '' || (c.estado || '').toLowerCase().trim() === filtroEstado.toLowerCase().trim()) &&
    (filtroOrigen === '' || (c.origen || '').toLowerCase().trim() === filtroOrigen.toLowerCase().trim())
  );

  // Ordenar el array filtrado
  const candidaturasOrdenadas = [...candidaturasFiltradas].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    // Si es fecha, convertir a Date
    if (sortBy === 'fecha') {
      valA = valA ? new Date(valA) : new Date(0);
      valB = valB ? new Date(valB) : new Date(0);
    }
    if (valA === undefined || valA === null) return 1;
    if (valB === undefined || valB === null) return -1;
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
  const paginatedCandidaturas = candidaturasOrdenadas.slice(currentPage*pageSize, (currentPage+1)*pageSize);

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
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-2 tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in animate-title-in">Mi Diario de Candidaturas</h1>
        <div className="text-gray-400 text-center mb-8 text-lg animate-fade-in">Seguimiento completo de todos tus procesos de selección.</div>
        
        {/* Contador y estadísticas */}
        {!loading && candidaturas.length > 0 && (
          <div className="w-full max-w-6xl mx-auto mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
            <div className="bg-gradient-to-br from-blue-900/80 to-blue-800/60 rounded-xl p-4 text-center border border-blue-700 hover:scale-105 shadow-2xl transition-all">
              <div className="text-3xl mb-1">📋</div>
              <div className="text-2xl font-bold text-blue-300">{candidaturas.length}</div>
              <div className="text-sm text-blue-200">Total Candidaturas</div>
            </div>
            <div className="bg-gradient-to-br from-green-900/80 to-green-800/60 rounded-xl p-4 text-center border border-green-700 hover:scale-105 shadow-2xl transition-all">
              <div className="text-3xl mb-1">🟢</div>
              <div className="text-2xl font-bold text-green-300">
                {candidaturas.filter(c => c.estado === 'contratacion').length}
              </div>
              <div className="text-sm text-green-200">Contrataciones</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/80 to-purple-800/60 rounded-xl p-4 text-center border border-purple-700 hover:scale-105 shadow-2xl transition-all">
              <div className="text-3xl mb-1">🟣</div>
              <div className="text-2xl font-bold text-purple-300">
                {candidaturas.filter(c => c.estado !== 'rechazado' && c.estado !== 'contratacion').length}
              </div>
              <div className="text-sm text-purple-200">En Proceso</div>
            </div>
            <div className="bg-gradient-to-br from-red-900/80 to-red-800/60 rounded-xl p-4 text-center border border-red-700 hover:scale-105 shadow-2xl transition-all">
              <div className="text-3xl mb-1">❌</div>
              <div className="text-2xl font-bold text-red-300">
                {candidaturas.filter(c => c.estado === 'rechazado').length}
              </div>
              <div className="text-sm text-red-200">No seleccionadas</div>
            </div>
          </div>
        )}
        {/* Filtros arriba de la tabla */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 w-full max-w-6xl mx-auto animate-fade-in">
          <div className="flex gap-2 flex-wrap">
            {ESTADOS.map(e => (
              <button
                key={e.value}
                onClick={() => setFiltroEstado(e.value)}
                className={`flex items-center px-4 py-2 rounded-full border-2 font-bold text-sm transition-all shadow-lg hover:scale-105 active:scale-95 focus:ring-2 focus:ring-pink-400 bg-neutral-800 text-pink-200 border-pink-400 hover:bg-pink-600 hover:text-white ${e.value === filtroEstado ? 'animate-bounce' : ''}`}
              >
                {e.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {ORIGENES.map(o => (
              <button
                key={o.value}
                onClick={() => setFiltroOrigen(o.value)}
                className={`flex items-center px-4 py-2 rounded-full border-2 font-bold text-sm transition-all shadow-lg hover:scale-105 active:scale-95 focus:ring-2 focus:ring-pink-400 bg-neutral-800 text-pink-200 border-pink-400 hover:bg-pink-600 hover:text-white ${o.value === filtroOrigen ? 'animate-bounce' : ''}`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate('/candidaturas/estadisticas')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-500 to-pink-500 hover:from-pink-500 hover:to-blue-600 text-white rounded-full shadow-2xl font-extrabold text-lg border-2 border-white outline-none focus:ring-4 focus:ring-pink-200 transition-all drop-shadow-lg tracking-wide hover:text-yellow-200 focus:text-yellow-200"
            style={{boxShadow: '0 6px 32px 0 rgba(37,99,235,0.18)'}}
          >
            <ChartBarIcon className="w-7 h-7" /> Ver estadísticas
          </button>
        </div>
        <div className="backdrop-blur-md bg-neutral-900/80 rounded-2xl shadow-2xl border border-neutral-700 overflow-x-auto w-full max-w-6xl mx-auto p-2 sm:p-6 animate-fade-in">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 animate-pulse">
              <svg className="w-12 h-12 text-blue-400 animate-spin mb-4" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              <div className="text-lg text-gray-300 font-bold mb-2">Cargando...</div>
            </div>
          ) : (
            <div className="overflow-x-auto w-full max-w-6xl mx-auto mb-8 animate-fade-in">
              <table className="min-w-full divide-y divide-gray-700 bg-neutral-900 rounded-xl shadow-xl">
                 <thead className="sticky top-0 z-20 bg-neutral-900/95 backdrop-blur border-b border-neutral-700 shadow-lg">
                  <tr>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">⚡</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Puesto</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Empresa</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Web</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Origen</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('fecha')} title="Ordenar por fecha">Fecha {sortBy === 'fecha' && (sortDir === 'asc' ? '▲' : '▼')}</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider" title="Se actualiza al editar la candidatura o su estado">Actualizada</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Salario</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Franja</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Ubicación</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Feedback</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCandidaturas.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="py-12 text-center text-gray-400 text-lg">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-5xl animate-bounce-slow">😕</span>
                          <span>No tienes candidaturas registradas.</span>
                          <span className="text-sm text-gray-500">¡Empieza a crear tu primera candidatura!</span>
                          <button onClick={() => navigate('/candidaturas/create')} className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg text-base transition-all">
                            + Crear candidatura
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedCandidaturas.map((c, i) => (
                      <tr key={c.id} className={`hover:bg-neutral-800/80 transition-all border-b border-neutral-800 ${i % 2 === 0 ? 'bg-neutral-900' : 'bg-neutral-800/80'} animate-fade-in-row animate-pop`}>
                        <td className="px-2 py-3 text-center">
                          {c.estado === 'rechazado' && (
                            <button title="Ir a ejercicios" className="text-yellow-400 text-xl hover:scale-125 transition-transform" onClick={() => navigate('/retos/Fisico')} aria-label="Ir a ejercicios">⚡</button>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-white font-medium text-base">{c.puesto}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-300 text-base">{c.empresa}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-blue-400 hover:underline hover:decoration-pink-400">
                          {c.empresa_url ? <a href={c.empresa_url} target="_blank" rel="noopener noreferrer" title="Ver web de la empresa">🌐</a> : <span className="text-gray-500">-</span>}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-bold text-base">
                          <span className={
                            c.estado === 'contratacion' ? 'text-green-400 font-bold' :
                            c.estado === 'rechazado' ? 'text-red-500 font-bold' :
                            c.estado === 'entrevista_contacto' ? 'text-blue-400 font-bold' :
                            c.estado === 'prueba_tecnica' ? 'text-orange-400 font-bold' :
                            c.estado === 'segunda_entrevista' ? 'text-violet-400 font-bold' :
                            c.estado === 'entrevista_final' ? 'text-fuchsia-400 font-bold' :
                            'text-gray-300'
                          }>
                            {c.estado}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-blue-400">{c.origen}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-400">{c.fecha ? new Date(c.fecha).toLocaleDateString() : '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-400 relative group" title="Se actualiza al editar la candidatura o su estado">
                          {c.fecha_actualizacion ? new Date(c.fecha_actualizacion).toLocaleDateString() : '-'}
                          {c.historial_cambios && c.historial_cambios.length > 0 && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-neutral-800 text-xs text-gray-200 rounded shadow-lg p-2 z-30 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
                              <div className="font-bold mb-1 text-pink-300">Historial de cambios:</div>
                              <ul>
                                {c.historial_cambios.map((h, i) => <li key={i}>{h}</li>)}
                              </ul>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-pink-200 font-bold text-base">{c.salario_anual ? c.salario_anual + ' €' : '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-pink-200 font-bold text-base">{c.franja_salarial || '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-pink-200 font-bold text-base">{c.tipo_trabajo || '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-pink-200 font-bold text-base">{c.ubicacion || '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          {c.feedback ? (
                            <button onClick={() => setTooltipFeedback({ show: true, text: c.feedback })} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded font-bold text-xs" title="Ver feedback">Ver feedback</button>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap flex gap-2 items-center h-full justify-center">
                          <button onClick={() => handleEditClick(c)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-bold text-xs" title="Editar candidatura">Editar</button>
                          <button onClick={() => handleDeleteClick(c.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-bold text-xs" title="Borrar candidatura">Borrar</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <ReactPaginate
          previousLabel={'‹'}
          nextLabel={'›'}
          breakLabel={'...'}
          pageCount={totalPages}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName={'flex justify-center items-center gap-4 mt-10 animate-fade-in'}
          pageClassName={'text-lg px-7 py-4 rounded-full bg-neutral-900 hover:bg-pink-500 hover:text-white text-pink-300 font-extrabold border-4 border-pink-400 shadow-lg transition-all duration-200 cursor-pointer scale-100 hover:scale-110'}
          activeClassName={'!bg-pink-600 !text-white !border-pink-600 !shadow-2xl scale-110 z-10'}
          previousClassName={'text-lg px-6 py-4 rounded-full bg-neutral-900 hover:bg-blue-500 hover:text-white text-blue-200 font-bold border-4 border-blue-400 shadow-lg transition-all duration-200 cursor-pointer'}
          nextClassName={'text-lg px-6 py-4 rounded-full bg-neutral-900 hover:bg-blue-500 hover:text-white text-blue-200 font-bold border-4 border-blue-400 shadow-lg transition-all duration-200 cursor-pointer'}
          disabledClassName={'bg-neutral-800 text-gray-400 opacity-60 cursor-not-allowed'}
          breakClassName={'text-lg px-6 py-4 rounded-full bg-neutral-800 text-gray-300 font-bold border-4 border-neutral-700 shadow-lg'}
          forcePage={currentPage}
        />
        {/* Botón flotante para crear candidatura (solo escritorio) */}
        <button
          onClick={() => navigate('/candidaturas/create')}
          className="hidden sm:flex fixed bottom-8 right-8 z-50 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-2xl text-lg transition-all animate-fade-in items-center gap-2"
        >
          <PlusIcon className="w-6 h-6" />
          Crear candidatura
        </button>
        {/* Botón fijo en la parte inferior solo en móvil */}
        <div className="sm:hidden fixed bottom-0 left-0 w-full z-50 bg-neutral-900 border-t border-neutral-800 flex justify-center items-center py-3 animate-fade-in">
          <button
            onClick={() => navigate('/candidaturas/create')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg text-base transition-all"
          >
            <PlusIcon className="w-6 h-6" />
            Crear candidatura
          </button>
        </div>
        {/* Botón volver al inicio (oculto en móvil) */}
        <div className="hidden sm:flex justify-center mt-8 animate-fade-in">
          <button
            onClick={() => navigate('/index')}
            className="bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg text-lg transition-all"
          >
            Volver al inicio
          </button>
        </div>
        {/* Modal feedback */}
        {tooltipFeedback.show && (
          <Modal isOpen={tooltipFeedback.show} onClose={() => setTooltipFeedback({ show: false, text: '' })}>
            <div className="text-lg text-white font-bold mb-2">Feedback del reclutador</div>
            <div className="text-blue-200 text-base text-center whitespace-pre-line max-w-sm bg-neutral-800 p-4 rounded-lg border border-neutral-700">
              {tooltipFeedback.text}
            </div>
            <button onClick={() => setTooltipFeedback({ show: false, text: '' })} className="mt-4 px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-bold shadow-lg text-base transition-all">
              Cerrar
            </button>
          </Modal>
        )}
        <style>{`
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in { animation: fade-in 0.7s; }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            20% { transform: translateY(-18px); }
            40% { transform: translateY(0); }
            60% { transform: translateY(-8px); }
            80% { transform: translateY(0); }
          }
          .animate-bounce-slow {
            animation: bounce-slow 1.8s infinite cubic-bezier(.68,-0.55,.27,1.55);
            display: inline-block;
          }
          .animate-fade-in-row { animation: fade-in 0.7s; }
          .animate-title-in { animation: fade-in 0.7s; }
          .link-underline-anim { text-decoration: underline; }
          .animate-pop { animation: pop 0.5s; }
          @keyframes pop {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          .animate-ripple {
            animation: ripple 0.5s;
          }
          @keyframes ripple {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          .animate-glow {
            animation: glow 1s infinite;
          }
          @keyframes glow {
            0% { text-shadow: 0 0 5px #fff; }
            50% { text-shadow: 0 0 10px #fff; }
            100% { text-shadow: 0 0 5px #fff; }
          }
          .animate-shake {
            animation: shake 0.5s infinite;
          }
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(5px); }
          }
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
                feedback: form.feedback.value,
              };
              if (selectedCandidatura.estado === 'rechazado' && updated.estado !== 'rechazado') {
                localStorage.removeItem(`reto_completado_${selectedCandidatura.id}`);
              }
              const { error } = await supabase.from('candidaturas').update(updated).eq('id', selectedCandidatura.id);
              if (!error) {
                setCandidaturas(candidaturas.map(c => c.id === selectedCandidatura.id ? { ...c, ...updated } : c));
                setModalOpen(false);
                await Swal.fire({
                  icon: 'success',
                  title: 'Candidatura actualizada',
                  text: 'Los cambios se han guardado correctamente.',
                  background: '#18181b',
                  color: '#fff',
                  confirmButtonColor: '#6366f1',
                  timer: 1800,
                  showConfirmButton: false
                });
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
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-300">Feedback de reclutador</span>
              <textarea
                name="feedback"
                defaultValue={selectedCandidatura.feedback || ''}
                className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[60px]"
                placeholder="Copia aquí el feedback recibido, comentarios de entrevistas, etc. (opcional)"
              />
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