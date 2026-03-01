import {
  type Chapter,
  type ChapterProgress,
  type ExerciseResult,
  type GameProgress,
} from '../../types/game';

// ============================================================
// Initialization
// ============================================================

/**
 * Create initial game progress from a list of chapters.
 * The first chapter is set as the current chapter.
 * All chapters start with zero progress.
 */
export function createInitialProgress(chapters: Chapter[]): GameProgress {
  const chaptersProgress: Record<string, ChapterProgress> = {};

  for (const chapter of chapters) {
    chaptersProgress[chapter.id] = {
      chapterId: chapter.id,
      currentStage: 0,
      exercisesInCurrentStage: 0,
      totalPaws: 0,
      factsUnlocked: [],
      completed: false,
      badgeEarned: false,
    };
  }

  const firstChapterId = chapters.length > 0 ? chapters[0].id : '';

  return {
    chapters: chaptersProgress,
    currentChapterId: firstChapterId,
    totalPaws: 0,
    streak: {
      currentDays: 0,
      longestStreak: 0,
      lastPlayedDate: '',
    },
    achievements: [],
  };
}

// ============================================================
// Chapter Progress Update
// ============================================================

/**
 * Update chapter progress after completing an exercise.
 *
 * When the required number of exercises for the current stage is reached,
 * the stage advances. Paws are accumulated. Fun facts are unlocked per stage.
 */
export function updateChapterProgress(
  progress: ChapterProgress,
  result: ExerciseResult,
  stage: { exercisesRequired: number },
): ChapterProgress {
  // Only count correct exercises toward stage completion
  const newExercisesInStage = result.correct
    ? progress.exercisesInCurrentStage + 1
    : progress.exercisesInCurrentStage;

  const newTotalPaws = progress.totalPaws + (result.correct ? result.pawsEarned : 0);

  // Check if stage is complete
  const stageComplete = newExercisesInStage >= stage.exercisesRequired;

  // If stage is complete, advance to next stage
  const newCurrentStage = stageComplete
    ? progress.currentStage + 1
    : progress.currentStage;

  // Unlock fact for the completed stage
  const newFactsUnlocked = stageComplete
    ? [...progress.factsUnlocked, `stage_${progress.currentStage}`]
    : [...progress.factsUnlocked];

  return {
    ...progress,
    currentStage: newCurrentStage,
    exercisesInCurrentStage: stageComplete ? 0 : newExercisesInStage,
    totalPaws: newTotalPaws,
    factsUnlocked: newFactsUnlocked,
    // completed and badgeEarned are set via isChapterComplete check externally
    completed: progress.completed,
    badgeEarned: progress.badgeEarned,
  };
}

// ============================================================
// Completion Checks
// ============================================================

/**
 * Check if the current stage is complete.
 * A stage is complete when the number of correct exercises meets the requirement.
 */
export function isStageComplete(
  progress: ChapterProgress,
  exercisesRequired: number,
): boolean {
  return progress.exercisesInCurrentStage >= exercisesRequired;
}

/**
 * Check if a chapter is fully complete.
 * A chapter is complete when all its stages have been completed.
 * totalStages is the number of stages in the chapter (typically 5).
 */
export function isChapterComplete(
  progress: ChapterProgress,
  totalStages: number,
): boolean {
  return progress.currentStage >= totalStages;
}

// ============================================================
// Navigation
// ============================================================

/**
 * Get the next chapter ID in sequence, or null if there is no next chapter.
 * Chapters are ordered by their `order` field.
 */
export function getNextChapterId(
  chapters: Chapter[],
  currentId: string,
): string | null {
  const sorted = [...chapters].sort((a, b) => a.order - b.order);
  const currentIndex = sorted.findIndex((ch) => ch.id === currentId);

  if (currentIndex === -1 || currentIndex >= sorted.length - 1) {
    return null;
  }

  return sorted[currentIndex + 1].id;
}

// ============================================================
// Streak Management
// ============================================================

/**
 * Update the player's streak. Should be called once per play session (daily).
 *
 * Logic:
 * - If lastPlayedDate is yesterday: increment streak
 * - If lastPlayedDate is today: no change (already played today)
 * - If lastPlayedDate is older: reset streak to 1
 * - Updates longestStreak if current exceeds it
 */
export function updateStreak(progress: GameProgress): GameProgress {
  const today = new Date();
  const todayStr = formatDate(today);

  const lastPlayed = progress.streak.lastPlayedDate;

  // Already played today
  if (lastPlayed === todayStr) {
    return progress;
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  let newCurrentDays: number;

  if (lastPlayed === yesterdayStr) {
    // Consecutive day: increment streak
    newCurrentDays = progress.streak.currentDays + 1;
  } else if (lastPlayed === '') {
    // First time playing
    newCurrentDays = 1;
  } else {
    // Streak broken: reset to 1
    newCurrentDays = 1;
  }

  const newLongestStreak = Math.max(progress.streak.longestStreak, newCurrentDays);

  return {
    ...progress,
    streak: {
      currentDays: newCurrentDays,
      longestStreak: newLongestStreak,
      lastPlayedDate: todayStr,
    },
  };
}

// ============================================================
// Helpers
// ============================================================

/**
 * Format a Date to YYYY-MM-DD string for consistent date comparison.
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
