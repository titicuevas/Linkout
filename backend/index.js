/* eslint-env node */
/* global process */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const app = express();
app.use(cors({
  origin: 'https://linkout.up.railway.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.options('*', cors());
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
    case 'goku':
      return `Responde como Goku de Dragon Ball ${nombreTexto}, con su espíritu de lucha inquebrantable, optimismo y determinación. Usa frases como "¡Kamehameha de motivación!" o "¡El poder de la superación está en ti!". Habla de entrenamiento, superación de límites y nunca rendirse. Da un consejo motivador y autoconclusivo, animando a avanzar. No pidas más información ni dejes la conversación abierta. Mensaje del usuario: "${texto}"`;
    case 'naruto':
      return `Responde como Naruto Uzumaki ${nombreTexto}, con su determinación, perseverancia y creencia en los sueños. Usa frases como "¡Dattebayo!" o "¡Nunca me rindo!". Habla de creer en uno mismo, superar obstáculos y nunca abandonar los sueños. Da un consejo motivador y autoconclusivo, animando a avanzar. No pidas más información ni dejes la conversación abierta. Mensaje del usuario: "${texto}"`;
    case 'luffy':
      return `Responde como Monkey D. Luffy de One Piece ${nombreTexto}, con su libertad, determinación y espíritu aventurero. Usa frases como "¡Soy el hombre que será el Rey de los Piratas!" o "¡La libertad es lo más importante!". Habla de perseguir sueños, libertad y nunca rendirse ante los obstáculos. Da un consejo motivador y autoconclusivo, animando a avanzar. No pidas más información ni dejes la conversación abierta. Mensaje del usuario: "${texto}"`;
    case 'asta':
      return `Responde como Asta de Black Clover ${nombreTexto}, con su determinación, trabajo duro y espíritu nunca rendirse. Usa frases como "¡Nunca me rindo!" o "¡Mi magia es nunca rendirme!". Habla de superar limitaciones, trabajo duro y creer en uno mismo a pesar de las dificultades. Da un consejo motivador y autoconclusivo, animando a avanzar. No pidas más información ni dejes la conversación abierta. Mensaje del usuario: "${texto}"`;
    case 'deku':
      return `Responde como Izuku Midoriya (Deku) de My Hero Academia ${nombreTexto}, con su determinación, análisis y espíritu de héroe. Usa frases como "¡Plus Ultra!" o "¡Un verdadero héroe siempre se levanta!". Habla de superar miedos, crecer a través de la adversidad y nunca dejar de luchar por los sueños. Da un consejo motivador y autoconclusivo, animando a avanzar. No pidas más información ni dejes la conversación abierta. Mensaje del usuario: "${texto}"`;
    case 'tanjiro':
      return `Responde como Tanjiro Kamado de Demon Slayer ${nombreTexto}, con su compasión, determinación y espíritu protector. Usa frases como "¡Respiración de agua!" o "¡Protegeré a todos!". Habla de perseverancia, compasión y nunca perder la esperanza incluso en los momentos más oscuros. Da un consejo motivador y autoconclusivo, animando a avanzar. No pidas más información ni dejes la conversación abierta. Mensaje del usuario: "${texto}"`;
    case 'itadori':
      return `Responde como Yuji Itadori de Jujutsu Kaisen ${nombreTexto}, con su optimismo, determinación y espíritu de proteger a otros. Usa frases como "¡Voy a salvar a todos!" o "¡No me rindo fácilmente!". Habla de responsabilidad, determinación y encontrar fuerza en los momentos difíciles. Da un consejo motivador y autoconclusivo, animando a avanzar. No pidas más información ni dejes la conversación abierta. Mensaje del usuario: "${texto}"`;
    case 'gojo':
      return `Responde como Satoru Gojo de Jujutsu Kaisen ${nombreTexto}, con su confianza, poder y filosofía de ser el más fuerte. Usa frases como "¡Soy el más fuerte!" o "¡El poder absoluto!". Habla de confianza en uno mismo, superar límites y no temer a los desafíos. Da un consejo motivador y autoconclusivo, animando a avanzar. No pidas más información ni dejes la conversación abierta. Mensaje del usuario: "${texto}"`;
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
      },
      { timeout: 15000 } // 15 segundos de timeout
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
  const { puesto, empresa } = req.body; // niveles eliminado porque no se usa
  try {
    const prompt = `Responde SOLO con un JSON válido. Genera tres retos físicos realmente exigentes para alguien que está gestionando su búsqueda de empleo para el puesto de ${puesto} en ${empresa}. Los retos deben ser intensos, de nivel superior a lo habitual, y ayudar a liberar tensión física y mental. Incluye ejercicios funcionales, HIIT, cardio, fuerza, combinaciones de movimientos, etc. Usa repeticiones, tiempos y dificultad que sean retadores incluso para alguien joven y sano. Ejemplos: burpees, sprints, sentadillas con salto, flexiones, mountain climbers, jumping jacks, planchas largas, etc. La alternativa debe ser más sencilla pero no trivial (por ejemplo, caminar rápido, sentadillas normales, jumping jacks suaves, etc.). Los retos deben ser: uno con nivel "Fácil", uno con nivel "Medio" y uno con nivel "Difícil". Cada reto debe tener exactamente estos campos: nivel ("Fácil", "Medio" o "Difícil"), ejercicio (explicado en una frase, y que sea diferente en cada nivel), alternativa (otro ejercicio físico real, diferente y más sencillo o adaptado), motivacion (frase motivadora corta) y puntos (10, 20, 30 según dificultad). No repitas el mismo tipo de ejercicio en los tres niveles ni en la alternativa. Responde solo con el JSON, sin texto adicional. Ejemplo de respuesta: { "retos": [ { "nivel": "Fácil", "ejercicio": "Haz 30 jumping jacks y 20 sentadillas", "alternativa": "Camina rápido durante 15 minutos", "motivacion": "¡Activa tu cuerpo y tu mente!", "puntos": 10 }, { "nivel": "Medio", "ejercicio": "Haz 20 burpees y mantén una plancha durante 1 minuto", "alternativa": "Haz 30 sentadillas y 30 jumping jacks", "motivacion": "¡Suda el estrés y sigue adelante!", "puntos": 20 }, { "nivel": "Difícil", "ejercicio": "Haz 50 mountain climbers, 30 flexiones y 2 minutos de plancha", "alternativa": "Haz 20 burpees y 1 minuto de plancha", "motivacion": "¡Supera tus límites, eres capaz de todo!", "puntos": 30 } ] }`;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      { timeout: 20000 } // 20 segundos de timeout
    );
    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Respuesta de Gemini:', text);
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

// Endpoint de test rápido
app.get('/api/animo', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
}); 