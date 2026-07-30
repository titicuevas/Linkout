import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://linkout.up.railway.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
}));
app.options('*', cors());
app.use(express.json());

/**
 * El frontend ya genera Motivación y Retos en local (sin Gemini).
 * Este backend queda como health-check opcional por compatibilidad/despliegue.
 */
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'linkout-backend',
    mode: 'local-features',
  });
});

app.get('/api/animo', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Motivación se genera en el frontend. Este endpoint ya no usa IA de pago.',
  });
});

app.post('/api/animo', (_req, res) => {
  res.status(410).json({
    respuesta: 'Este endpoint está desactivado. La motivación se genera en local en la app.',
  });
});

app.post('/api/retos', (_req, res) => {
  res.status(410).json({
    retos: [],
    error: 'Este endpoint está desactivado. Los retos se generan en local en la app.',
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
