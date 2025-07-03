import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Index from './pages/Index';
import Welcome from './pages/Welcome';
import CandidaturasIndex from './pages/candidaturas/index';
import CrearCandidatura from './pages/candidaturas/create';
import Desahogate from './pages/desahogate/index';
import CrearDesahogo from './pages/desahogate/create';
import AnimoIAIndex from './pages/animoia/index';
import Fisico from './pages/retos/Fisico';

// Lazy load solo de páginas muy pesadas
const EstadisticasCandidaturas = lazy(() => import('./pages/candidaturas/Estadisticas'));

// Componente de carga
const LoadingSpinner = () => (
  <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-blue-400 font-semibold">Cargando estadísticas...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/index" element={<Index />} />
        <Route path="/candidaturas" element={<CandidaturasIndex />} />
        <Route path="/candidaturas/create" element={<CrearCandidatura />} />
        <Route path="/candidaturas/estadisticas" element={
          <Suspense fallback={<LoadingSpinner />}>
            <EstadisticasCandidaturas />
          </Suspense>
        } />
        <Route path="/desahogate" element={<Desahogate />} />
        <Route path="/desahogate/create" element={<CrearDesahogo />} />
        <Route path="/animoia" element={<AnimoIAIndex />} />
        <Route path="/retos/fisico" element={<Fisico />} />
        <Route path="/welcome" element={<Welcome />} />
      </Routes>
    </Router>
  );
}
