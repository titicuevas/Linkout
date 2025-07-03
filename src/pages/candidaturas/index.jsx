import React from 'react';
import Layout from '../../components/Layout';

export default function CandidaturasIndex() {
  return (
    <Layout>
      <h1 className="text-3xl font-extrabold text-center mb-2">Mi Diario de Candidaturas</h1>
      <div className="flex gap-2 flex-wrap justify-center mb-4">
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs">Todos</button>
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs">Entrevista contacto</button>
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs">Prueba técnica</button>
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs">2ª Entrevista</button>
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs">Entrevista final</button>
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs">Contratación</button>
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs">No seleccionado</button>
      </div>
      <div className="flex gap-2 flex-wrap justify-center mb-4">
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs">Todos</button>
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs">LinkedIn</button>
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs">InfoJobs</button>
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs">Joppy</button>
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs">Tecnoempleo</button>
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs">Email</button>
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs">Otros</button>
      </div>
      <div className="text-sm text-gray-400 text-center mb-4">Total: <span className="font-bold text-blue-300">0</span> candidaturas</div>
      <div className="overflow-x-auto w-full max-w-6xl mx-auto mb-8">
        <table className="min-w-full divide-y divide-gray-700 bg-neutral-900 rounded-xl shadow-xl">
          <thead>
            <tr>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Puesto</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Empresa</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Origen</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actualizada</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Salario</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Ubicación</th>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Feedback</th>
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
              <td className="px-8 py-4 whitespace-nowrap text-gray-400">30/6/2025</td>
              <td className="px-8 py-4 whitespace-nowrap text-pink-200 font-bold text-lg">30.000 €</td>
              <td className="px-8 py-4 whitespace-nowrap text-pink-200 font-bold text-lg">Remoto</td>
              <td className="px-8 py-4 whitespace-nowrap text-pink-200 font-bold text-lg">Madrid</td>
              <td className="px-8 py-4 whitespace-nowrap text-blue-200 text-lg text-center">Buen feedback</td>
              <td className="px-8 py-4 whitespace-nowrap flex gap-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-bold text-xs">Editar</button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-bold text-xs">Borrar</button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded font-bold text-xs">Feedback</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>Test</div>
    </Layout>
  );
} 