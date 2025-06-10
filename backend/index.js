import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Helper para construir el prompt según el rol
function construirPrompt(texto, rol, nombre) {
  let nombreTexto = nombre ? `para ${nombre}` : '';
  switch (rol) {
    case 'madre':
      return `Responde con el tono de una madre cariñosa y protectora ${nombreTexto}. Da un consejo motivador y autoconclusivo, animando a avanzar. No pidas más información ni dejes la conversación abierta. Mensaje del usuario: "${texto}"`;
    case 'hermano':
      return `Responde como un hermano o hermana cercano, divertido y animando ${nombreTexto}. Da un consejo motivador y autoconclusivo, animando a avanzar. No pidas más información ni dejes la conversación abierta. Mensaje del usuario: "${texto}"`;
    case 'mejor_amigo':
      return `Responde como el mejor amigo/a, empático y positivo ${nombreTexto}. Da un consejo motivador y autoconclusivo, animando a avanzar. No pidas más información ni dejes la conversación abierta. Mensaje del usuario: "${texto}"`;
    case 'motivador':
      return `Responde como un coach motivacional profesional ${nombreTexto}, con frases potentes y motivadoras. Da un consejo motivador y autoconclusivo, animando a avanzar. No pidas más información ni dejes la conversación abierta. Mensaje del usuario: "${texto}"`;
    case 'psicologo':
      return `Responde como un psicólogo sereno, racional y validando emociones ${nombreTexto}. Da un consejo motivador y autoconclusivo, animando a avanzar. No pidas más información ni dejes la conversación abierta. Mensaje del usuario: "${texto}"`;
    case 'companero':
      return `Responde como un compañero de trabajo práctico y animando a seguir adelante ${nombreTexto}. Da un consejo motivador y autoconclusivo, animando a avanzar. No pidas más información ni dejes la conversación abierta. Mensaje del usuario: "${texto}"`;
    case 'futuro':
      return `Responde como el "yo del futuro" del usuario ${nombreTexto}, optimista y con visión a largo plazo. Da un consejo motivador y autoconclusivo, animando a avanzar. No pidas más información ni dejes la conversación abierta. Mensaje del usuario: "${texto}"`;
    default:
      return `Da un mensaje de ánimo motivador ${nombreTexto}, autoconclusivo y con consejo claro para avanzar. No pidas más información ni dejes la conversación abierta. Mensaje del usuario: "${texto}"`;
  }
}

// Endpoint para recibir texto y rol y devolver respuesta IA real
app.post('/api/animo', async (req, res) => {
  const { texto, rol, nombre } = req.body;
  const prompt = construirPrompt(texto, rol, nombre);
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );
    const respuesta = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo generar una respuesta.';
    res.json({ respuesta });
  } catch (error) {
    console.error('Error llamando a Gemini:', error.response?.data || error.message, error);
    res.status(500).json({ respuesta: 'Error al obtener respuesta de la IA.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
}); 