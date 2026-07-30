export const ANIMO_ROLES = [
  { value: 'madre', label: 'Madre', emoji: '👩‍❤️‍👦', bgColor: 'from-rose-500 to-pink-500' },
  { value: 'hermano', label: 'Hermano/a', emoji: '🧑‍🤝‍🧑', bgColor: 'from-sky-500 to-blue-500' },
  { value: 'mejor_amigo', label: 'Mejor amigo/a', emoji: '🤝', bgColor: 'from-cyan-500 to-teal-500' },
  { value: 'motivador', label: 'Motivador profesional', emoji: '💼', bgColor: 'from-indigo-500 to-violet-500' },
  { value: 'psicologo', label: 'Psicólogo', emoji: '🧠', bgColor: 'from-emerald-500 to-teal-500' },
  { value: 'companero', label: 'Compañero de trabajo', emoji: '☕', bgColor: 'from-amber-500 to-orange-500' },
  { value: 'futuro', label: 'Tú del futuro', emoji: '🚀', bgColor: 'from-blue-500 to-purple-500' },
  { value: 'goku', label: 'Goku (Dragon Ball)', emoji: '⚡', bgColor: 'from-orange-500 to-red-500' },
  { value: 'naruto', label: 'Naruto Uzumaki', emoji: '🍥', bgColor: 'from-yellow-500 to-orange-500' },
  { value: 'luffy', label: 'Monkey D. Luffy (One Piece)', emoji: '🏴‍☠️', bgColor: 'from-red-500 to-pink-500' },
  { value: 'asta', label: 'Asta (Black Clover)', emoji: '🗡️', bgColor: 'from-green-500 to-emerald-500' },
  { value: 'deku', label: 'Deku (My Hero Academia)', emoji: '🦸', bgColor: 'from-green-500 to-lime-500' },
  { value: 'tanjiro', label: 'Tanjiro (Demon Slayer)', emoji: '🌊', bgColor: 'from-red-500 to-orange-500' },
  { value: 'itadori', label: 'Itadori (Jujutsu Kaisen)', emoji: '👊', bgColor: 'from-pink-500 to-rose-500' },
  { value: 'gojo', label: 'Gojo (Jujutsu Kaisen)', emoji: '👁️', bgColor: 'from-purple-500 to-indigo-500' },
];

const ROLE_BY_VALUE = Object.fromEntries(ANIMO_ROLES.map((role) => [role.value, role]));

export function getAnimoRole(rol) {
  return ROLE_BY_VALUE[rol] || ROLE_BY_VALUE.motivador;
}

const TEMPLATES = {
  madre: [
    '{nombre}, te veo esforzándote y eso ya es muchísimo. Lo que escribiste tiene sentido: “{eco}”. Descansa un momento y sigue con un paso pequeño, pero firme. Estoy orgullosa de ti.',
    'Cariño {nombre}, no hace falta hacerlo todo hoy. Has puesto en palabras algo importante: “{eco}”. Respira, cuídate y mañana vuelves a intentarlo. Yo confío en ti.',
  ],
  hermano: [
    'Oye {nombre}, esto que cuentas —“{eco}”— es real, pero no te define. Hoy toca seguir aunque sea a medias. Tú puedes, y si te caes, te levantas. Ya está.',
    '{nombre}, no estás solo en esto. Lo de “{eco}” pesa, sí, pero también demuestra que te importa. Un paso más y seguimos. Vamos.',
  ],
  mejor_amigo: [
    '{nombre}, te entiendo. Eso de “{eco}” es duro, pero no estás solo. Hoy no tienes que ser perfecto: solo seguir. Yo creo en ti, de verdad.',
    'Amigo/a {nombre}: lo que has escrito (“{eco}”) se siente pesado, pero también es valiente. Vamos a por el siguiente paso juntos. Tú puedes.',
  ],
  motivador: [
    '{nombre}, lo que describes —“{eco}”— es parte del proceso, no el final. Elige una acción concreta hoy: enviar una candidatura, preparar una entrevista o revisar tu CV. El avance gana a la duda.',
    'Coach mode on, {nombre}: “{eco}” no te frena si respondes con acción. Un objetivo claro, 25 minutos de foco y cierre. Así se construye constancia.',
  ],
  psicologo: [
    '{nombre}, es válido sentir lo que describes: “{eco}”. Nombrar la emoción ya es un avance. Después, elige un gesto pequeño de cuidado o de progreso. No tienes que resolverlo todo de golpe.',
    'Lo que escribiste (“{eco}”) merece atención, {nombre}. Valida cómo te sientes y, si puedes, separa lo que controlas de lo que no. Un paso amable también cuenta.',
  ],
  companero: [
    '{nombre}, en búsqueda de empleo todos pasamos por días como este. Eso de “{eco}” es normal. Hoy: una tarea útil y punto. Mañana seguimos. Ánimo.',
    'Compañero {nombre}: “{eco}” suena a agotamiento, no a fracaso. Prioriza una cosa y deja el resto. El progreso silencioso también suma.',
  ],
  futuro: [
    '{nombre}, soy tú del futuro. Ese momento de “{eco}” lo recuerdo… y también recuerdo que seguiste. Confía: cada intento te acercó a donde estoy ahora.',
    'Desde aquí, {nombre}, te digo que “{eco}” no fue el final. Fue un capítulo. Sigue aplicando, sigue aprendiendo. Ya verás que valió la pena.',
  ],
  goku: [
    '¡{nombre}! Eso de “{eco}” es solo otro entrenamiento. ¡Kamehameha de motivación! Entrena hoy un poco más y supera tu límite. ¡Nunca te rindas!',
    '{nombre}, ¡el poder está en no parar! Si “{eco}” te pesa, conviértelo en energía. Un paso más y te haces más fuerte. ¡Vamos!',
  ],
  naruto: [
    '{nombre}, ¡dattebayo! “{eco}” no te quita el sueño. Los ninjas también fallan… y vuelven. Cree en ti y da el siguiente paso. ¡Nunca te rindas!',
    'Oye {nombre}: si sientes “{eco}”, recuerda tu camino. Con perseverancia se llega. Hoy un intento más. ¡Tú puedes!',
  ],
  luffy: [
    '{nombre}, ¡la libertad también es seguir buscando! Eso de “{eco}” no te ata. Avanza hacia tu meta como quien busca el One Piece. ¡Yo creo en ti!',
    '¡{nombre}! Si “{eco}” te frena, remamos igual. Los piratas no paran por una tormenta. ¡Siguiente isla, siguiente candidatura!',
  ],
  asta: [
    '{nombre}, mi magia es no rendirme… y la tuya también. “{eco}” duele, pero el trabajo duro gana. Hoy entrenas un poco más. ¡Nunca te rindas!',
    '{nombre}: si no tienes “magia” hoy, usa constancia. Ante “{eco}”, responde con esfuerzo. Ese es tu poder.',
  ],
  deku: [
    '{nombre}, ¡Plus Ultra! “{eco}” es miedo o cansancio, no tu destino. Analiza un paso y levántate. Un verdadero héroe sigue intentándolo.',
    '{nombre}, incluso cuando duele (“{eco}”), puedes crecer. Elige una acción heroica pequeña hoy. ¡Tú eres capaz!',
  ],
  tanjiro: [
    '{nombre}, respira. Eso de “{eco}” es duro, pero la esperanza no se apaga. Protege tu energía y sigue con calma y firmeza. Puedes con esto.',
    '{nombre}: “{eco}” no te hace débil. Te hace humano. Con compasión hacia ti mismo, da el siguiente paso. Yo confío en ti.',
  ],
  itadori: [
    '{nombre}, no te rindes fácil… ¡y yo tampoco! Si sientes “{eco}”, convierte eso en ganas de proteger tu futuro. Un paso más. ¡Vamos!',
    '{nombre}: “{eco}” pesa, pero tú cargas con más fuerza. Hoy eliges seguir. Eso ya es victoria.',
  ],
  gojo: [
    '{nombre}, confía: eres más fuerte de lo que crees. “{eco}” es un desafío, no un muro. Actúa con seguridad y supera el límite. ¡Tú mandas aquí!',
    '{nombre}: el miedo a “{eco}” se reduce cuando demuestras poder… con acción. Un movimiento claro hoy. Sé el más fuerte de tu proceso.',
  ],
};

const DEFAULT_TEMPLATES = [
  '{nombre}, lo que compartes (“{eco}”) importa. Tómate un respiro y elige un siguiente paso pequeño. Estás más cerca de lo que parece.',
  '{nombre}: “{eco}” no es el final. Es información. Usa esa energía para una acción concreta hoy. Tú puedes.',
];

function pickTemplate(templates, seed) {
  if (!templates.length) return DEFAULT_TEMPLATES[0];
  const index = Math.abs(seed) % templates.length;
  return templates[index];
}

function hashSeed(value) {
  const text = String(value || '');
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function extractEco(texto, maxLength = 90) {
  const clean = (texto || '').replace(/\s+/g, ' ').trim();
  if (!clean) return 'esta etapa de búsqueda';
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trim()}…`;
}

/**
 * Genera un mensaje de ánimo local (sin API) según rol, nombre y texto del desahogo.
 */
export function generateLocalAnimo({ texto, rol = 'motivador', nombre = 'tú', salt = 0 } = {}) {
  const safeName = (nombre || 'tú').toString().trim() || 'tú';
  const eco = extractEco(texto);
  const templates = TEMPLATES[rol] || DEFAULT_TEMPLATES;
  const seed = hashSeed(`${rol}|${eco}|${salt}`);
  const template = pickTemplate(templates, seed);

  return template
    .replaceAll('{nombre}', safeName)
    .replaceAll('{eco}', eco);
}

export function listAnimoRoles() {
  return ANIMO_ROLES.map((role) => role.value);
}
