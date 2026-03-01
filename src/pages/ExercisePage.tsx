import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import VerticalOperation from '../components/exercises/VerticalOperation';
import NumberPad from '../components/exercises/NumberPad';
import CelebrationOverlay from '../components/gamification/CelebrationOverlay';
import PawPrints from '../components/gamification/PawPrints';
import HeaderBar from '../components/ui/HeaderBar';
import StageScene from '../components/ui/StageScene';
import BottomBar from '../components/ui/BottomBar';
import MissionModal from '../components/ui/MissionModal';
import RewardsPanel from '../components/ui/RewardsPanel';
import ExitConfirmModal from '../components/ui/ExitConfirmModal';

import { useExercise } from '../hooks/useExercise';
import { useVoice } from '../hooks/useVoice';
import { useTimer } from '../hooks/useTimer';
import { useSound } from '../hooks/useSound';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { useGameStore } from '../store/useGameStore';
import { useSettingsStore } from '../store/useSettingsStore';

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

// Animal emoji mapping (matches HomePage)
const ANIMAL_EMOJI: Record<string, string> = {
  'ch1-pudu': '🦌',
  'ch2-bandurria': '🦩',
  'ch3-zorro': '🦊',
  'ch4-monito': '🐵',
  'ch5-guina': '🐱',
  'ch6-chungungo': '🦦',
};

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
// Helper: convert typed digits (natural left-to-right order) to
// positional array for VerticalOperation display [ones, tens, hundreds, ...]
// ────────────────────────────────────────────

function typedToPositional(typed: number[], cols: number): (number | null)[] {
  const result: (number | null)[] = new Array(cols).fill(null);
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
// DialogBox — clue/dialogue area at top of right panel
// ────────────────────────────────────────────

function DialogBox({
  text,
  speaker,
  visible,
}: {
  text: string;
  speaker: string;
  visible: boolean;
}) {
  return (
    <AnimatePresence>
      {visible && text && (
        <motion.div
          className="w-full bg-white/95 backdrop-blur-sm rounded-xl border border-forest-100 px-3 py-2 shadow-sm"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {speaker && (
            <p className="text-[9px] font-bold text-forest-600 uppercase tracking-wider mb-0.5">
              {speaker}
            </p>
          )}
          <p className="text-xs text-bark/80 leading-relaxed">{text}</p>
        </motion.div>
      )}
    </AnimatePresence>
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
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);
  const sound = useSound({ enabled: soundEnabled });
  const music = useBackgroundMusic();
  const gameStore = useGameStore();

  // ── Chapter data ─────────────────────────
  const chapter = chapterId ? getChapterById(chapterId) : undefined;

  // ── Animal state ─────────────────────────
  const [animalState, setAnimalState] = useState<AnimalAnimationState>('idle');

  // ── Dialog box (replaces SpeechBubble) ───
  const [dialogText, setDialogText] = useState('');
  const [dialogSpeaker, setDialogSpeaker] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);

  // ── Vertical exercise digit input (calculator-style: type left-to-right) ──
  const [typedDigits, setTypedDigits] = useState<number[]>([]);
  const [showCarry, setShowCarry] = useState(false);
  const [isCorrectDisplay, setIsCorrectDisplay] = useState<boolean | null>(null);

  // ── Thinking exercise input ──────────────
  const [thinkingAnswer, setThinkingAnswer] = useState('');

  // ── Paw display for feedback ─────────────
  const [showPaws, setShowPaws] = useState(false);
  const [pawsEarned, setPawsEarned] = useState<1 | 2 | 3>(3);

  // ── Modal states (bottom bar) ────────────
  const [showMission, setShowMission] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

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

  // ── Show dialog with character identity + voice ──
  const showDialog = useCallback(
    (dialogueLine: DialogueLine, onEnd?: () => void) => {
      setDialogText(dialogueLine.text);
      setDialogSpeaker(dialogueLine.speaker);
      setDialogVisible(true);

      const charVoice = chapter?.animal.id
        ? CHARACTER_VOICE_CONFIGS[chapter.animal.id]
        : undefined;
      const voiceOverride = dialogueLine.voiceConfig ?? charVoice;

      voice.speak(dialogueLine.text, () => {
        setTimeout(() => {
          setDialogVisible(false);
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

  // ── Sound toggle handler ─────────────────
  const handleToggleSound = useCallback(() => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    if (newState) {
      music.start();
    } else {
      music.stop();
    }
  }, [soundEnabled, setSoundEnabled, music]);

  // ── Initialize session on mount ──────────
  useEffect(() => {
    if (!chapter || !chapterId || initializedRef.current) return;
    initializedRef.current = true;

    gameStore.startSession(chapterId);
    timer.start();

    const firstExercise = generateExercise(chapter.difficultyLevel);
    gameStore.setCurrentExercise(firstExercise);
    resetInputForExercise(firstExercise);

    // Start background music (respect sound setting)
    if (soundEnabled) {
      music.start();
    }

    // Speak greeting from the character
    const greetingLine = getRandomLine(chapter.animal.id, 'greeting');
    if (greetingLine) {
      setAnimalState(greetingLine.emotion);
      showDialog(greetingLine, () => {
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
        if (thinkingAnswer.length < 4) {
          setThinkingAnswer((prev) => prev + String(digit));
        }
        return;
      }

      const vertExercise = exercise as VerticalExercise;
      const maxDigits = vertExercise.digits + 1;

      setTypedDigits((prev) => {
        if (prev.length >= maxDigits) return prev;
        return [...prev, digit];
      });

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
      setThinkingAnswer((prev) => prev.slice(0, -1));
      return;
    }

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
      userAnswer = parseInt(typedDigits.join(''), 10);
    } else {
      if (thinkingAnswer.length === 0) return;
      userAnswer = parseInt(thinkingAnswer, 10);
      if (isNaN(userAnswer)) return;
    }

    exerciseHook.submitAnswer(userAnswer);
  }, [exerciseHook, typedDigits, thinkingAnswer]);

  // ── React to answer result from hook ─────
  useEffect(() => {
    if (!exerciseHook.lastResult || !exerciseHook.exercise || !chapter) return;
    const result = exerciseHook.lastResult;

    if (result.correct && exerciseHook.phase === 'feedback') {
      setIsCorrectDisplay(true);
      sound.playCorrect();

      const celebLine = getRandomLine(chapter.animal.id, 'correct');
      if (celebLine) {
        setAnimalState(celebLine.emotion);
        showDialog(celebLine);
      } else {
        setAnimalState('celebrating');
      }

      setPawsEarned(result.pawsEarned);
      setShowPaws(true);

      gameStore.submitAnswer(result);

      feedbackTimeoutRef.current = setTimeout(() => {
        const freshState = useGameStore.getState();
        const progress = freshState.progress.chapters[chapterId!];
        if (!progress) return;

        const currentStageData = chapter.stages.find((s) => s.order === progress.currentStage);
        const exercisesRequired = currentStageData?.exercisesRequired ?? EXERCISES_PER_STAGE[0];
        const exercisesCompleted = progress.exercisesInCurrentStage;

        if (exercisesCompleted >= exercisesRequired) {
          const isLastStage = progress.currentStage >= chapter.stages.length;
          if (isLastStage) {
            exerciseHook.goToChapterComplete();
          } else {
            exerciseHook.goToStageComplete();
          }
        } else {
          const nextExercise = generateExercise(chapter.difficultyLevel);
          gameStore.setCurrentExercise(nextExercise);
          resetInputForExercise(nextExercise);
          setAnimalState('idle');
          setShowPaws(false);
          exerciseHook.startExercise(nextExercise);
        }
      }, FEEDBACK_DELAY_MS);
    } else if (!result.correct && exerciseHook.phase === 'playing') {
      setIsCorrectDisplay(false);
      sound.playWrong();

      const encourageLine = getRandomLine(chapter.animal.id, 'incorrect');
      if (encourageLine) {
        setAnimalState(encourageLine.emotion);
        showDialog(encourageLine);
      } else {
        setAnimalState('hiding');
      }

      wrongTimeoutRef.current = setTimeout(() => {
        setIsCorrectDisplay(null);
        if (exerciseHook.exercise) {
          resetInputForExercise(exerciseHook.exercise);
        }
      }, WRONG_SHAKE_MS);

      setTimeout(() => {
        setAnimalState('idle');
      }, WRONG_ANIMAL_HIDE_MS);
    }
  }, [exerciseHook.lastResult, exerciseHook.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handle hint request ──────────────────
  const handleRequestHint = useCallback(() => {
    if (exerciseHook.phase !== 'playing' || !chapter) return;
    const hintLevel = exerciseHook.requestHint();
    const characterId = chapter.animal.id;

    const hintCategory = `hint${Math.min(hintLevel, 4)}` as 'hint1' | 'hint2' | 'hint3' | 'hint4';
    let hintLine = getRandomLine(characterId, hintCategory);

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
      showDialog(hintLine, () => {
        setAnimalState('idle');
      });
    }
  }, [exerciseHook, showDialog, chapter]);

  // ── Stage complete handler ───────────────
  const handleStageComplete = useCallback(() => {
    if (!chapter || !chapterId) return;
    sound.playStageComplete();
    gameStore.advanceStage();

    const nextExercise = generateExercise(chapter.difficultyLevel);
    gameStore.setCurrentExercise(nextExercise);
    resetInputForExercise(nextExercise);
    setAnimalState('idle');
    setShowPaws(false);

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

  // ── Exit handler ─────────────────────────
  const handleExitConfirm = useCallback(() => {
    music.stop();
    timer.pause();
    navigate('/');
  }, [music, timer, navigate]);

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

  // Compute positional digits for VerticalOperation display
  const verticalEx = isVertical && currentExercise ? (currentExercise as VerticalExercise) : null;
  const numCols = verticalEx ? verticalEx.digits + 1 : 0;
  const displayUserDigits = typedToPositional(typedDigits, numCols);
  const displayActiveIndex = typedDigits.length < numCols ? 0 : -1;

  // ── Fun fact for stage complete ──────────
  const currentStageFunFact = currentStageData?.funFact?.text;

  // ── Bottom bar visibility (hide during celebrations) ──
  const bottomBarVisible = phase !== 'stage_complete' && phase !== 'chapter_complete';

  return (
    <motion.div
      className="flex flex-col h-[100dvh] w-full overflow-hidden bg-cream"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {/* ── Header Bar ── */}
      <HeaderBar
        stageName={currentStageData?.title ?? ''}
        stageOrder={currentStageNum}
      />

      {/* ── Main: Two-column layout ── */}
      <div className="flex-1 flex min-h-0 overflow-hidden pb-[64px]">
        {/* ═══ Left Column: Stage Scene ═══ */}
        <div className="w-[45%] relative h-full overflow-hidden">
          <StageScene
            backgroundTheme={chapter.backgroundTheme}
            animalState={animalState}
            exercisesCompleted={exercisesInCurrentStage}
            exercisesRequired={exercisesRequired}
          />
          {/* Paw prints during feedback — floating over scene */}
          <AnimatePresence>
            {showPaws && phase === 'feedback' && (
              <motion.div
                className="absolute bottom-20 left-[10%] z-20"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <PawPrints count={pawsEarned} animate size="sm" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══ Right Column: Dialog + Exercise + Controls ═══ */}
        <div className="w-[55%] h-full flex flex-col items-center py-1 pr-2 pl-1 overflow-hidden">
          {/* Dialog box (clues, character speech) */}
          <div className="flex-shrink-0 w-full mb-1">
            <DialogBox
              text={dialogText}
              speaker={dialogSpeaker}
              visible={dialogVisible}
            />
          </div>

          {/* Exercise display — shrinks to fit, allowing numpad space */}
          <div className="flex-1 flex items-center justify-center min-h-0 w-full overflow-hidden">
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

          {/* Controls: NumberPad only (Hint moved to BottomBar) */}
          <div className="flex-shrink-0 flex flex-col items-center pb-1">
            <NumberPad
              onDigit={handleDigit}
              onDelete={handleDelete}
              onSubmit={handleSubmit}
              disabled={phase !== 'playing'}
            />
          </div>
        </div>
      </div>

      {/* ── Bottom Navigation Bar ── */}
      <BottomBar
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenMission={() => setShowMission(true)}
        hintsUsed={exerciseHook.hintsUsed}
        maxHints={MAX_HINTS}
        onRequestHint={handleRequestHint}
        hintDisabled={phase !== 'playing'}
        onOpenRewards={() => setShowRewards(true)}
        onExit={() => setShowExitConfirm(true)}
        visible={bottomBarVisible}
      />

      {/* ── Mission Modal ── */}
      <MissionModal
        isOpen={showMission}
        onClose={() => setShowMission(false)}
        chapterTitle={chapter.title}
        animalName={chapter.animal.name}
        animalEmoji={ANIMAL_EMOJI[chapterId] ?? '🐾'}
        stageName={currentStageData?.title ?? ''}
        stageOrder={currentStageNum}
        stageDescription={currentStageData?.description ?? ''}
        exercisesCompleted={exercisesInCurrentStage}
        exercisesRequired={exercisesRequired}
        totalPaws={chapterProgress?.totalPaws ?? 0}
      />

      {/* ── Rewards Panel ── */}
      <RewardsPanel
        isOpen={showRewards}
        onClose={() => setShowRewards(false)}
        totalPaws={gameStore.progress.totalPaws}
        chapterProgress={gameStore.progress.chapters}
        achievements={gameStore.progress.achievements}
        streak={gameStore.progress.streak}
      />

      {/* ── Exit Confirmation ── */}
      <ExitConfirmModal
        isOpen={showExitConfirm}
        onConfirm={handleExitConfirm}
        onCancel={() => setShowExitConfirm(false)}
      />

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
