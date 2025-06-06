import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Index from './pages/Index';
import CandidaturasIndex from './pages/candidaturas/index';
import CrearCandidatura from './pages/candidaturas/create';

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
      </Routes>
    </Router>
  );
}
