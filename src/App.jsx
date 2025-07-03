import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Index from './pages/Index';
import Welcome from './pages/Welcome';
import CandidaturasIndex from './pages/candidaturas/index';
import CrearCandidatura from './pages/candidaturas/create';
import EstadisticasCandidaturas from './pages/candidaturas/Estadisticas';
import Desahogate from './pages/desahogate/index';
import CrearDesahogo from './pages/desahogate/create';
import AnimoIAIndex from './pages/animoia/index';
import Fisico from './pages/retos/Fisico';

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
        <Route path="/candidaturas/estadisticas" element={<EstadisticasCandidaturas />} />
        <Route path="/desahogate" element={<Desahogate />} />
        <Route path="/desahogate/create" element={<CrearDesahogo />} />
        <Route path="/animoia" element={<AnimoIAIndex />} />
        <Route path="/retos/fisico" element={<Fisico />} />
        <Route path="/welcome" element={<Welcome />} />
      </Routes>
    </Router>
  );
}
