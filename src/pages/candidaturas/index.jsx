import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { PlusIcon } from '@heroicons/react/24/solid';
import Layout from '../../components/Layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Modal from '../../components/Modal';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import PageLoader from '../../components/PageLoader';
import CandidaturasStats from './CandidaturasStats';
import CandidaturasFilters from './CandidaturasFilters';
import CandidaturasMobileList from './CandidaturasMobileList';
import CandidaturasDesktopTable from './CandidaturasDesktopTable';
import CandidaturaEditModal from './CandidaturaEditModal';
import {
  ESTADOS,
  ORIGENES,
  getFollowUpsPendientes,
  normalizeOrigen,
  matchesCandidaturaSearch,
  buildStatusUpdate,
  needsFollowUp,
  buildDuplicatePayload,
  loadSavedViews,
  persistSavedViews,
  createSavedView,
  removeSavedView,
  hasActiveCandidaturaFilters,
  isActiveProcess,
  isRecentApplication,
  FILTRO_EN_PROCESO,
} from './shared';
import { useAuth } from '../../hooks/useAuth';
import { useTitle } from '../../hooks/useTitle';
import { swalSuccess, swalError, swalWarning, swalInfo } from '../../utils/swalTheme';

const CANDIDATURAS_PREFS_KEY = 'linkout_candidaturas_prefs';

export default function CandidaturasIndex() {
  const { user, authLoading, logout } = useAuth();
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCandidatura, setSelectedCandidatura] = useState(null);
  const [sortBy, setSortBy] = useState('fecha');
  const [sortDir, setSortDir] = useState('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroOrigen, setFiltroOrigen] = useState('');
  const [filtroSeguimiento, setFiltroSeguimiento] = useState(false);
  const [filtroRecientes, setFiltroRecientes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedViews, setSavedViews] = useState([]);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [detailModal, setDetailModal] = useState({ show: false, title: '', text: '' });
  const [prefsReady, setPrefsReady] = useState(false);

  // Filtrado: estado, origen, búsqueda, seguimiento, recientes
  const candidaturasFiltradas = candidaturas.filter((c) => {
    const matchesEstado = filtroEstado === ''
      ? true
      : filtroEstado === 'en_proceso'
        ? isActiveProcess(c)
        : (c.estado || '').toLowerCase().trim() === filtroEstado.toLowerCase().trim();

    return matchesEstado
      && (filtroOrigen === '' || normalizeOrigen(c.origen) === filtroOrigen)
      && matchesCandidaturaSearch(c, searchQuery)
      && (!filtroSeguimiento || needsFollowUp(c))
      && (!filtroRecientes || isRecentApplication(c));
  });

  // Ordenar el array filtrado
  const candidaturasOrdenadas = [...candidaturasFiltradas].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (sortBy === 'fecha' || sortBy === 'fecha_actualizacion') {
      valA = valA ? new Date(valA) : new Date(0);
      valB = valB ? new Date(valB) : new Date(0);
    }
    if (valA === undefined || valA === null) return 1;
    if (valB === undefined || valB === null) return -1;
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
  const totalPages = Math.max(1, Math.ceil(candidaturasOrdenadas.length / pageSize) || 1);
  const paginatedCandidaturas = candidaturasOrdenadas.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const followUpsPendientes = getFollowUpsPendientes(candidaturas);
  const filtersActive = hasActiveCandidaturaFilters({
    filtroEstado,
    filtroOrigen,
    filtroSeguimiento,
    filtroRecientes,
    searchQuery,
  });

  useTitle('Mis Candidaturas');

  useEffect(() => {
    const savedPrefs = localStorage.getItem(CANDIDATURAS_PREFS_KEY);
    if (!savedPrefs) {
      setPrefsReady(true);
      return;
    }

    try {
      const prefs = JSON.parse(savedPrefs);
      setSortBy(prefs.sortBy || 'fecha');
      setSortDir(prefs.sortDir || 'desc');
      setCurrentPage(Number.isInteger(prefs.currentPage) ? prefs.currentPage : 0);
      setPageSize(prefs.pageSize || 4);
      setFiltroEstado(prefs.filtroEstado || '');
      setFiltroOrigen(prefs.filtroOrigen || '');
      setFiltroSeguimiento(Boolean(prefs.filtroSeguimiento));
      setFiltroRecientes(Boolean(prefs.filtroRecientes));
      setSearchQuery(prefs.searchQuery || '');
    } catch {
      localStorage.removeItem(CANDIDATURAS_PREFS_KEY);
    } finally {
      setPrefsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!prefsReady) return;

    const estado = searchParams.get('estado');
    const seguimiento = searchParams.get('seguimiento');
    const recientes = searchParams.get('recientes');
    const candidaturaId = searchParams.get('id');
    const hasFilterParams = estado !== null || seguimiento !== null || recientes !== null;
    if (!hasFilterParams) return;

    // Deep-links accionables: limpian filtros conflictivos de prefs
    if (seguimiento === '1' || seguimiento === 'true') {
      setFiltroSeguimiento(true);
      setFiltroEstado('');
      setFiltroRecientes(false);
      setFiltroOrigen('');
      setSearchQuery('');
    } else if (recientes === '1' || recientes === 'true') {
      setFiltroRecientes(true);
      setFiltroSeguimiento(false);
      setFiltroEstado('');
      setFiltroOrigen('');
      setSearchQuery('');
    } else if (estado !== null) {
      setFiltroEstado(estado);
      setFiltroSeguimiento(false);
      setFiltroRecientes(false);
      setFiltroOrigen('');
      setSearchQuery('');
    }

    setCurrentPage(0);

    if (candidaturaId) {
      setSearchParams({ id: candidaturaId }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [prefsReady, searchParams, setSearchParams]);

  useEffect(() => {
    if (loading || !prefsReady) return;
    const candidaturaId = searchParams.get('id');
    if (!candidaturaId) return;

    const target = candidaturas.find((item) => item.id === candidaturaId);
    if (target) {
      setSelectedCandidatura(target);
      setModalOpen(true);
      setSearchParams({}, { replace: true });
      return;
    }

    // Tras cargar, si el id no existe, limpia el param
    setSearchParams({}, { replace: true });
  }, [loading, prefsReady, candidaturas, searchParams, setSearchParams]);

  useEffect(() => {
    setSavedViews(loadSavedViews());
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchCandidaturas() {
      if (!user) return;
      setLoading(true);
      setLoadError('');
      const { data, error } = await supabase.from('candidaturas').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (cancelled) return;
      if (error) {
        setLoadError('No se pudieron cargar las candidaturas. Inténtalo de nuevo.');
        setCandidaturas([]);
      } else {
        setCandidaturas(data || []);
      }
      setLoading(false);
    }
    fetchCandidaturas();
    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => {
    if (!prefsReady) return;
    localStorage.setItem(
      CANDIDATURAS_PREFS_KEY,
      JSON.stringify({
        sortBy,
        sortDir,
        currentPage,
        pageSize,
        filtroEstado,
        filtroOrigen,
        filtroSeguimiento,
        filtroRecientes,
        searchQuery,
      }),
    );
  }, [prefsReady, sortBy, sortDir, currentPage, pageSize, filtroEstado, filtroOrigen, filtroSeguimiento, filtroRecientes, searchQuery]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(candidaturasFiltradas.length / pageSize) - 1);
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [candidaturasFiltradas.length, pageSize, currentPage]);


  const handleEditClick = (candidatura) => {
    setSelectedCandidatura(candidatura);
    setModalOpen(true);
  };

  const handleStatusChange = async (candidatura, newEstado) => {
    if (!newEstado || newEstado === candidatura.estado) return;
    setStatusUpdatingId(candidatura.id);
    const payload = buildStatusUpdate(candidatura, newEstado);

    if (candidatura.estado === 'rechazado' && newEstado !== 'rechazado') {
      localStorage.removeItem(`reto_completado_${candidatura.id}`);
    }

    const { error } = await supabase.from('candidaturas').update(payload).eq('id', candidatura.id);
    setStatusUpdatingId(null);

    if (error) {
      await Swal.fire(swalError('Error', 'No se pudo actualizar el estado.'));
      return;
    }

    setCandidaturas((prev) => prev.map((c) => (c.id === candidatura.id ? { ...c, ...payload } : c)));
  };

  const handleDeleteClick = (id) => {
    Swal.fire(swalWarning('¿Estás seguro?', 'Esta acción no se puede deshacer', {
      confirmButtonText: 'Sí, borrar',
    })).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase.from('candidaturas').delete().eq('id', id);
        if (!error) {
          setCandidaturas((prev) => prev.filter((c) => c.id !== id));
          Swal.fire(swalSuccess('¡Borrado!', 'La candidatura ha sido eliminada.', {
            timer: 1200,
            showConfirmButton: false,
          }));
        } else {
          Swal.fire(swalError('Error', 'No se pudo borrar la candidatura.'));
        }
      }
    });
  };

  const handleDuplicateClick = async (candidatura) => {
    const result = await Swal.fire(swalWarning(
      '¿Duplicar candidatura?',
      `Se creará una copia de "${candidatura.puesto}" en "${candidatura.empresa}" con la fecha de hoy.`,
      { confirmButtonText: 'Sí, duplicar', confirmButtonColor: '#6366f1' },
    ));

    if (!result.isConfirmed || !user) return;

    const payload = buildDuplicatePayload(candidatura, user.id);
    const { data, error } = await supabase.from('candidaturas').insert([payload]).select().single();

    if (error || !data) {
      await Swal.fire(swalError('Error', 'No se pudo duplicar la candidatura.'));
      return;
    }

    setCandidaturas((prev) => [data, ...prev]);
    await Swal.fire(swalSuccess('Candidatura duplicada', 'La copia se ha creado correctamente.', { timer: 1600, showConfirmButton: false }));
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

  const exportToCsv = () => {
    if (candidaturasOrdenadas.length === 0) {
      Swal.fire(swalInfo('Sin datos', 'No hay candidaturas para exportar con los filtros actuales.'));
      return;
    }

    const headers = [
      'Puesto',
      'Empresa',
      'URL empresa',
      'Estado',
      'Origen',
      'Fecha',
      'Fecha actualizacion',
      'Salario anual',
      'Franja salarial',
      'Tipo de trabajo',
      'Ubicacion',
      'Feedback',
      'Notas',
    ];

    const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const rows = candidaturasOrdenadas.map((candidatura) => ([
      candidatura.puesto,
      candidatura.empresa,
      candidatura.empresa_url,
      candidatura.estado,
      candidatura.origen,
      candidatura.fecha,
      candidatura.fecha_actualizacion,
      candidatura.salario_anual,
      candidatura.franja_salarial,
      candidatura.tipo_trabajo,
      candidatura.ubicacion,
      candidatura.feedback,
      candidatura.notas,
    ].map(escapeCsv).join(',')));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateLabel = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.setAttribute('download', `linkout-candidaturas-${dateLabel}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const goToCreate = () => navigate('/candidaturas/create');
  const goToStats = () => navigate('/candidaturas/estadisticas');
  const goToRetos = (candidatura) => navigate('/retos/fisico', { state: { candidatura } });
  const openDetail = (title, text) => setDetailModal({ show: true, title, text });
  const closeDetail = () => setDetailModal({ show: false, title: '', text: '' });

  const handleSaveView = async () => {
    const { value: name } = await Swal.fire({
      ...swalInfo('Guardar vista', 'Pon un nombre a esta combinación de filtros.'),
      input: 'text',
      inputPlaceholder: 'Ej: Seguimiento LinkedIn',
      inputAttributes: { maxlength: 40 },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563eb',
    });

    if (!name) return;

    const { error, views } = createSavedView(name, {
      filtroEstado,
      filtroOrigen,
      filtroSeguimiento,
      filtroRecientes,
      searchQuery,
    }, savedViews);

    if (error === 'empty') {
      await Swal.fire(swalError('Nombre vacío', 'Introduce un nombre para la vista.'));
      return;
    }

    if (error === 'duplicate') {
      await Swal.fire(swalError('Nombre duplicado', 'Ya tienes una vista con ese nombre.'));
      return;
    }

    persistSavedViews(views);
    setSavedViews(views);
    await Swal.fire(swalSuccess('Vista guardada', `"${name.trim()}" ya está disponible.`, {
      timer: 1400,
      showConfirmButton: false,
    }));
  };

  const handleApplyView = (view) => {
    setFiltroEstado(view.filtroEstado || '');
    setFiltroOrigen(view.filtroOrigen || '');
    setFiltroSeguimiento(Boolean(view.filtroSeguimiento));
    setFiltroRecientes(Boolean(view.filtroRecientes));
    setSearchQuery(view.searchQuery || '');
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setFiltroEstado('');
    setFiltroOrigen('');
    setFiltroSeguimiento(false);
    setFiltroRecientes(false);
    setSearchQuery('');
    setCurrentPage(0);
  };

  const handleFilterEstadoFromStats = (estado) => {
    setFiltroEstado(estado || '');
    setFiltroSeguimiento(false);
    setFiltroRecientes(false);
    setCurrentPage(0);
  };

  const handleDeleteView = async (viewId) => {
    const view = savedViews.find((item) => item.id === viewId);
    const result = await Swal.fire(swalWarning(
      '¿Eliminar vista?',
      `Se borrará la vista "${view?.name || ''}".`,
      { confirmButtonText: 'Sí, eliminar', confirmButtonColor: '#ef4444' },
    ));

    if (!result.isConfirmed) return;

    const nextViews = removeSavedView(viewId, savedViews);
    persistSavedViews(nextViews);
    setSavedViews(nextViews);
  };

  if (authLoading) return <PageLoader message="Cargando tus candidaturas..." />;
  if (!user) return null;

  return (
    <Layout user={user} onLogout={logout}>
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-neutral-900 px-4 sm:px-6 py-8 pb-24 sm:pb-8 relative">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-2 tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">Mi Diario de Candidaturas</h1>
        <div className="text-gray-400 text-center mb-8 text-lg">Seguimiento completo de todos tus procesos de selección.</div>
        
        {/* Contador y estadísticas */}
        {!loading && candidaturas.length > 0 && (
          <CandidaturasStats
            candidaturas={candidaturas}
            followUpCount={followUpsPendientes.length}
            onFilterEstado={handleFilterEstadoFromStats}
            onShowFollowUps={() => {
              setFiltroSeguimiento(true);
              setFiltroEstado('');
              setCurrentPage(0);
            }}
          />
        )}
        {!loading && followUpsPendientes.length > 0 && (
          <div className="w-full max-w-6xl mx-auto mb-6 rounded-2xl border border-yellow-500/40 bg-yellow-500/10 p-4 sm:p-5 shadow-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-wide text-yellow-300">Atención recomendada</div>
                <p className="mt-1 text-base sm:text-lg font-semibold text-white">
                  Tienes {followUpsPendientes.length} proceso{followUpsPendientes.length === 1 ? '' : 's'} sin cambios recientes.
                </p>
                <p className="mt-1 text-sm text-yellow-100/80">
                  Revisa especialmente: {followUpsPendientes.slice(0, 3).map((candidatura) => `${candidatura.empresa} (${candidatura.puesto})`).join(', ')}
                  {followUpsPendientes.length > 3 ? '...' : ''}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFiltroSeguimiento(true);
                    setFiltroEstado('');
                    setFiltroRecientes(false);
                    setFiltroOrigen('');
                    setSearchQuery('');
                    setCurrentPage(0);
                  }}
                  className="rounded-full bg-yellow-400 px-5 py-3 text-sm font-bold text-neutral-900 shadow-lg transition hover:bg-yellow-300"
                >
                  Ver pendientes
                </button>
                <button
                  type="button"
                  onClick={goToCreate}
                  className="rounded-full bg-neutral-800 border border-yellow-500/50 px-5 py-3 text-sm font-bold text-yellow-100 shadow-lg transition hover:bg-neutral-700"
                >
                  Añadir candidatura
                </button>
              </div>
            </div>
          </div>
        )}
        <CandidaturasFilters
          estados={[ESTADOS[0], FILTRO_EN_PROCESO, ...ESTADOS.slice(1)]}
          origenes={ORIGENES}
          filtroEstado={filtroEstado}
          filtroOrigen={filtroOrigen}
          filtroSeguimiento={filtroSeguimiento}
          filtroRecientes={filtroRecientes}
          followUpCount={followUpsPendientes.length}
          searchQuery={searchQuery}
          resultCount={candidaturasOrdenadas.length}
          hasActiveFilters={filtersActive}
          savedViews={savedViews}
          onSaveView={handleSaveView}
          onApplyView={handleApplyView}
          onDeleteView={handleDeleteView}
          onClearFilters={handleClearFilters}
          onSelectEstado={(value) => {
            setFiltroEstado(value);
            setCurrentPage(0);
          }}
          onSelectOrigen={(value) => {
            setFiltroOrigen(value);
            setCurrentPage(0);
          }}
          onToggleSeguimiento={() => {
            setFiltroSeguimiento((v) => !v);
            setCurrentPage(0);
          }}
          onToggleRecientes={() => {
            setFiltroRecientes((v) => !v);
            setCurrentPage(0);
          }}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(0);
          }}
          onOpenStats={goToStats}
          onExport={exportToCsv}
        />
        <div className="backdrop-blur-md bg-neutral-900/80 rounded-2xl shadow-2xl border border-neutral-700 w-full max-w-6xl mx-auto p-3 sm:p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neutral-700 border-t-pink-500" />
              <div className="text-lg text-gray-300 font-bold mb-2">Cargando...</div>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-lg text-red-300 font-bold mb-4">{loadError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4 mb-8 sm:hidden">
                <CandidaturasMobileList
                  candidaturas={paginatedCandidaturas}
                  onCreate={goToCreate}
                  onOpenFeedback={(text) => openDetail('Feedback del reclutador', text)}
                  onOpenNotas={(text) => openDetail('Notas personales', text)}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  onDuplicate={handleDuplicateClick}
                  onGoToRetos={goToRetos}
                  onStatusChange={handleStatusChange}
                  statusUpdatingId={statusUpdatingId}
                  hasActiveFilters={filtersActive}
                  onClearFilters={handleClearFilters}
                />
              </div>

              <div className="hidden overflow-x-auto w-full max-w-6xl mx-auto mb-8 sm:block">
                <CandidaturasDesktopTable
                  candidaturas={paginatedCandidaturas}
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onSort={handleSort}
                  onCreate={goToCreate}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  onDuplicate={handleDuplicateClick}
                  onOpenFeedback={(text) => openDetail('Feedback del reclutador', text)}
                  onOpenNotas={(text) => openDetail('Notas personales', text)}
                  onGoToRetos={goToRetos}
                  onStatusChange={handleStatusChange}
                  statusUpdatingId={statusUpdatingId}
                  hasActiveFilters={filtersActive}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end w-full max-w-6xl mx-auto mt-2">
          <select value={pageSize} onChange={e => { setCurrentPage(0); setPageSize(Number(e.target.value)); }} className="px-2 py-1 rounded bg-neutral-800 text-gray-300 border border-neutral-700 text-sm">
            {[4, 10, 20, 50].map(n => <option key={n} value={n}>{n} por página</option>)}
          </select>
        </div>
        <ReactPaginate
          previousLabel={'‹'}
          nextLabel={'›'}
          breakLabel={'...'}
          pageCount={totalPages}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName="flex justify-center items-center gap-2 mt-6"
          pageClassName="text-lg px-4 py-2 rounded-full bg-neutral-800 text-pink-200 font-extrabold border border-pink-400 cursor-pointer"
          activeClassName="!bg-pink-600 !text-white !border-pink-600 z-10"
          previousClassName="text-lg px-3 py-2 rounded-full bg-neutral-800 text-blue-200 font-bold border border-blue-400 cursor-pointer"
          nextClassName="text-lg px-3 py-2 rounded-full bg-neutral-800 text-blue-200 font-bold border border-blue-400 cursor-pointer"
          disabledClassName="bg-neutral-800 text-gray-400 opacity-60 cursor-not-allowed"
          breakClassName="text-lg px-3 py-2 rounded-full bg-neutral-800 text-gray-300 font-bold border border-neutral-700"
          forcePage={currentPage}
        />
        {/* Botón flotante para crear candidatura (solo escritorio) */}
        <button
          onClick={goToCreate}
          className="hidden sm:flex fixed bottom-8 right-8 z-50 px-6 py-4 bg-blue-600 text-white rounded-full font-bold shadow-2xl text-lg items-center gap-2"
        >
          <PlusIcon className="w-6 h-6" />
          Crear candidatura
        </button>
        {/* Botón fijo en la parte inferior solo en móvil */}
        <div className="sm:hidden fixed bottom-0 left-0 w-full z-50 bg-neutral-900 border-t border-neutral-800 flex justify-center items-center py-3">
          <button
            onClick={goToCreate}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg text-base"
          >
            <PlusIcon className="w-6 h-6" />
            Crear candidatura
          </button>
        </div>
        {/* Botón volver al inicio (oculto en móvil) */}
        <div className="hidden sm:flex justify-center mt-8">
          <button
            onClick={() => navigate('/index')}
            className="bg-neutral-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg text-lg"
          >
            Volver al inicio
          </button>
        </div>
        {/* Modal feedback / notas */}
        {detailModal.show && (
          <Modal isOpen={detailModal.show} onClose={closeDetail}>
            <div className="text-lg text-white font-bold mb-2">{detailModal.title}</div>
            <div className="text-blue-200 text-base text-center whitespace-pre-line max-w-sm bg-neutral-800 p-4 rounded-lg border border-neutral-700">
              {detailModal.text}
            </div>
            <button onClick={closeDetail} className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-full font-bold shadow-lg text-base">
              Cerrar
            </button>
          </Modal>
        )}
      </div>
      <CandidaturaEditModal
        isOpen={modalOpen}
        candidatura={selectedCandidatura}
        onClose={() => setModalOpen(false)}
        onSaved={(updated) => setCandidaturas((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))}
        key={selectedCandidatura?.id || 'closed'}
      />
    </Layout>
  );
}
