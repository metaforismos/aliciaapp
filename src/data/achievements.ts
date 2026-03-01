import type { Achievement } from '../types/game';

// ─────────────────────────────────────────────
// Chapter completion badges
// ─────────────────────────────────────────────
export const chapterBadges: Achievement[] = [
  {
    id: 'badge-ch1-pudu',
    title: 'Amiga del Pudú',
    description: 'Ayudaste a Pascual a encontrar el camino a casa.',
  },
  {
    id: 'badge-ch2-bandurria',
    title: 'Reunidora de Bandurrias',
    description: 'Reuniste a Berta y Bruno después de la tormenta.',
  },
  {
    id: 'badge-ch3-zorro',
    title: 'Compañera del Zorrito',
    description: 'Ayudaste a Darwin a encontrar comida en el bosque.',
  },
  {
    id: 'badge-ch4-monito',
    title: 'Amiga del Monito',
    description: 'Ayudaste a Momo a alimentarse después de su larga siesta.',
  },
  {
    id: 'badge-ch5-guina',
    title: 'Protectora de la Güiña',
    description: 'Ayudaste a Luna a encontrar un hogar seguro en el bosque.',
  },
  {
    id: 'badge-ch6-chungungo',
    title: 'Heroína del Mar',
    description: 'Acompañaste a Neptuno en su gran aventura marina.',
  },
];

// ─────────────────────────────────────────────
// Paw milestones (currency achievements)
// ─────────────────────────────────────────────
export const pawMilestones: Achievement[] = [
  {
    id: 'paws-10',
    title: 'Primeras Huellas',
    description: '¡Ganaste tus primeras 10 patitas!',
  },
  {
    id: 'paws-50',
    title: 'Coleccionista de Huellas',
    description: '¡Juntaste 50 patitas!',
  },
  {
    id: 'paws-100',
    title: 'Cien Patitas',
    description: '¡Llegaste a 100 patitas! ¡Increíble!',
  },
  {
    id: 'paws-250',
    title: 'Súper Coleccionista',
    description: '¡250 patitas! Los animales de Chiloé te adoran.',
  },
  {
    id: 'paws-500',
    title: 'Leyenda de las Patitas',
    description: '¡500 patitas! Eres una leyenda del bosque.',
  },
];

// ─────────────────────────────────────────────
// Streak achievements
// ─────────────────────────────────────────────
export const streakAchievements: Achievement[] = [
  {
    id: 'streak-3',
    title: 'Racha de 3 días',
    description: '¡Jugaste 3 días seguidos! ¡Sigue así!',
  },
  {
    id: 'streak-7',
    title: 'Semana Completa',
    description: '¡Una semana entera sin parar! ¡Eres imparable!',
  },
  {
    id: 'streak-14',
    title: 'Dos Semanas de Campeona',
    description: '¡14 días seguidos! Los animales te esperan cada día.',
  },
  {
    id: 'streak-30',
    title: 'Mes de Aventuras',
    description: '¡Un mes completo jugando! ¡Eres la protectora del bosque!',
  },
];

// ─────────────────────────────────────────────
// Performance achievements
// ─────────────────────────────────────────────
export const performanceAchievements: Achievement[] = [
  {
    id: 'perfect-stage',
    title: 'Etapa Perfecta',
    description: 'Completaste una etapa sin ningún error. ¡3 patitas en todo!',
  },
  {
    id: 'perfect-chapter',
    title: 'Capítulo Perfecto',
    description: 'Completaste un capítulo entero sin errores. ¡Asombroso!',
  },
  {
    id: 'speed-demon',
    title: 'Rápida como el Viento',
    description: 'Respondiste 5 ejercicios seguidos en menos de 10 segundos cada uno.',
  },
  {
    id: 'no-hints',
    title: 'Sin Pistas',
    description: 'Completaste una etapa sin usar ninguna pista.',
  },
  {
    id: 'comeback',
    title: 'Gran Remontada',
    description: 'Después de equivocarte 3 veces, acertaste 5 seguidas. ¡Nunca te rindes!',
  },
  {
    id: 'ten-in-a-row',
    title: 'Diez de Diez',
    description: '¡10 respuestas correctas seguidas! ¡Racha increíble!',
  },
  {
    id: 'twenty-in-a-row',
    title: 'Veinte Seguidas',
    description: '¡20 respuestas correctas sin parar! ¡Eres una máquina!',
  },
];

// ─────────────────────────────────────────────
// Exploration / fun fact achievements
// ─────────────────────────────────────────────
export const explorationAchievements: Achievement[] = [
  {
    id: 'first-fact',
    title: 'Curiosa',
    description: 'Descubriste tu primer dato curioso sobre un animal.',
  },
  {
    id: 'ten-facts',
    title: 'Mini Bióloga',
    description: '¡Descubriste 10 datos curiosos! Sabes un montón de animales.',
  },
  {
    id: 'all-facts',
    title: 'Experta en Fauna Chilota',
    description: '¡Desbloqueaste todos los datos curiosos! Sabes todo sobre los animales de Chiloé.',
  },
  {
    id: 'all-chapters',
    title: 'Exploradora de Chiloé',
    description: 'Completaste los 6 capítulos y ayudaste a todos los animales. ¡Eres la mejor exploradora de Chiloé!',
  },
];

// ─────────────────────────────────────────────
// Special achievements
// ─────────────────────────────────────────────
export const specialAchievements: Achievement[] = [
  {
    id: 'first-exercise',
    title: 'Primera Suma',
    description: '¡Resolviste tu primer ejercicio! El viaje comienza.',
  },
  {
    id: 'first-three-paws',
    title: 'Tres Patitas',
    description: '¡Ganaste 3 patitas en un ejercicio! Respuesta perfecta al primer intento.',
  },
  {
    id: 'night-owl',
    title: 'Búho Nocturno',
    description: 'Jugaste después de las 8 de la noche. ¡Como Luna la Güiña!',
  },
  {
    id: 'early-bird',
    title: 'Madrugadora',
    description: 'Jugaste antes de las 8 de la mañana. ¡Los pájaros cantan contigo!',
  },
  {
    id: 'weekend-warrior',
    title: 'Guerrera de Fin de Semana',
    description: 'Jugaste tanto el sábado como el domingo. ¡Ni el finde descansas!',
  },
];

// ─────────────────────────────────────────────
// All achievements combined
// ─────────────────────────────────────────────
export const allAchievements: Achievement[] = [
  ...chapterBadges,
  ...pawMilestones,
  ...streakAchievements,
  ...performanceAchievements,
  ...explorationAchievements,
  ...specialAchievements,
];

export const getAchievementById = (id: string): Achievement | undefined =>
  allAchievements.find((a) => a.id === id);
