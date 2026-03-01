import { type Exercise, type ExerciseResult } from '../../types/game';

// ============================================================
// Answer Evaluation
// ============================================================

/**
 * Evaluate whether the user's answer is correct for the given exercise.
 * Handles all exercise types: vertical, mystery_number, complete_operation, word_problem.
 */
export function evaluateAnswer(exercise: Exercise, userAnswer: number): boolean {
  switch (exercise.type) {
    case 'vertical':
      return userAnswer === exercise.correctAnswer;
    case 'mystery_number':
    case 'complete_operation':
    case 'word_problem':
      return userAnswer === exercise.answer;
    // compare and estimation types also use .answer
    case 'compare':
    case 'estimation':
      // These types use non-numeric answers in their interface,
      // but if evaluated numerically (e.g., compare mapped to 0/1/2),
      // the caller must handle the mapping. For now, direct comparison.
      return userAnswer === (exercise as { answer: number }).answer;
    default:
      return false;
  }
}

/**
 * Get the correct answer from any exercise type.
 */
export function getCorrectAnswer(exercise: Exercise): number {
  switch (exercise.type) {
    case 'vertical':
      return exercise.correctAnswer;
    case 'mystery_number':
    case 'complete_operation':
    case 'word_problem':
      return exercise.answer;
    default:
      return 0;
  }
}

// ============================================================
// Paw Calculation (Huellas)
// ============================================================

/**
 * Calculate paws earned based on number of attempts.
 * 1st attempt correct = 3 paws
 * 2nd attempt correct = 2 paws
 * 3rd+ attempt correct = 1 paw
 */
export function calculatePaws(attempts: number): 1 | 2 | 3 {
  if (attempts <= 1) return 3;
  if (attempts === 2) return 2;
  return 1;
}

// ============================================================
// Exercise Result Creation
// ============================================================

/**
 * Create a complete exercise result after the user finishes an exercise.
 * This result is used by the adaptive algorithm and progression system.
 */
export function createExerciseResult(
  exercise: Exercise,
  userAnswer: number,
  attempts: number,
  hintsUsed: number,
  timeSeconds: number,
): ExerciseResult {
  const correct = evaluateAnswer(exercise, userAnswer);
  const pawsEarned = correct ? calculatePaws(attempts) : (1 as const);

  return {
    exerciseId: exercise.id,
    type: exercise.type,
    correct,
    attempts,
    hintsUsed,
    timeSeconds,
    pawsEarned,
  };
}
