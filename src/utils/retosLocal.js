const FACIL = [
  {
    ejercicio: 'Haz 30 jumping jacks y 20 sentadillas',
    alternativa: 'Camina a buen ritmo durante 12 minutos',
    motivacion: 'Activa el cuerpo y suelta tensión.',
  },
  {
    ejercicio: 'Haz 40 skipping en sitio y 15 flexiones de rodillas',
    alternativa: 'Estira cuello, hombros y espalda 8 minutos',
    motivacion: 'Un poco de movimiento ya cambia el día.',
  },
  {
    ejercicio: 'Haz 3 rondas de 20 sentadillas y 20 jumping jacks',
    alternativa: 'Sube y baja escaleras 8 minutos sin prisa',
    motivacion: 'Empieza suave y mantén la constancia.',
  },
];

const MEDIO = [
  {
    ejercicio: 'Haz 20 burpees y mantén plancha 45 segundos',
    alternativa: 'Haz 30 sentadillas y 30 jumping jacks',
    motivacion: 'Suda el estrés y recupera foco.',
  },
  {
    ejercicio: 'Haz 3 rondas: 15 flexiones, 20 zancadas y 30 mountain climbers',
    alternativa: 'Camina rápido 15 minutos + 20 sentadillas',
    motivacion: 'Tu energía vuelve cuando te mueves.',
  },
  {
    ejercicio: 'Haz 25 squats con salto y 40 segundos de plancha',
    alternativa: 'Haz 3 rondas de 15 sentadillas y 20 jumping jacks',
    motivacion: 'Un reto medio también cuenta como victoria.',
  },
];

const DIFICIL = [
  {
    ejercicio: 'Haz 40 mountain climbers, 25 flexiones y 90 segundos de plancha',
    alternativa: 'Haz 20 burpees y 60 segundos de plancha',
    motivacion: 'Supera el límite un poco más hoy.',
  },
  {
    ejercicio: 'Haz 4 rondas: 10 burpees, 15 flexiones y 20 sentadillas con salto',
    alternativa: 'Haz 3 rondas: 10 burpees y 30 jumping jacks',
    motivacion: 'La búsqueda también se entrena con cuerpo y mente.',
  },
  {
    ejercicio: 'Haz 50 jumping jacks, 30 zancadas y 2 minutos de plancha en total',
    alternativa: 'Haz 25 burpees y 40 segundos de plancha',
    motivacion: 'Hoy demuestras que puedes con más de lo que crees.',
  },
];

function hashSeed(value) {
  const text = String(value || '');
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pick(list, seed) {
  return list[seed % list.length];
}

/**
 * Genera 3 retos físicos locales (sin API), personalizados con puesto/empresa.
 */
export function generateLocalRetos({ puesto = '', empresa = '', salt = 0 } = {}) {
  const seed = hashSeed(`${puesto}|${empresa}|${salt}`);
  const facil = pick(FACIL, seed);
  const medio = pick(MEDIO, seed + 1);
  const dificil = pick(DIFICIL, seed + 2);

  const contexto = [puesto, empresa].filter(Boolean).join(' en ');
  const cierre = contexto
    ? ` Ideal para soltar tensión tras el proceso de ${contexto}.`
    : ' Ideal para soltar tensión de la búsqueda de empleo.';

  return [
    {
      nivel: 'Fácil',
      ejercicio: facil.ejercicio,
      alternativa: facil.alternativa,
      motivacion: `${facil.motivacion}${cierre}`,
      puntos: 10,
      emoji: '🟢',
    },
    {
      nivel: 'Medio',
      ejercicio: medio.ejercicio,
      alternativa: medio.alternativa,
      motivacion: `${medio.motivacion}${cierre}`,
      puntos: 20,
      emoji: '🟡',
    },
    {
      nivel: 'Difícil',
      ejercicio: dificil.ejercicio,
      alternativa: dificil.alternativa,
      motivacion: `${dificil.motivacion}${cierre}`,
      puntos: 30,
      emoji: '🔴',
    },
  ];
}
