import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Exercise,
  ExerciseResult,
  GameProgress,
  AdaptiveState,
  ChapterProgress,
  DifficultyLevel,
} from '../types/game';

// ────────────────────────────────────────────
// Default values
// ────────────────────────────────────────────

const DEFAULT_CHAPTER_PROGRESS: ChapterProgress = {
  chapterId: '',
  currentStage: 1,
  exercisesInCurrentStage: 0,
  totalPaws: 0,
  factsUnlocked: [],
  completed: false,
  badgeEarned: false,
};

const DEFAULT_PROGRESS: GameProgress = {
  chapters: {},
  currentChapterId: 'chapter-1',
  totalPaws: 0,
  streak: {
    currentDays: 0,
    longestStreak: 0,
    lastPlayedDate: '',
  },
  achievements: [],
};

const DEFAULT_ADAPTIVE_STATE: AdaptiveState = {
  currentLevel: 1,
  consecutiveCorrect: 0,
  consecutiveWrong: 0,
  recentResults: [],
  weakPatterns: [],
};

// ────────────────────────────────────────────
// Store interface
// ────────────────────────────────────────────

interface GameState {
  // State
  progress: GameProgress;
  adaptiveState: AdaptiveState;
  currentExercise: Exercise | null;
  sessionExerciseCount: number;
  sessionStartTime: number | null;

  // Actions
  startSession: (chapterId: string) => void;
  setCurrentExercise: (exercise: Exercise) => void;
  submitAnswer: (result: ExerciseResult) => void;
  advanceStage: () => void;
  completeChapter: () => void;
  resetSession: () => void;
  resetAllProgress: () => void;
}

// ────────────────────────────────────────────
// Adaptive algorithm helpers
// ────────────────────────────────────────────

const MAX_RECENT_RESULTS = 20;

function clampLevel(level: number): DifficultyLevel {
  return Math.max(1, Math.min(6, level)) as DifficultyLevel;
}

function updateStreak(
  streak: GameProgress['streak'],
): GameProgress['streak'] {
  const today = new Date().toISOString().split('T')[0];

  if (streak.lastPlayedDate === today) {
    // Already played today, no change
    return streak;
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (streak.lastPlayedDate === yesterday) {
    // Consecutive day
    const newCurrent = streak.currentDays + 1;
    return {
      currentDays: newCurrent,
      longestStreak: Math.max(streak.longestStreak, newCurrent),
      lastPlayedDate: today,
    };
  }

  // Streak broken (or first time)
  return {
    currentDays: 1,
    longestStreak: Math.max(streak.longestStreak, 1),
    lastPlayedDate: today,
  };
}

// ────────────────────────────────────────────
// Store
// ────────────────────────────────────────────

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // ── Initial state ──────────────────────
      progress: DEFAULT_PROGRESS,
      adaptiveState: DEFAULT_ADAPTIVE_STATE,
      currentExercise: null,
      sessionExerciseCount: 0,
      sessionStartTime: null,

      // ── Actions ────────────────────────────

      startSession: (chapterId: string) => {
        const { progress } = get();

        // Ensure chapter progress entry exists
        const chapterProgress = progress.chapters[chapterId] ?? {
          ...DEFAULT_CHAPTER_PROGRESS,
          chapterId,
        };

        set({
          progress: {
            ...progress,
            currentChapterId: chapterId,
            chapters: {
              ...progress.chapters,
              [chapterId]: chapterProgress,
            },
            streak: updateStreak(progress.streak),
          },
          sessionExerciseCount: 0,
          sessionStartTime: Date.now(),
          currentExercise: null,
        });
      },

      setCurrentExercise: (exercise: Exercise) => {
        set({ currentExercise: exercise });
      },

      submitAnswer: (result: ExerciseResult) => {
        const { progress, adaptiveState, sessionExerciseCount } = get();
        const chapterId = progress.currentChapterId;
        const chapterProgress = progress.chapters[chapterId] ?? {
          ...DEFAULT_CHAPTER_PROGRESS,
          chapterId,
        };

        // Update chapter progress
        const updatedChapterProgress: ChapterProgress = {
          ...chapterProgress,
          exercisesInCurrentStage: chapterProgress.exercisesInCurrentStage + 1,
          totalPaws: chapterProgress.totalPaws + result.pawsEarned,
        };

        // Update adaptive state
        const recentResults = [
          result,
          ...adaptiveState.recentResults,
        ].slice(0, MAX_RECENT_RESULTS);

        let { consecutiveCorrect, consecutiveWrong, currentLevel } = adaptiveState;

        if (result.correct) {
          consecutiveCorrect += 1;
          consecutiveWrong = 0;

          // 3 correct in a row -> increase difficulty
          if (consecutiveCorrect >= 3) {
            currentLevel = clampLevel(currentLevel + 1);
            consecutiveCorrect = 0;
          }
        } else {
          consecutiveWrong += 1;
          consecutiveCorrect = 0;

          // 2 wrong in a row -> decrease difficulty
          if (consecutiveWrong >= 2) {
            currentLevel = clampLevel(currentLevel - 1);
            consecutiveWrong = 0;
          }
        }

        set({
          progress: {
            ...progress,
            totalPaws: progress.totalPaws + result.pawsEarned,
            chapters: {
              ...progress.chapters,
              [chapterId]: updatedChapterProgress,
            },
          },
          adaptiveState: {
            ...adaptiveState,
            currentLevel,
            consecutiveCorrect,
            consecutiveWrong,
            recentResults,
          },
          sessionExerciseCount: sessionExerciseCount + 1,
        });
      },

      advanceStage: () => {
        const { progress } = get();
        const chapterId = progress.currentChapterId;
        const chapterProgress = progress.chapters[chapterId];
        if (!chapterProgress) return;

        const nextStage = chapterProgress.currentStage + 1;

        set({
          progress: {
            ...progress,
            chapters: {
              ...progress.chapters,
              [chapterId]: {
                ...chapterProgress,
                currentStage: nextStage,
                exercisesInCurrentStage: 0,
                factsUnlocked: [
                  ...chapterProgress.factsUnlocked,
                  `stage-${chapterProgress.currentStage}`,
                ],
              },
            },
          },
        });
      },

      completeChapter: () => {
        const { progress } = get();
        const chapterId = progress.currentChapterId;
        const chapterProgress = progress.chapters[chapterId];
        if (!chapterProgress) return;

        set({
          progress: {
            ...progress,
            chapters: {
              ...progress.chapters,
              [chapterId]: {
                ...chapterProgress,
                completed: true,
                badgeEarned: true,
              },
            },
          },
        });
      },

      resetSession: () => {
        set({
          currentExercise: null,
          sessionExerciseCount: 0,
          sessionStartTime: null,
        });
      },

      resetAllProgress: () => {
        set({
          progress: DEFAULT_PROGRESS,
          adaptiveState: DEFAULT_ADAPTIVE_STATE,
          currentExercise: null,
          sessionExerciseCount: 0,
          sessionStartTime: null,
        });
      },
    }),
    {
      name: 'aliciaapp-game',
      // Only persist progress and adaptive state, not transient session data
      partialize: (state) => ({
        progress: state.progress,
        adaptiveState: state.adaptiveState,
      }),
    },
  ),
);
