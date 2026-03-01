// Difficulty levels mapped to chapters
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type Operation = 'addition' | 'subtraction';

export type ExerciseType = 'vertical' | 'mystery_number' | 'complete_operation' | 'compare' | 'estimation' | 'word_problem';

export interface VerticalExercise {
  id: string;
  type: 'vertical';
  operation: Operation;
  operandA: number;
  operandB: number;
  correctAnswer: number;
  hasCarry: boolean;
  hasBorrow: boolean;
  digits: number;
  level: DifficultyLevel;
  context?: ExerciseContext;
}

export interface MysteryNumberExercise {
  id: string;
  type: 'mystery_number';
  description: string;
  equation: string;
  answer: number;
  level: DifficultyLevel;
  context?: ExerciseContext;
}

export interface CompleteOperationExercise {
  id: string;
  type: 'complete_operation';
  operandA: number | null;
  operator: '+' | '-';
  operandB: number | null;
  result: number | null;
  blankPosition: 'left' | 'right' | 'result';
  answer: number;
  level: DifficultyLevel;
  context?: ExerciseContext;
}

export interface CompareExercise {
  id: string;
  type: 'compare';
  expressionA: string;
  expressionB: string;
  valueA: number;
  valueB: number;
  answer: 'greater' | 'less' | 'equal';
  level: DifficultyLevel;
}

export interface EstimationExercise {
  id: string;
  type: 'estimation';
  expression: string;
  exactAnswer: number;
  options: number[];
  answer: number;
  level: DifficultyLevel;
}

export interface WordProblemExercise {
  id: string;
  type: 'word_problem';
  story: string;
  question: string;
  operation: Operation;
  operandA: number;
  operandB: number;
  answer: number;
  level: DifficultyLevel;
  context?: ExerciseContext;
}

export type Exercise =
  | VerticalExercise
  | MysteryNumberExercise
  | CompleteOperationExercise
  | CompareExercise
  | EstimationExercise
  | WordProblemExercise;

export interface ExerciseContext {
  animalName: string;
  storyLine: string;
}

export interface ExerciseResult {
  exerciseId: string;
  type: ExerciseType;
  correct: boolean;
  attempts: number;
  hintsUsed: number;
  timeSeconds: number;
  pawsEarned: 1 | 2 | 3;
}

export type AnimalState = 'idle' | 'walking' | 'celebrating' | 'hiding' | 'worried' | 'eating' | 'sleeping';

export interface AnimalProfile {
  id: string;
  name: string;
  species: string;
  scientificName: string;
  personality: string;
  description: string;
  conservationStatus: string;
  size: string;
}

export interface Stage {
  id: string;
  chapterId: string;
  order: number;
  title: string;
  description: string;
  exercisesRequired: number;
  funFact?: FunFact;
}

export interface FunFact {
  id: string;
  text: string;
  category: 'behavior' | 'habitat' | 'conservation' | 'fun';
}

export interface Chapter {
  id: string;
  order: number;
  animal: AnimalProfile;
  title: string;
  operation: Operation | 'mixed';
  difficultyLevel: DifficultyLevel;
  numberRange: { min: number; max: number };
  stages: Stage[];
  storyIntro: string;
  completionFact: string;
  backgroundTheme: string;
}

export interface ChapterProgress {
  chapterId: string;
  currentStage: number;
  exercisesInCurrentStage: number;
  totalPaws: number;
  factsUnlocked: string[];
  completed: boolean;
  badgeEarned: boolean;
}

export interface GameProgress {
  chapters: Record<string, ChapterProgress>;
  currentChapterId: string;
  totalPaws: number;
  streak: {
    currentDays: number;
    longestStreak: number;
    lastPlayedDate: string;
  };
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt?: string;
}

export interface AdaptiveState {
  currentLevel: DifficultyLevel;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  recentResults: ExerciseResult[];
  weakPatterns: string[];
}

export interface GameSettings {
  voiceEnabled: boolean;
  voiceRate: number;
  voicePitch: number;
  maxSessionMinutes: number;
  parentPin: string;
}
