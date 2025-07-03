import React, { useState } from 'react';
import Layout from '../../components/Layout';

export default function CandidaturasIndex() {
  // Estado para el modal de feedback
  const [showFeedback, setShowFeedback] = useState(false);

  // Handlers de botones (puedes conectar con tu lógica real)
  const handleEditar = () => alert('Editar candidatura');
  const handleBorrar = () => alert('Borrar candidatura');
  const handleFeedback = () => setShowFeedback(true);
  const handleCerrarFeedback = () => setShowFeedback(false);
  const handleCrear = () => alert('Crear candidatura');

  return (
    <Layout>
      <h1 className="text-4xl font-extrabold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">Mi Diario de Candidaturas</h1>
      <p className="text-center text-gray-300 mb-6 text-lg">Seguimiento completo de todos tus procesos de selección.</p>
      {/* Filtros de estado */}
      <div className="flex gap-2 flex-wrap justify-center mb-4">
        <button className="px-5 py-2 rounded-full font-bold text-base bg-pink-600 text-white shadow-md">Todos</button>
        <button className="px-5 py-2 rounded-full font-bold text-base border-2 border-pink-400 text-pink-400 bg-transparent">Entrevista contacto</button>
        <button className="px-5 py-2 rounded-full font-bold text-base border-2 border-pink-400 text-pink-400 bg-transparent">Prueba técnica</button>
        <button className="px-5 py-2 rounded-full font-bold text-base border-2 border-pink-400 text-pink-400 bg-transparent">2ª Entrevista</button>
        <button className="px-5 py-2 rounded-full font-bold text-base border-2 border-pink-400 text-pink-400 bg-transparent">Entrevista final</button>
        <button className="px-5 py-2 rounded-full font-bold text-base border-2 border-pink-400 text-pink-400 bg-transparent">Contratación</button>
        <button className="px-5 py-2 rounded-full font-bold text-base border-2 border-pink-400 text-pink-400 bg-transparent">No seleccionado</button>
      </div>
      {/* Filtros de origen */}
      <div className="flex gap-2 flex-wrap justify-center mb-4">
        <button className="px-5 py-2 rounded-full font-bold text-base bg-blue-600 text-white shadow-md">Todos</button>
        <button className="px-5 py-2 rounded-full font-bold text-base border-2 border-blue-400 text-blue-400 bg-transparent">LinkedIn</button>
        <button className="px-5 py-2 rounded-full font-bold text-base border-2 border-blue-400 text-blue-400 bg-transparent">InfoJobs</button>
        <button className="px-5 py-2 rounded-full font-bold text-base border-2 border-blue-400 text-blue-400 bg-transparent">Joppy</button>
        <button className="px-5 py-2 rounded-full font-bold text-base border-2 border-blue-400 text-blue-400 bg-transparent">Tecnoempleo</button>
        <button className="px-5 py-2 rounded-full font-bold text-base border-2 border-blue-400 text-blue-400 bg-transparent">Email</button>
        <button className="px-5 py-2 rounded-full font-bold text-base border-2 border-blue-400 text-blue-400 bg-transparent">Otros</button>
      </div>
      <div className="text-sm text-gray-400 text-center mb-4">Total: <span className="font-bold text-blue-300">3</span> candidaturas</div>
      <div className="overflow-x-auto w-full max-w-6xl mx-auto mb-8">
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
            <tr>
              <td className="px-8 py-4 whitespace-nowrap text-white font-medium text-lg">Desarrollador Backend</td>
              <td className="px-8 py-4 whitespace-nowrap text-gray-300 text-lg">Nttdata</td>
              <td className="px-8 py-4 whitespace-nowrap text-pink-400 font-bold">entrevista_final</td>
              <td className="px-8 py-4 whitespace-nowrap text-blue-400">linkedin</td>
              <td className="px-8 py-4 whitespace-nowrap text-gray-400">30/6/2025</td>
              <td className="px-8 py-4 whitespace-nowrap flex gap-2">
                <button onClick={handleEditar} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-bold text-xs">Editar</button>
                <button onClick={handleBorrar} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-bold text-xs">Borrar</button>
                <button onClick={handleFeedback} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded font-bold text-xs">Feedback</button>
              </td>
            </tr>
            <tr>
              <td className="px-8 py-4 whitespace-nowrap text-white font-medium text-lg">Desarrollador Front</td>
              <td className="px-8 py-4 whitespace-nowrap text-gray-300 text-lg">Squirrel Media</td>
              <td className="px-8 py-4 whitespace-nowrap text-pink-400 font-bold">entrevista_contacto</td>
              <td className="px-8 py-4 whitespace-nowrap text-blue-400">tecnoempleo</td>
              <td className="px-8 py-4 whitespace-nowrap text-gray-400">5/6/2025</td>
              <td className="px-8 py-4 whitespace-nowrap flex gap-2">
                <button onClick={handleEditar} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-bold text-xs">Editar</button>
                <button onClick={handleBorrar} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-bold text-xs">Borrar</button>
                <button onClick={handleFeedback} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded font-bold text-xs">Feedback</button>
              </td>
            </tr>
            <tr>
              <td className="px-8 py-4 whitespace-nowrap text-white font-medium text-lg">dffsdfsdf</td>
              <td className="px-8 py-4 whitespace-nowrap text-gray-300 text-lg">sdfsdfsdfsdf</td>
              <td className="px-8 py-4 whitespace-nowrap text-pink-400 font-bold">rechazado</td>
              <td className="px-8 py-4 whitespace-nowrap text-blue-400">correo_directo</td>
              <td className="px-8 py-4 whitespace-nowrap text-gray-400">3/6/2025</td>
              <td className="px-8 py-4 whitespace-nowrap flex gap-2">
                <button onClick={handleEditar} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-bold text-xs">Editar</button>
                <button onClick={handleBorrar} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-bold text-xs">Borrar</button>
                <button onClick={handleFeedback} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded font-bold text-xs">Feedback</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Paginación */}
      <div className="flex justify-center items-center gap-3 mt-8">
        <button className="text-lg px-4 py-3 rounded-full bg-neutral-800 hover:bg-blue-500 hover:text-white text-blue-200 font-bold border-2 border-blue-400 shadow-md transition-all duration-200 cursor-pointer">&lt; Anterior</button>
        <span className="text-lg font-bold text-pink-400">1</span>
        <button className="text-lg px-4 py-3 rounded-full bg-neutral-800 hover:bg-blue-500 hover:text-white text-blue-200 font-bold border-2 border-blue-400 shadow-md transition-all duration-200 cursor-pointer">Siguiente &gt;</button>
      </div>
      {/* Botón flotante para crear candidatura (solo escritorio) */}
      <button
        onClick={handleCrear}
        className="hidden sm:flex fixed bottom-8 right-8 z-50 px-8 py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-bold shadow-2xl text-lg transition-all animate-fade-in items-center gap-2"
      >
        + Añadir candidatura
      </button>
      {/* Botón fijo en la parte inferior solo en móvil */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full z-50 bg-neutral-900 border-t border-neutral-800 flex justify-center items-center py-3 animate-fade-in">
        <button
          onClick={handleCrear}
          className="flex items-center gap-2 px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-bold shadow-lg text-base transition-all"
        >
          + Añadir candidatura
        </button>
      </div>
      {/* Modal de feedback */}
      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-neutral-900 rounded-lg shadow-xl p-8 relative min-w-[320px] max-w-full max-h-[90vh] overflow-y-auto flex flex-col items-center gap-4">
            <div className="text-lg text-white font-bold mb-2">Feedback del reclutador</div>
            <div className="text-blue-200 text-base text-center whitespace-pre-line max-w-sm bg-neutral-800 p-4 rounded-lg border border-neutral-700">
              Ejemplo de feedback recibido del reclutador o comentarios de entrevista.
            </div>
            <button onClick={handleCerrarFeedback} className="mt-4 px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-bold shadow-lg text-base transition-all">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
} 