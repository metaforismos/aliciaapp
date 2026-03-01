import {
  type DifficultyLevel,
  type VerticalExercise,
  type MysteryNumberExercise,
  type CompleteOperationExercise,
  type WordProblemExercise,
  type Exercise,
} from '../../types/game';

// ============================================================
// ID Generation
// ============================================================

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// ============================================================
// Digit Helpers
// ============================================================

/**
 * Returns the number of digits in a positive integer.
 */
export function getDigitCount(n: number): number {
  if (n === 0) return 1;
  return Math.floor(Math.log10(Math.abs(n))) + 1;
}

/**
 * Checks if adding a + b produces a carry at any digit position.
 * E.g., 17 + 5: ones = 7+5 = 12 >= 10 => carry.
 */
export function hasCarry(a: number, b: number): boolean {
  let carry = 0;
  while (a > 0 || b > 0) {
    const digitA = a % 10;
    const digitB = b % 10;
    const sum = digitA + digitB + carry;
    if (sum >= 10) return true;
    carry = 0;
    a = Math.floor(a / 10);
    b = Math.floor(b / 10);
  }
  return false;
}

/**
 * Checks if subtracting a - b requires a borrow at any digit position.
 * Assumes a >= b.
 */
export function hasBorrow(a: number, b: number): boolean {
  let borrow = 0;
  while (a > 0 || b > 0) {
    const digitA = a % 10;
    const digitB = b % 10;
    if (digitA - borrow < digitB) return true;
    borrow = (digitA - borrow < digitB) ? 1 : 0;
    a = Math.floor(a / 10);
    b = Math.floor(b / 10);
  }
  return false;
}

// ============================================================
// Random helpers
// ============================================================

/** Returns a random integer in [min, max] inclusive. */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Returns a random element from an array. */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================================
// Vertical Exercise Generators
// ============================================================

/**
 * Level 1: Addition without carry.
 * operandA in [1, 15], sum <= 20.
 * No digit pair sums > 9 (i.e., no carry at any position).
 */
function generateLevel1Addition(): VerticalExercise {
  const MAX_ATTEMPTS = 100;
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const a = randInt(1, 15);
    const maxB = Math.min(20 - a, 15);
    if (maxB < 1) continue;
    const b = randInt(1, maxB);
    if (!hasCarry(a, b)) {
      return {
        id: generateId(),
        type: 'vertical',
        operation: 'addition',
        operandA: a,
        operandB: b,
        correctAnswer: a + b,
        hasCarry: false,
        hasBorrow: false,
        digits: getDigitCount(Math.max(a, b)),
        level: 1,
      };
    }
  }
  // Guaranteed fallback: 2 + 3
  return {
    id: generateId(),
    type: 'vertical',
    operation: 'addition',
    operandA: 2,
    operandB: 3,
    correctAnswer: 5,
    hasCarry: false,
    hasBorrow: false,
    digits: 1,
    level: 1,
  };
}

/**
 * Level 2: Subtraction without borrow.
 * operandA > operandB, each digit of A >= corresponding digit of B.
 * Range 1-20.
 */
function generateLevel2Subtraction(): VerticalExercise {
  const MAX_ATTEMPTS = 100;
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const a = randInt(2, 20);
    const b = randInt(1, a - 1);
    if (!hasBorrow(a, b)) {
      return {
        id: generateId(),
        type: 'vertical',
        operation: 'subtraction',
        operandA: a,
        operandB: b,
        correctAnswer: a - b,
        hasCarry: false,
        hasBorrow: false,
        digits: getDigitCount(a),
        level: 2,
      };
    }
  }
  // Guaranteed fallback: 15 - 3
  return {
    id: generateId(),
    type: 'vertical',
    operation: 'subtraction',
    operandA: 15,
    operandB: 3,
    correctAnswer: 12,
    hasCarry: false,
    hasBorrow: false,
    digits: 2,
    level: 2,
  };
}

/**
 * Level 3: Addition with carry.
 * Range 10-99, MUST have at least one carry.
 */
function generateLevel3AdditionWithCarry(): VerticalExercise {
  const MAX_ATTEMPTS = 100;
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const a = randInt(10, 89);
    const maxB = 99 - a;
    if (maxB < 10) continue;
    const b = randInt(10, maxB);
    if (hasCarry(a, b)) {
      return {
        id: generateId(),
        type: 'vertical',
        operation: 'addition',
        operandA: a,
        operandB: b,
        correctAnswer: a + b,
        hasCarry: true,
        hasBorrow: false,
        digits: 2,
        level: 3,
      };
    }
  }
  // Guaranteed fallback: 27 + 15 = 42 (7+5 = 12, carries)
  return {
    id: generateId(),
    type: 'vertical',
    operation: 'addition',
    operandA: 27,
    operandB: 15,
    correctAnswer: 42,
    hasCarry: true,
    hasBorrow: false,
    digits: 2,
    level: 3,
  };
}

/**
 * Level 4: Subtraction with borrow.
 * Range 20-99, MUST have at least one borrow.
 */
function generateLevel4SubtractionWithBorrow(): VerticalExercise {
  const MAX_ATTEMPTS = 100;
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const a = randInt(20, 99);
    const minB = 10;
    const maxB = a - 1;
    if (maxB < minB) continue;
    const b = randInt(minB, maxB);
    if (hasBorrow(a, b)) {
      return {
        id: generateId(),
        type: 'vertical',
        operation: 'subtraction',
        operandA: a,
        operandB: b,
        correctAnswer: a - b,
        hasCarry: false,
        hasBorrow: true,
        digits: 2,
        level: 4,
      };
    }
  }
  // Guaranteed fallback: 43 - 17 = 26 (3 < 7, borrows)
  return {
    id: generateId(),
    type: 'vertical',
    operation: 'subtraction',
    operandA: 43,
    operandB: 17,
    correctAnswer: 26,
    hasCarry: false,
    hasBorrow: true,
    digits: 2,
    level: 4,
  };
}

/**
 * Level 5: Mixed addition and subtraction within 10-99.
 * Randomly picks addition or subtraction.
 */
function generateLevel5Mixed(): VerticalExercise {
  const isAddition = Math.random() < 0.5;

  if (isAddition) {
    const a = randInt(10, 89);
    const maxB = 99 - a;
    const b = randInt(10, Math.max(10, maxB));
    const sum = a + b;
    return {
      id: generateId(),
      type: 'vertical',
      operation: 'addition',
      operandA: a,
      operandB: b,
      correctAnswer: sum,
      hasCarry: hasCarry(a, b),
      hasBorrow: false,
      digits: 2,
      level: 5,
    };
  } else {
    const a = randInt(20, 99);
    const b = randInt(10, a - 1);
    return {
      id: generateId(),
      type: 'vertical',
      operation: 'subtraction',
      operandA: a,
      operandB: b,
      correctAnswer: a - b,
      hasCarry: false,
      hasBorrow: hasBorrow(a, b),
      digits: 2,
      level: 5,
    };
  }
}

/**
 * Level 6: 3-digit addition or subtraction (100-999).
 */
function generateLevel6ThreeDigits(): VerticalExercise {
  const isAddition = Math.random() < 0.5;

  if (isAddition) {
    const a = randInt(100, 899);
    const maxB = 999 - a;
    const b = randInt(100, Math.max(100, maxB));
    return {
      id: generateId(),
      type: 'vertical',
      operation: 'addition',
      operandA: a,
      operandB: b,
      correctAnswer: a + b,
      hasCarry: hasCarry(a, b),
      hasBorrow: false,
      digits: 3,
      level: 6,
    };
  } else {
    const a = randInt(200, 999);
    const b = randInt(100, a - 1);
    return {
      id: generateId(),
      type: 'vertical',
      operation: 'subtraction',
      operandA: a,
      operandB: b,
      correctAnswer: a - b,
      hasCarry: false,
      hasBorrow: hasBorrow(a, b),
      digits: 3,
      level: 6,
    };
  }
}

/**
 * Generate a vertical exercise for the given difficulty level.
 */
export function generateVerticalExercise(level: DifficultyLevel): VerticalExercise {
  switch (level) {
    case 1: return generateLevel1Addition();
    case 2: return generateLevel2Subtraction();
    case 3: return generateLevel3AdditionWithCarry();
    case 4: return generateLevel4SubtractionWithBorrow();
    case 5: return generateLevel5Mixed();
    case 6: return generateLevel6ThreeDigits();
    default: return generateLevel1Addition();
  }
}

// ============================================================
// Thinking Exercise Generators
// ============================================================

// --- Animal context for word problems ---

const ANIMAL_CONTEXTS: Record<DifficultyLevel, { name: string; items: string[] }> = {
  1: { name: 'Pascual el Pudu', items: ['hojas', 'ramas', 'hongos', 'helechos', 'huellas'] },
  2: { name: 'Bruno la Bandurria', items: ['lombrices', 'insectos', 'semillas', 'caracoles', 'plumas'] },
  3: { name: 'Darwin el Zorrito', items: ['insectos', 'murtas', 'frutos', 'ratones', 'huevos'] },
  4: { name: 'Momo el Monito del Monte', items: ['semillas', 'quintrales', 'frutos', 'hojas', 'nidos'] },
  5: { name: 'Luna la Guina', items: ['ratones', 'pajaros', 'insectos', 'lagartijas', 'nidos'] },
  6: { name: 'Neptuno el Chungungo', items: ['erizos', 'piedras', 'mariscos', 'algas', 'peces'] },
};

// --- Number range per level ---

function getRangeForLevel(level: DifficultyLevel): { min: number; max: number } {
  switch (level) {
    case 1: return { min: 1, max: 20 };
    case 2: return { min: 1, max: 20 };
    case 3: return { min: 10, max: 99 };
    case 4: return { min: 10, max: 99 };
    case 5: return { min: 10, max: 99 };
    case 6: return { min: 100, max: 999 };
    default: return { min: 1, max: 20 };
  }
}

/**
 * Generate a mystery number exercise.
 * "Soy un numero. Si me sumas X, obtienes Y. Quien soy?"
 */
function generateMysteryNumber(level: DifficultyLevel): MysteryNumberExercise {
  const range = getRangeForLevel(level);
  const ctx = ANIMAL_CONTEXTS[level];

  const isAddition = level <= 2 ? level === 1 : Math.random() < 0.5;
  const answer = randInt(range.min, Math.floor(range.max * 0.6));

  if (isAddition) {
    const addend = randInt(range.min, Math.min(range.max - answer, Math.floor(range.max * 0.4)));
    const result = answer + addend;

    const descriptions = [
      `Soy un numero. Si me sumas ${addend}, obtienes ${result}. Quien soy?`,
      `${ctx.name} dio ${addend} pasos y ahora esta en el paso ${result}. En que paso empezo?`,
      `${ctx.name} tenia algunas ${pickRandom(ctx.items)} y encontro ${addend} mas. Ahora tiene ${result}. Cuantas tenia antes?`,
    ];

    return {
      id: generateId(),
      type: 'mystery_number',
      description: pickRandom(descriptions),
      equation: `? + ${addend} = ${result}`,
      answer,
      level,
    };
  } else {
    const subtrahend = randInt(range.min, Math.min(answer - 1, Math.floor(range.max * 0.4)));
    const result = answer - subtrahend;

    const descriptions = [
      `Soy un numero. Si me restas ${subtrahend}, obtienes ${result}. Quien soy?`,
      `${ctx.name} retrocedio ${subtrahend} pasos y quedo en el paso ${result}. En que paso estaba?`,
      `${ctx.name} tenia algunas ${pickRandom(ctx.items)} y perdio ${subtrahend}. Le quedan ${result}. Cuantas tenia?`,
    ];

    return {
      id: generateId(),
      type: 'mystery_number',
      description: pickRandom(descriptions),
      equation: `? - ${subtrahend} = ${result}`,
      answer,
      level,
    };
  }
}

/**
 * Generate a complete-the-operation exercise.
 * E.g., 7 + ___ = 15
 */
function generateCompleteOperation(level: DifficultyLevel): CompleteOperationExercise {
  const range = getRangeForLevel(level);
  const isAddition = level <= 2 ? level === 1 : Math.random() < 0.5;

  if (isAddition) {
    const a = randInt(range.min, Math.floor(range.max * 0.7));
    const b = randInt(range.min, Math.min(range.max - a, Math.floor(range.max * 0.5)));
    const result = a + b;
    const blankPos = pickRandom(['left', 'right', 'result'] as const);

    let answer: number;
    let operandA: number | null = a;
    let operandB: number | null = b;
    let resultVal: number | null = result;

    switch (blankPos) {
      case 'left':
        operandA = null;
        answer = a;
        break;
      case 'right':
        operandB = null;
        answer = b;
        break;
      case 'result':
        resultVal = null;
        answer = result;
        break;
    }

    return {
      id: generateId(),
      type: 'complete_operation',
      operandA,
      operator: '+',
      operandB,
      result: resultVal,
      blankPosition: blankPos,
      answer,
      level,
    };
  } else {
    const result = randInt(range.min, Math.floor(range.max * 0.5));
    const b = randInt(range.min, Math.min(result, Math.floor(range.max * 0.4)));
    const a = result + b; // a - b = result, so a = result + b. But a must be in range.
    if (a > range.max) {
      // Fallback to simpler numbers
      const safeA = randInt(range.min + 1, range.max);
      const safeB = randInt(range.min, safeA - 1);
      const safeResult = safeA - safeB;
      const blankPos = pickRandom(['left', 'right', 'result'] as const);

      let answer: number;
      let operandAVal: number | null = safeA;
      let operandBVal: number | null = safeB;
      let resultValSafe: number | null = safeResult;

      switch (blankPos) {
        case 'left':
          operandAVal = null;
          answer = safeA;
          break;
        case 'right':
          operandBVal = null;
          answer = safeB;
          break;
        case 'result':
          resultValSafe = null;
          answer = safeResult;
          break;
      }

      return {
        id: generateId(),
        type: 'complete_operation',
        operandA: operandAVal,
        operator: '-',
        operandB: operandBVal,
        result: resultValSafe,
        blankPosition: blankPos,
        answer,
        level,
      };
    }

    const blankPos = pickRandom(['left', 'right', 'result'] as const);

    let answer: number;
    let operandAFinal: number | null = a;
    let operandBFinal: number | null = b;
    let resultFinal: number | null = result;

    switch (blankPos) {
      case 'left':
        operandAFinal = null;
        answer = a;
        break;
      case 'right':
        operandBFinal = null;
        answer = b;
        break;
      case 'result':
        resultFinal = null;
        answer = result;
        break;
    }

    return {
      id: generateId(),
      type: 'complete_operation',
      operandA: operandAFinal,
      operator: '-',
      operandB: operandBFinal,
      result: resultFinal,
      blankPosition: blankPos,
      answer,
      level,
    };
  }
}

/**
 * Generate a word problem contextualized with the chapter's animal.
 */
function generateWordProblem(level: DifficultyLevel): WordProblemExercise {
  const range = getRangeForLevel(level);
  const ctx = ANIMAL_CONTEXTS[level];
  const item = pickRandom(ctx.items);
  const isAddition = level <= 2 ? level === 1 : Math.random() < 0.5;

  if (isAddition) {
    const a = randInt(range.min, Math.floor(range.max * 0.6));
    const b = randInt(range.min, Math.min(range.max - a, Math.floor(range.max * 0.5)));
    const answer = a + b;

    const stories = [
      `${ctx.name} encontro ${a} ${item} debajo de un tronco y ${b} ${item} junto al rio.`,
      `En la manana, ${ctx.name} junto ${a} ${item}. En la tarde encontro ${b} mas.`,
      `${ctx.name} tenia ${a} ${item} en su nido y sus amigos le trajeron ${b} mas.`,
    ];

    const questions = [
      `Cuantas ${item} tiene en total?`,
      `Cuantas ${item} junto en total?`,
      `Cuantas ${item} tiene ahora?`,
    ];

    return {
      id: generateId(),
      type: 'word_problem',
      story: pickRandom(stories),
      question: pickRandom(questions),
      operation: 'addition',
      operandA: a,
      operandB: b,
      answer,
      level,
    };
  } else {
    const a = randInt(Math.max(range.min + 1, Math.floor(range.max * 0.3)), range.max);
    const b = randInt(range.min, Math.floor(a * 0.7));
    const answer = a - b;

    const stories = [
      `${ctx.name} tenia ${a} ${item} pero ${b} se las llevo el viento.`,
      `Habia ${a} ${item} en el camino. ${ctx.name} se comio ${b}.`,
      `${ctx.name} junto ${a} ${item} pero regalo ${b} a un amigo.`,
    ];

    const questions = [
      `Cuantas ${item} le quedan?`,
      `Cuantas ${item} quedaron?`,
      `Con cuantas ${item} se quedo?`,
    ];

    return {
      id: generateId(),
      type: 'word_problem',
      story: pickRandom(stories),
      question: pickRandom(questions),
      operation: 'subtraction',
      operandA: a,
      operandB: b,
      answer,
      level,
    };
  }
}

/**
 * Generate a thinking exercise (mystery_number, complete_operation, or word_problem)
 * based on the current difficulty level.
 */
export function generateThinkingExercise(level: DifficultyLevel): Exercise {
  const thinkingTypes = ['mystery_number', 'complete_operation', 'word_problem'] as const;
  const chosen = pickRandom([...thinkingTypes]);

  switch (chosen) {
    case 'mystery_number':
      return generateMysteryNumber(level);
    case 'complete_operation':
      return generateCompleteOperation(level);
    case 'word_problem':
      return generateWordProblem(level);
    default:
      return generateMysteryNumber(level);
  }
}

// ============================================================
// Main Exercise Generator
// ============================================================

/**
 * Generate an exercise for the given difficulty level.
 * 70% chance of a vertical operation, 30% chance of a thinking exercise.
 */
export function generateExercise(level: DifficultyLevel): Exercise {
  const roll = Math.random();
  if (roll < 0.7) {
    return generateVerticalExercise(level);
  }
  return generateThinkingExercise(level);
}
