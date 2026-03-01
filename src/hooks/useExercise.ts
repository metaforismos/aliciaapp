import { useState, useCallback } from 'react';
import type { Exercise, ExerciseResult } from '../types/game';
import { evaluateAnswer, createExerciseResult } from '../engine/math/evaluator';

// ────────────────────────────────────────────
// Exercise flow phases
// ────────────────────────────────────────────

export type ExercisePhase =
  | 'intro'
  | 'playing'
  | 'feedback'
  | 'stage_complete'
  | 'chapter_complete';

// ────────────────────────────────────────────
// Hook interface
// ────────────────────────────────────────────

export interface UseExerciseReturn {
  phase: ExercisePhase;
  exercise: Exercise | null;
  attempts: number;
  hintsUsed: number;
  lastResult: ExerciseResult | null;
  startExercise: (exercise: Exercise) => void;
  submitAnswer: (answer: number) => void;
  requestHint: () => number;
  nextExercise: () => void;
  goToStageComplete: () => void;
  goToChapterComplete: () => void;
}

const MAX_HINT_LEVEL = 4;

// ────────────────────────────────────────────
// Hook implementation
// ────────────────────────────────────────────

export function useExercise(): UseExerciseReturn {
  const [phase, setPhase] = useState<ExercisePhase>('intro');
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [lastResult, setLastResult] = useState<ExerciseResult | null>(null);
  const [exerciseStartTime, setExerciseStartTime] = useState<number>(0);

  /**
   * Begin a new exercise. Resets attempt/hint counters
   * and transitions to 'playing' phase.
   */
  const startExercise = useCallback((ex: Exercise) => {
    setExercise(ex);
    setAttempts(0);
    setHintsUsed(0);
    setLastResult(null);
    setExerciseStartTime(Date.now());
    setPhase('playing');
  }, []);

  /**
   * Submit an answer for the current exercise.
   * Evaluates correctness, calculates paws, and
   * transitions to 'feedback' phase.
   */
  const submitAnswer = useCallback(
    (answer: number) => {
      if (!exercise) return;

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      const timeSeconds = Math.round((Date.now() - exerciseStartTime) / 1000);
      const isCorrect = evaluateAnswer(exercise, answer);

      if (isCorrect) {
        // Create result and go to feedback
        const result = createExerciseResult(
          exercise,
          answer,
          newAttempts,
          hintsUsed,
          timeSeconds,
        );
        setLastResult(result);
        setPhase('feedback');
      } else {
        // Wrong answer: stay in 'playing' phase so the child can retry.
        // The UI can check attempts count to show encouragement.
        // After too many wrong attempts the hint system guides them.
        // We still create a result snapshot for tracking.
        const result = createExerciseResult(
          exercise,
          answer,
          newAttempts,
          hintsUsed,
          timeSeconds,
        );
        setLastResult(result);
        // Remain in 'playing' — the component decides when to show feedback
      }
    },
    [exercise, attempts, hintsUsed, exerciseStartTime],
  );

  /**
   * Request a hint. Returns the current hint level (1-4).
   * Each call increments the hint level up to MAX_HINT_LEVEL.
   *
   * Hint levels:
   * 1 - Motivational: "Piensa con calma, tu puedes"
   * 2 - Strategic: "Prueba separar el numero en decenas y unidades"
   * 3 - Visual: Show blocks or animated finger counting
   * 4 - Guided resolution: Step-by-step walkthrough
   */
  const requestHint = useCallback((): number => {
    const nextHintLevel = Math.min(hintsUsed + 1, MAX_HINT_LEVEL);
    setHintsUsed(nextHintLevel);
    return nextHintLevel;
  }, [hintsUsed]);

  /**
   * Transition to the next exercise.
   * Resets to 'intro' phase so the parent component
   * can set up and call startExercise with the next exercise.
   */
  const nextExercise = useCallback(() => {
    setExercise(null);
    setAttempts(0);
    setHintsUsed(0);
    setLastResult(null);
    setPhase('intro');
  }, []);

  /**
   * Transition to stage_complete phase.
   * Called by the parent when enough exercises have been
   * completed for the current stage.
   */
  const goToStageComplete = useCallback(() => {
    setPhase('stage_complete');
  }, []);

  /**
   * Transition to chapter_complete phase.
   * Called when all 5 stages of a chapter are done.
   */
  const goToChapterComplete = useCallback(() => {
    setPhase('chapter_complete');
  }, []);

  return {
    phase,
    exercise,
    attempts,
    hintsUsed,
    lastResult,
    startExercise,
    submitAnswer,
    requestHint,
    nextExercise,
    goToStageComplete,
    goToChapterComplete,
  };
}
