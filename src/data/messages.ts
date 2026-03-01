// Voice message banks for AliciaApp
// All messages in Chilean Spanish, warm and encouraging for a 7-year-old

export const greetings = [
  '¡Hola, Alicia! ¡Qué bueno que volviste! ¿Lista para una aventura?',
  '¡Bienvenida de vuelta, Alicia! Tus amigos del bosque te estaban esperando.',
  '¡Alicia! ¡Llegaste justo a tiempo! Hay un animal que necesita tu ayuda.',
  '¡Hola, campeona de las matemáticas! ¿Vamos a jugar?',
  '¡Qué lindo verte, Alicia! El bosque de Chiloé te necesita hoy.',
  '¡Alicia, qué alegría! Hoy va a ser un día increíble en el bosque.',
  '¡Hola, hola! Los animales de Chiloé te mandan saludos. ¿Empezamos?',
];

export const celebrations = [
  '¡Excelente, Alicia! ¡{animalName} está saltando de alegría!',
  '¡Muy bien! ¡Lo hiciste perfecto! {animalName} te aplaude con sus patitas.',
  '¡Bravo, Alicia! ¡Eres una genia de los números! {animalName} está feliz.',
  '¡Sííí! ¡Correcto! {animalName} hace un baile de la victoria.',
  '¡Increíble! ¡Lo lograste! {animalName} te manda un abrazo enorme.',
  '¡Eso es! ¡Respuesta correcta! {animalName} no puede creer lo inteligente que eres.',
  '¡Wooow, Alicia! ¡Eres imparable! {animalName} te celebra.',
  '¡Genial! ¡Otra vez lo hiciste bien! {animalName} está súper orgulloso de ti.',
  '¡Perfectoooo! {animalName} sabía que lo ibas a lograr.',
  '¡Así se hace, Alicia! ¡Eres la mejor amiga que {animalName} puede tener!',
];

export const encouragements = [
  '¡Casi, Alicia! No te preocupes, intentemos de nuevo. ¡Tú puedes!',
  'Mmm, esa no era. ¡Pero estás súper cerca! Vamos otra vez.',
  'No pasa nada, Alicia. Los errores nos ayudan a aprender. ¡Dale de nuevo!',
  '¡Uy, esa era difícil! Piénsalo con calma, no hay apuro.',
  'Esa no era la respuesta, pero ¡sigue intentando! Cada intento te acerca más.',
  'Tranquila, Alicia. Hasta los grandes matemáticos se equivocan. ¡Otra vez!',
  '¡No te rindas! Sé que puedes encontrar la respuesta correcta.',
];

export const hintTemplates = {
  level1: [
    'Pista: intenta usar tus deditos para contar.',
    'Pista: empieza desde el número más grande y cuenta desde ahí.',
    'Pista: piensa en cuántas cosas tienes si juntas los dos grupos.',
    'Pista: puedes dibujar bolitas en tu mente para contar.',
  ],
  level2: [
    'Pista: primero mira las unidades (el número de la derecha).',
    'Pista: separa el número en decenas y unidades. ¡Así es más fácil!',
    'Pista: recuerda que 10 unidades forman 1 decena.',
    'Pista: intenta resolver primero las unidades y después las decenas.',
  ],
  level3: [
    'Pista: cuando las unidades suman más de 9, ¡tienes que llevar una decena!',
    'Pista: si necesitas restar y el número de arriba es más chico, pide prestado a la decena.',
    'Pista: escribe los números uno debajo del otro para no confundirte.',
    'Pista: empieza siempre por la derecha: primero unidades, luego decenas.',
  ],
  level4: [
    'Mira bien: la respuesta está entre {min} y {max}.',
    'Pista grande: el resultado de {operation} es {nearAnswer}... ¡estás cerquita!',
    'Intenta paso a paso: primero las unidades, después las decenas, y si hay centenas, al final.',
    'Acuérdate: si no te alcanza para restar, le pides prestado al vecino de la izquierda.',
  ],
};

export const stageCompletionMessages = [
  '¡Terminaste esta etapa, Alicia! ¡Eres increíble! ¿Quieres saber algo genial sobre tu amigo?',
  '¡Etapa completada! ¡Lo hiciste excelente! Te ganaste un dato curioso.',
  '¡Bravo, Alicia! ¡Otra etapa superada! Descubre algo nuevo sobre tu amigo del bosque.',
  '¡Sí, sí, sí! ¡Pasaste la etapa! Tu amigo tiene algo que contarte...',
  '¡Impresionante, Alicia! ¡No hay etapa que se te resista! Mira lo que descubriste.',
];

export const chapterCompletionMessages = [
  '¡Lo lograste, Alicia! ¡Completaste todo el capítulo! ¡{animalName} está a salvo gracias a ti!',
  '¡INCREÍBLE! ¡Terminaste el capítulo de {animalName}! ¡Eres una heroína del bosque de Chiloé!',
  '¡Wow, Alicia! ¡{animalName} nunca olvidará tu ayuda! ¡Capítulo completado!',
  '¡Felicitaciones enormes, Alicia! Salvaste a {animalName} y aprendiste un montón. ¡Eres genial!',
];

export const streakMessages = {
  day2: '¡Llevas 2 días seguidos jugando! ¡Sigue así, campeona!',
  day3: '¡3 días seguidos! ¡Los animales de Chiloé te esperan cada día!',
  day5: '¡5 días seguidos! ¡Eres la mejor amiga del bosque!',
  day7: '¡Una semana entera, Alicia! ¡Eso es de campeonas de verdad!',
  day14: '¡2 semanas sin parar! ¡Eres una leyenda de las matemáticas!',
  day30: '¡Un mes entero jugando! ¡Alicia, eres la protectora número uno de los animales de Chiloé!',
};

export const sessionTimeWarnings = [
  '¡Alicia, llevas un buen rato jugando! Quizás es hora de descansar los ojitos.',
  'Has jugado mucho hoy, ¡y lo has hecho genial! ¿Qué tal si descansamos un poquito?',
  'Los animales del bosque también necesitan dormir. ¡Mañana seguimos con la aventura!',
];

export const returnMessages = [
  '¡{animalName} te extrañó mucho! ¡Qué bueno que volviste!',
  '¡Alicia volvió! {animalName} estaba esperándote para seguir la aventura.',
  '¡Hola de nuevo! {animalName} guardó tu lugar. ¿Seguimos donde quedamos?',
];

// Utility to replace placeholders in messages
export const formatMessage = (
  message: string,
  replacements: Record<string, string>
): string => {
  let result = message;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
};

// Get a random message from an array
export const getRandomMessage = (messages: string[]): string =>
  messages[Math.floor(Math.random() * messages.length)];
