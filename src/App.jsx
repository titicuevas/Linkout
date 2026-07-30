import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageLoader from './components/PageLoader';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Index = lazy(() => import('./pages/Index'));
const Welcome = lazy(() => import('./pages/Welcome'));
const CandidaturasIndex = lazy(() => import('./pages/candidaturas/index'));
const CrearCandidatura = lazy(() => import('./pages/candidaturas/create'));
const EstadisticasCandidaturas = lazy(() => import('./pages/candidaturas/Estadisticas'));
const Desahogate = lazy(() => import('./pages/desahogate/index'));
const CrearDesahogo = lazy(() => import('./pages/desahogate/create'));
const AnimoIAIndex = lazy(() => import('./pages/animoia/index'));
const Fisico = lazy(() => import('./pages/retos/Fisico'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader message="Cargando..." />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/index" element={<Index />} />
          <Route path="/candidaturas" element={<CandidaturasIndex />} />
          <Route path="/candidaturas/create" element={<CrearCandidatura />} />
          <Route path="/candidaturas/estadisticas" element={<EstadisticasCandidaturas />} />
          <Route path="/desahogate" element={<Desahogate />} />
          <Route path="/desahogate/create" element={<CrearDesahogo />} />
          <Route path="/animoia" element={<AnimoIAIndex />} />
          <Route path="/retos/fisico" element={<Fisico />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
