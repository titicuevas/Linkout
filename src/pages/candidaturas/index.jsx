import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import Layout from '../../components/Layout';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/Modal';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';

export default function CandidaturasIndex() {
  const [user, setUser] = useState(null);
  const [candidaturas, setCandidaturas] = useState([]);
  const navigate = useNavigate();
  const [sortBy] = useState('fecha');
  const [sortDir] = useState('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 4;
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroOrigen, setFiltroOrigen] = useState('');
  const [modalFeedback, setModalFeedback] = useState({ show: false, text: '' });

  // Filtros visuales
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
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'infojobs', label: 'InfoJobs' },
    { value: 'joppy', label: 'Joppy' },
    { value: 'tecnoempleo', label: 'Tecnoempleo' },
    { value: 'correo_directo', label: 'Email' },
    { value: 'otro', label: 'Otros' },
  ];

  // Filtrado
  const candidaturasFiltradas = candidaturas.filter(c =>
    (filtroEstado === '' || (c.estado || '').toLowerCase().trim() === filtroEstado.toLowerCase().trim()) &&
    (filtroOrigen === '' || (c.origen || '').toLowerCase().trim().includes(filtroOrigen.toLowerCase().trim()))
  );

  // Ordenar
  const candidaturasOrdenadas = [...candidaturasFiltradas].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
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
      const { data, error } = await supabase.from('candidaturas').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (error) console.error('Error al cargar candidaturas:', error);
      setCandidaturas(data || []);
    }
    fetchCandidaturas();
  }, [user]);

  const handleEditClick = () => {
    // Aquí iría la lógica de edición si se reactiva el modal de edición
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

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [filtroEstado, filtroOrigen]);

  if (!user) return null;

  return (
    <Layout user={user}>
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-neutral-900 px-2 py-8 relative">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-2 tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">Mi Diario de Candidaturas</h1>
        <div className="text-gray-400 text-center mb-8 text-lg animate-fade-in">Seguimiento completo de todos tus procesos de selección.</div>
        {/* Botón para crear candidatura */}
        <button
          className="fixed bottom-8 right-8 z-50 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all text-lg"
          onClick={() => navigate('/candidaturas/create')}
        >
          + Añadir candidatura
        </button>
        {/* Filtros de estado */}
        <div className="flex gap-2 flex-wrap justify-center mb-4">
          {ESTADOS.map(e => (
            <button
              key={e.value}
              onClick={() => setFiltroEstado(e.value)}
              className={`flex items-center px-3 py-2 rounded-full border-2 font-bold text-xs sm:text-sm transition-all shadow-md ${filtroEstado === e.value ? 'bg-pink-600 text-white border-pink-600 scale-105' : 'bg-neutral-800 text-pink-200 border-pink-400 hover:bg-pink-700 hover:text-white'}`}
            >
              {e.label}
            </button>
          ))}
        </div>
        {/* Filtros de origen */}
        <div className="flex gap-2 flex-wrap justify-center mb-4">
          {ORIGENES.map(o => (
            <button
              key={o.value}
              onClick={() => setFiltroOrigen(o.value)}
              className={`flex items-center px-3 py-2 rounded-full border-2 font-bold text-xs sm:text-sm transition-all shadow-md ${filtroOrigen === o.value ? 'bg-blue-600 text-white border-blue-600 scale-105' : 'bg-neutral-800 text-blue-200 border-blue-400 hover:bg-blue-700 hover:text-white'}`}
            >
              {o.label}
            </button>
          ))}
        </div>
        {/* Tabla de candidaturas */}
        <div className="overflow-x-auto w-full max-w-6xl mx-auto">
          <table className="min-w-full divide-y divide-gray-700 bg-neutral-900 rounded-xl shadow-xl">
            <thead>
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Puesto</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Empresa</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Origen</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCandidaturas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-8">No hay candidaturas.</td>
                </tr>
              ) : (
                paginatedCandidaturas.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-800 transition-colors">
                    <td className="px-8 py-4 whitespace-nowrap text-white font-medium text-lg">{c.puesto}</td>
                    <td className="px-8 py-4 whitespace-nowrap text-gray-300 text-lg">{c.empresa}</td>
                    <td className="px-8 py-4 whitespace-nowrap text-pink-400 font-bold">{c.estado}</td>
                    <td className="px-8 py-4 whitespace-nowrap text-blue-400">{c.origen}</td>
                    <td className="px-8 py-4 whitespace-nowrap text-gray-400">{c.fecha ? new Date(c.fecha).toLocaleDateString() : '-'}</td>
                    <td className="px-8 py-4 whitespace-nowrap flex gap-2">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-bold text-xs"
                        onClick={() => handleEditClick()}
                      >Editar</button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-bold text-xs"
                        onClick={() => handleDeleteClick(c.id)}
                      >Borrar</button>
                      <button
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded font-bold text-xs"
                        onClick={() => setModalFeedback({ show: true, text: c.feedback_reclutador || 'Sin feedback' })}
                      >Feedback</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Paginación */}
        <div className="mt-6">
          <ReactPaginate
            previousLabel={"← Anterior"}
            nextLabel={"Siguiente →"}
            breakLabel={"..."}
            pageCount={Math.ceil(candidaturasFiltradas.length / pageSize)}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={"flex gap-2 justify-center"}
            pageClassName={"px-3 py-1 rounded bg-neutral-800 text-white border border-neutral-700 hover:bg-blue-700 hover:text-white transition-all"}
            activeClassName={"bg-blue-600 text-white border-blue-600"}
            previousClassName={"px-3 py-1 rounded bg-neutral-800 text-white border border-neutral-700 hover:bg-blue-700 hover:text-white transition-all"}
            nextClassName={"px-3 py-1 rounded bg-neutral-800 text-white border border-neutral-700 hover:bg-blue-700 hover:text-white transition-all"}
            disabledClassName={"opacity-50 cursor-not-allowed"}
          />
        </div>
        {/* Modal de feedback */}
        <Modal isOpen={modalFeedback.show} onClose={() => setModalFeedback({ show: false, text: '' })}>
          <div className="text-lg text-white font-bold mb-2">Feedback del reclutador</div>
          <div className="text-gray-200 whitespace-pre-line">{modalFeedback.text}</div>
        </Modal>
      </div>
    </Layout>
  );
} 