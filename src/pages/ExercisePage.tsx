import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import VerticalOperation from '../components/exercises/VerticalOperation';
import NumberPad from '../components/exercises/NumberPad';
import HintButton from '../components/exercises/HintButton';
import ProgressTrail from '../components/gamification/ProgressTrail';
import CelebrationOverlay from '../components/gamification/CelebrationOverlay';
import PawPrints from '../components/gamification/PawPrints';
import SpeechBubble from '../components/ui/SpeechBubble';
import Pudu from '../components/animals/Pudu';

import { useExercise } from '../hooks/useExercise';
import { useVoice } from '../hooks/useVoice';
import { useTimer } from '../hooks/useTimer';
import { useSound } from '../hooks/useSound';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useGameStore } from '../store/useGameStore';

import { generateExercise } from '../engine/math/generators';
import { getCorrectAnswer } from '../engine/math/evaluator';
import { getChapterById, EXERCISES_PER_STAGE } from '../data/chapters';
import {
  getRandomLine,
  formatDialogue,
  CHARACTER_VOICE_CONFIGS,
} from '../data/characterDialogues';
import type { DialogueLine } from '../data/characterDialogues';

import type { Exercise, VerticalExercise } from '../types/game';
import type { AnimalAnimationState } from '../components/animals/types';

// ────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────

const MAX_HINTS = 4;
const FEEDBACK_DELAY_MS = 2000;
const WRONG_SHAKE_MS = 1000;
const WRONG_ANIMAL_HIDE_MS = 1500;

// ────────────────────────────────────────────
// Page transition variants
// ────────────────────────────────────────────

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween' as const,
  duration: 0.3,
};

// ────────────────────────────────────────────
// Helper: determine how many answer digits a vertical exercise needs
// ────────────────────────────────────────────

// ────────────────────────────────────────────
// Helper: convert typed digits (natural left-to-right order) to
// positional array for VerticalOperation display [ones, tens, hundreds, ...]
// ────────────────────────────────────────────

function typedToPositional(typed: number[], cols: number): (number | null)[] {
  const result: (number | null)[] = new Array(cols).fill(null);
  // Right-align: last typed digit → position 0 (ones), second-to-last → position 1 (tens)
  for (let i = 0; i < typed.length && i < cols; i++) {
    result[i] = typed[typed.length - 1 - i];
  }
  return result;
}

// ────────────────────────────────────────────
// ThinkingExerciseDisplay
// ────────────────────────────────────────────

function ThinkingExerciseDisplay({
  exercise,
  answer,
  className = '',
}: {
  exercise: Exercise;
  answer: string;
  className?: string;
}) {
  const renderContent = () => {
    switch (exercise.type) {
      case 'word_problem':
        return (
          <div className="flex flex-col items-center gap-3 w-full">
            <p className="text-bark text-base leading-relaxed text-center font-body px-2">
              {exercise.story}
            </p>
            <p className="text-forest-700 text-lg font-bold text-center font-display">
              {exercise.question}
            </p>
          </div>
        );

      case 'mystery_number':
        return (
          <div className="flex flex-col items-center gap-3 w-full">
            <p className="text-bark text-base leading-relaxed text-center font-body px-2">
              {exercise.description}
            </p>
            <p className="text-forest-600 text-sm font-mono text-center">
              {exercise.equation}
            </p>
          </div>
        );

      case 'complete_operation': {
        const leftDisplay = exercise.operandA !== null ? String(exercise.operandA) : '___';
        const rightDisplay = exercise.operandB !== null ? String(exercise.operandB) : '___';
        const resultDisplay = exercise.result !== null ? String(exercise.result) : '___';
        return (
          <div className="flex flex-col items-center gap-3 w-full">
            <p className="text-bark text-sm text-center font-body">
              Completa la operacion:
            </p>
            <p className="text-3xl font-bold text-bark font-display text-center">
              {leftDisplay} {exercise.operator} {rightDisplay} = {resultDisplay}
            </p>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`flex flex-col items-center gap-4 w-full max-w-sm px-4 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {renderContent()}

      {/* Answer display box */}
      <div className="flex items-center justify-center bg-white/90 rounded-xl border-2 border-forest-300 px-6 py-3 min-w-[120px] min-h-[56px]">
        <span className="text-3xl font-bold font-display text-bark">
          {answer || (
            <span className="text-bark/30">?</span>
          )}
        </span>
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────────────
// ExercisePage
// ────────────────────────────────────────────

export default function ExercisePage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();

  // ── Hooks ────────────────────────────────
  const exerciseHook = useExercise();
  const voice = useVoice();
  const timer = useTimer();
  const sound = useSound({ enabled: true });
  const music = useBackgroundMusic();
  const gameStore = useGameStore();

  // ── Chapter data ─────────────────────────
  const chapter = chapterId ? getChapterById(chapterId) : undefined;

  // ── Animal state ─────────────────────────
  const [animalState, setAnimalState] = useState<AnimalAnimationState>('idle');

  // ── Speech bubble ────────────────────────
  const [bubbleText, setBubbleText] = useState('');
  const [bubbleSpeaker, setBubbleSpeaker] = useState('');
  const [bubbleVisible, setBubbleVisible] = useState(false);

  // ── Vertical exercise digit input (calculator-style: type left-to-right) ──
  const [typedDigits, setTypedDigits] = useState<number[]>([]);
  const [showCarry, setShowCarry] = useState(false);
  const [isCorrectDisplay, setIsCorrectDisplay] = useState<boolean | null>(null);

  // ── Thinking exercise input ──────────────
  const [thinkingAnswer, setThinkingAnswer] = useState('');

  // ── Paw display for feedback ─────────────
  const [showPaws, setShowPaws] = useState(false);
  const [pawsEarned, setPawsEarned] = useState<1 | 2 | 3>(3);

  // ── Initialization guard ─────────────────
  const initializedRef = useRef(false);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrongTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Cleanup timeouts on unmount ──────────
  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      if (wrongTimeoutRef.current) clearTimeout(wrongTimeoutRef.current);
      voice.stop();
      music.stop();
      timer.pause();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Redirect if chapter not found ────────
  useEffect(() => {
    if (chapterId && !chapter) {
      navigate('/', { replace: true });
    }
  }, [chapterId, chapter, navigate]);

  // ── Show bubble with character identity + voice ──
  const showBubble = useCallback(
    (dialogueLine: DialogueLine, onEnd?: () => void) => {
      setBubbleText(dialogueLine.text);
      setBubbleSpeaker(dialogueLine.speaker);
      setBubbleVisible(true);

      // Use the character's voice config if available
      const charVoice = chapter?.animal.id
        ? CHARACTER_VOICE_CONFIGS[chapter.animal.id]
        : undefined;
      const voiceOverride = dialogueLine.voiceConfig ?? charVoice;

      voice.speak(dialogueLine.text, () => {
        // Keep bubble visible a moment after speech ends
        setTimeout(() => {
          setBubbleVisible(false);
          onEnd?.();
        }, 500);
      }, voiceOverride);
    },
    [voice, chapter],
  );

  // ── Reset input state for a new exercise ─
  const resetInputForExercise = useCallback((exercise: Exercise) => {
    if (exercise.type === 'vertical') {
      setTypedDigits([]);
      setShowCarry(false);
    } else {
      setThinkingAnswer('');
    }
    setIsCorrectDisplay(null);
    setShowPaws(false);
  }, []);




  // ── Initialize session on mount ──────────
  useEffect(() => {
    if (!chapter || !chapterId || initializedRef.current) return;
    initializedRef.current = true;

    // Start game session
    gameStore.startSession(chapterId);
    timer.start();

    // Generate the first exercise
    const firstExercise = generateExercise(chapter.difficultyLevel);
    gameStore.setCurrentExercise(firstExercise);
    resetInputForExercise(firstExercise);

    // Start background music
    music.start();

    // Speak greeting from the character (narrative engine: first person, no narrator)
    const greetingLine = getRandomLine(chapter.animal.id, 'greeting');
    if (greetingLine) {
      setAnimalState(greetingLine.emotion);
      showBubble(greetingLine, () => {
        exerciseHook.startExercise(firstExercise);
      });
    } else {
      setAnimalState('idle');
      exerciseHook.startExercise(firstExercise);
    }
  }, [chapter, chapterId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handle digit input (calculator-style: left-to-right) ─
  const handleDigit = useCallback(
    (digit: number) => {
      if (exerciseHook.phase !== 'playing') return;
      sound.playClick();
      const exercise = exerciseHook.exercise;
      if (!exercise || exercise.type !== 'vertical') {
        // Thinking exercise: build number string
        if (thinkingAnswer.length < 4) {
          setThinkingAnswer((prev) => prev + String(digit));
        }
        return;
      }

      // Vertical exercise: append digit naturally (like typing a number)
      const vertExercise = exercise as VerticalExercise;
      const maxDigits = vertExercise.digits + 1;

      setTypedDigits((prev) => {
        if (prev.length >= maxDigits) return prev; // already full
        return [...prev, digit];
      });

      // Show carry indicator once the user starts typing
      if (vertExercise.hasCarry && !showCarry) {
        const onesA = vertExercise.operandA % 10;
        const onesB = vertExercise.operandB % 10;
        if (onesA + onesB >= 10) {
          setShowCarry(true);
        }
      }
    },
    [exerciseHook.phase, exerciseHook.exercise, thinkingAnswer, showCarry, sound],
  );

  // ── Handle delete ────────────────────────
  const handleDelete = useCallback(() => {
    if (exerciseHook.phase !== 'playing') return;
    const exercise = exerciseHook.exercise;
    if (!exercise) return;

    if (exercise.type !== 'vertical') {
      // Thinking exercise: remove last character
      setThinkingAnswer((prev) => prev.slice(0, -1));
      return;
    }

    // Vertical exercise: remove the last typed digit (natural backspace)
    setTypedDigits((prev) => prev.slice(0, -1));
  }, [exerciseHook.phase, exerciseHook.exercise]);

  // ── Handle submit ────────────────────────
  const handleSubmit = useCallback(() => {
    if (exerciseHook.phase !== 'playing') return;
    const exercise = exerciseHook.exercise;
    if (!exercise) return;

    let userAnswer: number;

    if (exercise.type === 'vertical') {
      if (typedDigits.length === 0) return;
      // Parse typed digits as a natural number (left-to-right = "16" → 16)
      userAnswer = parseInt(typedDigits.join(''), 10);
    } else {
      // Thinking exercise
      if (thinkingAnswer.length === 0) return;
      userAnswer = parseInt(thinkingAnswer, 10);
      if (isNaN(userAnswer)) return;
    }

    // Submit to the exercise hook (evaluates correctness)
    exerciseHook.submitAnswer(userAnswer);
  }, [exerciseHook, typedDigits, thinkingAnswer]);

  // ── React to answer result from hook ─────
  useEffect(() => {
    if (!exerciseHook.lastResult || !exerciseHook.exercise || !chapter) return;
    const result = exerciseHook.lastResult;

    if (result.correct && exerciseHook.phase === 'feedback') {
      // CORRECT ANSWER
      setIsCorrectDisplay(true);
      sound.playCorrect();

      // Speak celebration from character (narrative engine)
      const celebLine = getRandomLine(chapter.animal.id, 'correct');
      if (celebLine) {
        setAnimalState(celebLine.emotion);
        showBubble(celebLine);
      } else {
        setAnimalState('celebrating');
      }

      // Show paws
      setPawsEarned(result.pawsEarned);
      setShowPaws(true);

      // Update game store
      gameStore.submitAnswer(result);

      // After delay, determine next step (read fresh state to avoid stale closures)
      feedbackTimeoutRef.current = setTimeout(() => {
        const freshState = useGameStore.getState();
        const progress = freshState.progress.chapters[chapterId!];
        if (!progress) return;

        const currentStageData = chapter.stages.find((s) => s.order === progress.currentStage);
        const exercisesRequired = currentStageData?.exercisesRequired ?? EXERCISES_PER_STAGE[0];
        const exercisesCompleted = progress.exercisesInCurrentStage;

        if (exercisesCompleted >= exercisesRequired) {
          // Stage complete -- check if it was the last stage
          const isLastStage = progress.currentStage >= chapter.stages.length;
          if (isLastStage) {
            exerciseHook.goToChapterComplete();
          } else {
            exerciseHook.goToStageComplete();
          }
        } else {
          // Generate next exercise
          const nextExercise = generateExercise(chapter.difficultyLevel);
          gameStore.setCurrentExercise(nextExercise);
          resetInputForExercise(nextExercise);
          setAnimalState('idle');
          setShowPaws(false);
          exerciseHook.startExercise(nextExercise);
        }
      }, FEEDBACK_DELAY_MS);
    } else if (!result.correct && exerciseHook.phase === 'playing') {
      // WRONG ANSWER
      setIsCorrectDisplay(false);
      sound.playWrong();

      // Speak encouragement from character (narrative engine)
      const encourageLine = getRandomLine(chapter.animal.id, 'incorrect');
      if (encourageLine) {
        setAnimalState(encourageLine.emotion);
        showBubble(encourageLine);
      } else {
        setAnimalState('hiding');
      }

      // After brief shake, clear input and reset animal
      wrongTimeoutRef.current = setTimeout(() => {
        setIsCorrectDisplay(null);

        // Clear input so they start fresh
        if (exerciseHook.exercise) {
          resetInputForExercise(exerciseHook.exercise);
        }
      }, WRONG_SHAKE_MS);

      // Animal recovers after a bit longer
      setTimeout(() => {
        setAnimalState('idle');
      }, WRONG_ANIMAL_HIDE_MS);
    }
  }, [exerciseHook.lastResult, exerciseHook.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handle hint request (narrative engine: character gives hints in first person) ──
  const handleRequestHint = useCallback(() => {
    if (exerciseHook.phase !== 'playing' || !chapter) return;
    const hintLevel = exerciseHook.requestHint();
    const characterId = chapter.animal.id;

    // Get hint from character's dialogue bank
    const hintCategory = `hint${Math.min(hintLevel, 4)}` as 'hint1' | 'hint2' | 'hint3' | 'hint4';
    let hintLine = getRandomLine(characterId, hintCategory);

    // For level 4 hints, fill in specific value placeholders
    if (hintLine && hintLevel >= 4) {
      const exercise = exerciseHook.exercise;
      if (exercise) {
        const correctAnswer = getCorrectAnswer(exercise);
        hintLine = formatDialogue(hintLine, {
          min: String(Math.max(0, correctAnswer - 5)),
          max: String(correctAnswer + 5),
          nearAnswer: String(correctAnswer + (Math.random() < 0.5 ? 1 : -1)),
        });
      }
    }

    if (hintLine) {
      setAnimalState(hintLine.emotion);
      showBubble(hintLine, () => {
        setAnimalState('idle');
      });
    }
  }, [exerciseHook, showBubble, chapter]);

  // ── Stage complete handler ───────────────
  const handleStageComplete = useCallback(() => {
    if (!chapter || !chapterId) return;
    sound.playStageComplete();
    gameStore.advanceStage();

    // Generate next exercise for the new stage
    const nextExercise = generateExercise(chapter.difficultyLevel);
    gameStore.setCurrentExercise(nextExercise);
    resetInputForExercise(nextExercise);
    setAnimalState('idle');
    setShowPaws(false);

    // Start the next exercise
    exerciseHook.startExercise(nextExercise);
  }, [chapter, chapterId, gameStore, resetInputForExercise, exerciseHook]);

  // ── Chapter complete handler ─────────────
  const handleChapterComplete = useCallback(() => {
    if (!chapterId) return;
    sound.playChapterComplete();
    gameStore.completeChapter();
    timer.pause();
    navigate('/');
  }, [chapterId, gameStore, timer, navigate]);

  // ── Early return if no chapter ───────────
  if (!chapter || !chapterId) {
    return null;
  }

  // ── Derived state ────────────────────────
  const chapterProgress = gameStore.progress.chapters[chapterId];
  const currentStageNum = chapterProgress?.currentStage ?? 1;
  const exercisesInCurrentStage = chapterProgress?.exercisesInCurrentStage ?? 0;
  const currentStageData = chapter.stages.find((s) => s.order === currentStageNum);
  const exercisesRequired = currentStageData?.exercisesRequired ?? EXERCISES_PER_STAGE[0];
  const currentExercise = exerciseHook.exercise;
  const isVertical = currentExercise?.type === 'vertical';
  const phase = exerciseHook.phase;

  // Compute positional digits for VerticalOperation display (calculator-style right-aligned)
  const verticalEx = isVertical && currentExercise ? (currentExercise as VerticalExercise) : null;
  const numCols = verticalEx ? verticalEx.digits + 1 : 0;
  const displayUserDigits = typedToPositional(typedDigits, numCols);
  // Always highlight ones position (rightmost cell) as the "typing target"
  const displayActiveIndex = typedDigits.length < numCols ? 0 : -1;
  const progressPercent = exercisesRequired > 0
    ? (exercisesInCurrentStage / exercisesRequired) * 100
    : 0;

  // ── Fun fact for stage complete ──────────
  const currentStageFunFact = currentStageData?.funFact?.text;

  return (
    <motion.div
      className="flex flex-col h-[100dvh] w-full overflow-hidden bg-cream"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {/* ── Top: Progress Trail ── */}
      <div className="flex-shrink-0 pt-safe px-2 pt-1">
        <ProgressTrail
          stages={chapter.stages.map((s) => ({ title: s.title, order: s.order }))}
          currentStage={currentStageNum}
          exercisesInStage={exercisesInCurrentStage}
          exercisesRequired={exercisesRequired}
        />
      </div>

      {/* ── Main: Two-column layout ── */}
      <div className="flex-1 flex min-h-0">
        {/* ═══ Left Column: Character + Progress ═══ */}
        <div className="w-[38%] flex flex-col items-center px-1 pb-2">
          {/* Speech bubble */}
          {bubbleVisible && (
            <div className="flex-shrink-0 w-full px-1 pt-1">
              <SpeechBubble
                text={bubbleText}
                visible={bubbleVisible}
                speaker={bubbleSpeaker}
                position="above"
                className="text-xs"
              />
            </div>
          )}

          {/* Character trail area */}
          <div className="flex-1 flex flex-col items-center justify-end w-full relative">
            {/* Vertical trail line */}
            <div className="absolute top-4 bottom-8 left-1/2 -translate-x-1/2 w-0.5 bg-forest-200/40 pointer-events-none" />

            {/* Trail milestone markers */}
            <div className="absolute top-4 bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center justify-between pointer-events-none">
              {Array.from({ length: exercisesRequired }, (_, i) => {
                const idx = exercisesRequired - 1 - i;
                return (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${
                      idx < exercisesInCurrentStage
                        ? 'bg-forest-400 border-forest-500 scale-110'
                        : 'bg-white/60 border-forest-200'
                    }`}
                  />
                );
              })}
            </div>

            {/* Pudú character — moves up as exercises are completed */}
            <motion.div
              className="relative z-10"
              animate={{ y: -(progressPercent / 100) * 200 }}
              transition={{ type: 'spring' as const, stiffness: 80, damping: 18 }}
            >
              <Pudu
                state={animalState}
                size="lg"
                direction="right"
              />
            </motion.div>

            {/* Paw prints earned (shown during feedback) */}
            <AnimatePresence>
              {showPaws && phase === 'feedback' && (
                <motion.div
                  className="mt-1 relative z-10"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
                >
                  <PawPrints count={pawsEarned} animate size="sm" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ═══ Right Column: Exercise + Controls ═══ */}
        <div className="w-[62%] flex flex-col items-center py-1 pr-2">
          {/* Exercise display — fills available space */}
          <div className="flex-1 flex items-center justify-center min-h-0 w-full">
            <AnimatePresence mode="wait">
              {currentExercise && phase === 'playing' && (
                <motion.div
                  key={currentExercise.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center"
                >
                  {isVertical ? (
                    <VerticalOperation
                      operandA={(currentExercise as VerticalExercise).operandA}
                      operandB={(currentExercise as VerticalExercise).operandB}
                      operation={
                        (currentExercise as VerticalExercise).operation === 'addition'
                          ? '+'
                          : '-'
                      }
                      digits={(currentExercise as VerticalExercise).digits}
                      hasCarry={(currentExercise as VerticalExercise).hasCarry}
                      hasBorrow={(currentExercise as VerticalExercise).hasBorrow}
                      userDigits={displayUserDigits}
                      activeDigitIndex={displayActiveIndex}
                      showCarryIndicator={showCarry}
                      isCorrect={isCorrectDisplay}
                    />
                  ) : (
                    <ThinkingExerciseDisplay
                      exercise={currentExercise}
                      answer={thinkingAnswer}
                    />
                  )}
                </motion.div>
              )}

              {currentExercise && phase === 'feedback' && isVertical && (
                <motion.div
                  key={`feedback-${currentExercise.id}`}
                  className="flex flex-col items-center"
                >
                  <VerticalOperation
                    operandA={(currentExercise as VerticalExercise).operandA}
                    operandB={(currentExercise as VerticalExercise).operandB}
                    operation={
                      (currentExercise as VerticalExercise).operation === 'addition'
                        ? '+'
                        : '-'
                    }
                    digits={(currentExercise as VerticalExercise).digits}
                    hasCarry={(currentExercise as VerticalExercise).hasCarry}
                    hasBorrow={(currentExercise as VerticalExercise).hasBorrow}
                    userDigits={displayUserDigits}
                    activeDigitIndex={displayActiveIndex}
                    showCarryIndicator={showCarry}
                    isCorrect={true}
                  />
                </motion.div>
              )}

              {currentExercise && phase === 'feedback' && !isVertical && (
                <motion.div
                  key={`feedback-thinking-${currentExercise.id}`}
                  className="flex flex-col items-center"
                >
                  <ThinkingExerciseDisplay
                    exercise={currentExercise}
                    answer={thinkingAnswer}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls: Hint + NumberPad */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1 pb-safe pb-1">
            {phase === 'playing' && (
              <HintButton
                hintsUsed={exerciseHook.hintsUsed}
                maxHints={MAX_HINTS}
                onRequestHint={handleRequestHint}
                disabled={phase !== 'playing'}
              />
            )}
            <NumberPad
              onDigit={handleDigit}
              onDelete={handleDelete}
              onSubmit={handleSubmit}
              disabled={phase !== 'playing'}
            />
          </div>
        </div>
      </div>

      {/* ── Stage Complete Overlay ── */}
      <AnimatePresence>
        {phase === 'stage_complete' && (
          <CelebrationOverlay
            type="stage_complete"
            animalName={chapter.animal.name}
            stageName={currentStageData?.title}
            funFact={currentStageFunFact}
            onContinue={handleStageComplete}
          />
        )}
      </AnimatePresence>

      {/* ── Chapter Complete Overlay ── */}
      <AnimatePresence>
        {phase === 'chapter_complete' && (
          <CelebrationOverlay
            type="chapter_complete"
            animalName={chapter.animal.name}
            badgeTitle={`Amiga del ${chapter.animal.species}`}
            funFact={chapter.completionFact}
            onContinue={handleChapterComplete}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
