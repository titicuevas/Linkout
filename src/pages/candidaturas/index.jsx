import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { PlusIcon, PencilSquareIcon, XMarkIcon, CheckIcon, FaceFrownIcon, BoltIcon, ChevronUpIcon, ChevronDownIcon, ChartBarIcon, AdjustmentsHorizontalIcon, BuildingOffice2Icon, BriefcaseIcon, GlobeAltIcon, CurrencyEuroIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/solid';
// import Layout from '../../components/Layout';
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
  const totalPages = Math.ceil(candidaturasFiltradas.length / pageSize);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroOrigen, setFiltroOrigen] = useState('');
  const [modalFeedback, setModalFeedback] = useState({ show: false, text: '' });

  // Filtros visuales mejorados
  const ESTADOS = [
    { value: '', label: 'Todos', icon: <AdjustmentsHorizontalIcon className="w-5 h-5 mr-1" /> },
    { value: 'entrevista_contacto', label: 'Entrevista contacto', icon: <BriefcaseIcon className="w-5 h-5 mr-1" /> },
    { value: 'prueba_tecnica', label: 'Prueba técnica', icon: <ChartBarIcon className="w-5 h-5 mr-1" /> },
    { value: 'segunda_entrevista', label: '2ª Entrevista', icon: <ChartBarIcon className="w-5 h-5 mr-1" /> },
    { value: 'entrevista_final', label: 'Entrevista final', icon: <ChartBarIcon className="w-5 h-5 mr-1" /> },
    { value: 'contratacion', label: 'Contratación', icon: <BuildingOffice2Icon className="w-5 h-5 mr-1" /> },
    { value: 'rechazado', label: 'No seleccionado', icon: <XMarkIcon className="w-5 h-5 mr-1" /> },
  ];
  const ORIGENES = [
    { value: '', label: 'Todos', icon: <AdjustmentsHorizontalIcon className="w-5 h-5 mr-1" /> },
    { value: 'linkedin', label: 'LinkedIn', icon: <GlobeAltIcon className="w-5 h-5 mr-1" /> },
    { value: 'infojobs', label: 'InfoJobs', icon: <GlobeAltIcon className="w-5 h-5 mr-1" /> },
    { value: 'joppy', label: 'Joppy', icon: <GlobeAltIcon className="w-5 h-5 mr-1" /> },
    { value: 'tecnoempleo', label: 'Tecnoempleo', icon: <GlobeAltIcon className="w-5 h-5 mr-1" /> },
    { value: 'correo_directo', label: 'Email', icon: <GlobeAltIcon className="w-5 h-5 mr-1" /> },
    { value: 'otro', label: 'Otros', icon: <GlobeAltIcon className="w-5 h-5 mr-1" /> },
  ];

  // Filtrado insensible a mayúsculas/minúsculas y espacios
  const candidaturasFiltradas = candidaturas.filter(c =>
    (filtroEstado === '' || (c.estado || '').toLowerCase().trim() === filtroEstado.toLowerCase().trim()) &&
    (filtroOrigen === '' || (c.origen || '').toLowerCase().trim().includes(filtroOrigen.toLowerCase().trim()))
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

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(0);
  }, [filtroEstado, filtroOrigen]);

  if (!user) return null;
  return (<div>Test</div>);
} 