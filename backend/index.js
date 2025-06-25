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

// Endpoint para retos físicos personalizados
app.post('/api/retos', async (req, res) => {
  const { puesto, empresa, niveles } = req.body;
  try {
    const prompt = `Responde SOLO con un JSON válido. Genera tres retos físicos variados para alguien que acaba de ser rechazado en una candidatura para el puesto de ${puesto} en ${empresa}. Los retos deben ser: uno con nivel "Fácil", uno con nivel "Medio" y uno con nivel "Difícil". Cada reto debe tener exactamente estos campos: nivel ("Fácil", "Medio" o "Difícil"), ejercicio (explicado en una frase, y que sea diferente en cada nivel: por ejemplo caminar, sentadillas, flexiones, saltos, estiramientos, yoga, etc.), alternativa (otro ejercicio físico real, diferente y más sencillo o adaptado, por ejemplo: si el ejercicio es "burpees", la alternativa puede ser "sentadillas" o "caminar rápido"), motivacion (frase motivadora corta) y puntos (10, 20, 30 según dificultad). No repitas el mismo tipo de ejercicio en los tres niveles ni en la alternativa. Responde solo con el JSON, sin texto adicional. Ejemplo de respuesta: { "retos": [ { "nivel": "Fácil", "ejercicio": "Haz una caminata de 10 minutos", "alternativa": "Haz 20 elevaciones de talones de pie", "motivacion": "Cada paso cuenta para avanzar", "puntos": 10 }, { "nivel": "Medio", "ejercicio": "Haz 20 sentadillas", "alternativa": "Haz 20 zancadas alternas", "motivacion": "La constancia te hace más fuerte", "puntos": 20 }, { "nivel": "Difícil", "ejercicio": "Haz 15 burpees", "alternativa": "Haz 30 jumping jacks", "motivacion": "Supera tus límites", "puntos": 30 } ] }`;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );
    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Respuesta de Gemini:', text); // LOG para debug
    let retos = [];
    let errorParseo = null;
    try {
      // 1. Buscar bloque JSON entre llaves
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          const clean = match[0].replace(/'/g, '"');
          retos = JSON.parse(clean).retos;
        } catch (e) {
          errorParseo = 'Error parseando JSON principal: ' + e.message;
        }
      } else {
        errorParseo = 'No se encontró bloque JSON en la respuesta de Gemini.';
      }
      // 2. Si sigue fallando, intentar parsear todo el texto como JSON
      if ((!retos || !Array.isArray(retos) || retos.length === 0) && text.trim().startsWith('{')) {
        try {
          const clean = text.replace(/'/g, '"');
          retos = JSON.parse(clean).retos;
        } catch (e) {
          errorParseo += ' | Error parseando todo el texto: ' + e.message;
        }
      }
      // 3. Si sigue fallando, buscar el primer array entre corchetes
      if ((!retos || !Array.isArray(retos) || retos.length === 0)) {
        const arrMatch = text.match(/\[.*\]/s);
        if (arrMatch) {
          try {
            retos = JSON.parse(arrMatch[0]);
          } catch (e) {
            errorParseo += ' | Error parseando array: ' + e.message;
          }
        }
      }
    } catch (e) {
      errorParseo += ' | Error general: ' + e.message;
    }
    // --- Normalización y tolerancia ---
    const nivelesEsperados = ['Fácil', 'Medio', 'Difícil'];
    if (Array.isArray(retos)) {
      retos = retos.map((reto, i) => ({
        nivel: reto.nivel || nivelesEsperados[i] || 'Fácil',
        ejercicio: reto.ejercicio || 'Haz una caminata de 10 minutos',
        alternativa: reto.alternativa || 'Haz estiramientos suaves si no puedes realizar el ejercicio principal',
        motivacion: reto.motivacion || '¡Recuerda que cada pequeño esfuerzo suma!',
        puntos: reto.puntos || (i === 0 ? 10 : i === 1 ? 20 : 30)
      }));
    }
    if (!retos || !Array.isArray(retos) || retos.length === 0) {
      console.error('No se pudieron extraer retos:', errorParseo);
      return res.status(500).json({ retos: [], error: 'La IA no devolvió retos válidos. Intenta de nuevo más tarde.' });
    }
    return res.json({ retos });
  } catch (error) {
    console.error('Error generando retos:', error.message, error.response?.data || '');
    let msg = 'Error generando retos. ';
    if (error.response?.data?.error?.message) {
      msg += error.response.data.error.message;
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      msg += 'No se pudo conectar con la API de Gemini.';
    } else if (error.message && error.message.includes('API key')) {
      msg += 'Clave de API incorrecta o no configurada.';
    }
    res.status(500).json({ retos: [], error: msg });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
}); 