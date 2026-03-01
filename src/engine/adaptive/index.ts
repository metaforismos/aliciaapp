import { type AdaptiveState, type DifficultyLevel, type ExerciseResult } from '../../types/game';

// ============================================================
// Constants
// ============================================================

/** Max number of recent results to keep in adaptive history. */
const MAX_HISTORY_LENGTH = 20;

/** Consecutive correct answers needed to advance difficulty. */
const ADVANCE_THRESHOLD = 3;

/** Consecutive wrong answers that trigger difficulty reduction. */
const RETREAT_THRESHOLD = 2;

/** Minimum number of results to analyze for weak patterns. */
const MIN_RESULTS_FOR_PATTERN = 5;

/** Error rate above which a pattern is considered weak. */
const WEAK_PATTERN_THRESHOLD = 0.5;

// ============================================================
// Initialization
// ============================================================

/**
 * Create an initial adaptive state for a given difficulty level.
 */
export function createInitialAdaptiveState(level: DifficultyLevel): AdaptiveState {
  return {
    currentLevel: level,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    recentResults: [],
    weakPatterns: [],
  };
}

// ============================================================
// State Update
// ============================================================

/**
 * Update the adaptive state after an exercise result.
 *
 * Rules:
 * - 3 correct in a row: advance level (capped at 6)
 * - 2 wrong in a row: reduce level or shrink number range
 * - Track weak patterns (e.g., carry_ones, borrow_tens)
 */
export function updateAdaptiveState(
  state: AdaptiveState,
  result: ExerciseResult,
): AdaptiveState {
  // Update history (keep last MAX_HISTORY_LENGTH)
  const updatedHistory = [...state.recentResults, result].slice(-MAX_HISTORY_LENGTH);

  // Update consecutive counters
  let consecutiveCorrect = result.correct ? state.consecutiveCorrect + 1 : 0;
  let consecutiveWrong = result.correct ? 0 : state.consecutiveWrong + 1;
  let currentLevel = state.currentLevel;

  // Advance difficulty: 3 correct in a row
  if (consecutiveCorrect >= ADVANCE_THRESHOLD) {
    if (currentLevel < 6) {
      currentLevel = (currentLevel + 1) as DifficultyLevel;
    }
    consecutiveCorrect = 0;
  }

  // Retreat difficulty: 2 wrong in a row
  if (consecutiveWrong >= RETREAT_THRESHOLD) {
    if (currentLevel > 1) {
      currentLevel = (currentLevel - 1) as DifficultyLevel;
    }
    consecutiveWrong = 0;
  }

  // Detect weak patterns from updated history
  const weakPatterns = detectWeakPatterns(updatedHistory);

  return {
    currentLevel,
    consecutiveCorrect,
    consecutiveWrong,
    recentResults: updatedHistory,
    weakPatterns,
  };
}

// ============================================================
// Weak Pattern Detection
// ============================================================

/**
 * Analyze exercise results to detect weak patterns.
 *
 * Patterns detected:
 * - 'carry_ones': struggles with carry in ones place
 * - 'carry_tens': struggles with carry in tens place
 * - 'borrow_ones': struggles with borrowing from ones
 * - 'borrow_tens': struggles with borrowing from tens
 * - 'subtraction': general subtraction weakness
 * - 'addition': general addition weakness
 * - 'word_problems': struggles with word problems
 * - 'mystery_number': struggles with mystery number exercises
 * - 'large_numbers': struggles with 3-digit numbers
 *
 * A pattern is flagged as weak when the error rate exceeds 50%
 * across the last 5+ exercises of that type.
 */
export function detectWeakPatterns(results: ExerciseResult[]): string[] {
  if (results.length < MIN_RESULTS_FOR_PATTERN) return [];

  const patterns: string[] = [];

  // Group results by type
  const byType = groupBy(results, (r) => r.type);

  // Check vertical exercise patterns
  const verticalResults = byType['vertical'] || [];
  if (verticalResults.length >= MIN_RESULTS_FOR_PATTERN) {
    const errorRate = verticalResults.filter((r) => !r.correct).length / verticalResults.length;
    if (errorRate > WEAK_PATTERN_THRESHOLD) {
      patterns.push('vertical_operations');
    }
  }

  // Check thinking exercise patterns
  const mysteryResults = byType['mystery_number'] || [];
  if (mysteryResults.length >= 3) {
    const errorRate = mysteryResults.filter((r) => !r.correct).length / mysteryResults.length;
    if (errorRate > WEAK_PATTERN_THRESHOLD) {
      patterns.push('mystery_number');
    }
  }

  const wordProblemResults = byType['word_problem'] || [];
  if (wordProblemResults.length >= 3) {
    const errorRate = wordProblemResults.filter((r) => !r.correct).length / wordProblemResults.length;
    if (errorRate > WEAK_PATTERN_THRESHOLD) {
      patterns.push('word_problems');
    }
  }

  const completeOpResults = byType['complete_operation'] || [];
  if (completeOpResults.length >= 3) {
    const errorRate = completeOpResults.filter((r) => !r.correct).length / completeOpResults.length;
    if (errorRate > WEAK_PATTERN_THRESHOLD) {
      patterns.push('complete_operation');
    }
  }

  // Check for slow responses (potential frustration or confusion)
  const slowResults = results.filter((r) => r.timeSeconds > 60);
  if (slowResults.length >= 3) {
    patterns.push('slow_response');
  }

  // Check for heavy hint usage
  const hintHeavy = results.filter((r) => r.hintsUsed >= 2);
  if (hintHeavy.length > results.length * 0.4) {
    patterns.push('hint_dependent');
  }

  return patterns;
}

// ============================================================
// Helpers
// ============================================================

function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of arr) {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  }
  return groups;
}
