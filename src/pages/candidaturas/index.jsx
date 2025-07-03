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
      <div>Test</div>
    </Layout>
  );
} 