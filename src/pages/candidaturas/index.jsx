import React from 'react';
import Layout from '../../components/Layout';
import { AdjustmentsHorizontalIcon, BriefcaseIcon, ChartBarIcon, XMarkIcon } from '@heroicons/react/24/solid';

export default function CandidaturasIndex() {
  return (
    <Layout>
      <h1 className="text-3xl font-extrabold text-center mb-2">Mi Diario de Candidaturas</h1>
      <div className="flex gap-2 flex-wrap justify-center mb-4">
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs flex items-center">
          <AdjustmentsHorizontalIcon className="w-5 h-5 mr-1" /> Todos
        </button>
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs flex items-center">
          <BriefcaseIcon className="w-5 h-5 mr-1" /> Entrevista contacto
        </button>
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs flex items-center">
          <ChartBarIcon className="w-5 h-5 mr-1" /> Prueba técnica
        </button>
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs flex items-center">
          <ChartBarIcon className="w-5 h-5 mr-1" /> 2ª Entrevista
        </button>
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs flex items-center">
          <ChartBarIcon className="w-5 h-5 mr-1" /> Entrevista final
        </button>
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs flex items-center">
          <BriefcaseIcon className="w-5 h-5 mr-1" /> Contratación
        </button>
        <button className="px-3 py-2 rounded-full border-2 font-bold text-xs flex items-center">
          <XMarkIcon className="w-5 h-5 mr-1" /> No seleccionado
        </button>
      </div>
      <div>Test</div>
    </Layout>
  );
} 