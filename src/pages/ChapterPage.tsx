import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getChapterById } from '../data/chapters';
import { useGameStore } from '../store/useGameStore';
import Pudu from '../components/animals/Pudu';
import SpeechBubble from '../components/ui/SpeechBubble';
import ProgressTrail from '../components/gamification/ProgressTrail';

// ────────────────────────────────────────────
// Page transition
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
// Background gradient map per theme
// ────────────────────────────────────────────

const BACKGROUND_GRADIENTS: Record<string, string> = {
  'bosque-valdiviano':
    'linear-gradient(180deg, var(--color-forest-800) 0%, var(--color-forest-400) 100%)',
  'pradera-humedal':
    'linear-gradient(180deg, var(--color-forest-700) 0%, var(--color-river-400) 100%)',
  'bosque-profundo':
    'linear-gradient(180deg, var(--color-forest-900) 0%, var(--color-forest-600) 100%)',
  'bosque-nocturno':
    'linear-gradient(180deg, var(--color-forest-900) 0%, var(--color-earth-800) 100%)',
  'bosque-noche-estrellada':
    'linear-gradient(180deg, var(--color-river-900) 0%, var(--color-forest-800) 100%)',
  'costa-rocosa':
    'linear-gradient(180deg, var(--color-river-800) 0%, var(--color-river-400) 100%)',
};

// ────────────────────────────────────────────
// Animal color map for placeholder circles
// ────────────────────────────────────────────

const ANIMAL_CIRCLE_COLORS: Record<string, string> = {
  'ch2-bandurria': '#E8943D',
  'ch3-zorro': '#74500f',
  'ch4-monito': '#4A7C2E',
  'ch5-guina': '#2E6B8A',
  'ch6-chungungo': '#4A9CC7',
};

// ────────────────────────────────────────────
// AnimalDisplay: renders Pudu for ch1, colored circle for others
// ────────────────────────────────────────────

function AnimalDisplay({ chapterId, animalName }: { chapterId: string; animalName: string }) {
  if (chapterId === 'ch1-pudu') {
    return <Pudu state="idle" size="lg" direction="right" />;
  }

  // Placeholder for other chapters
  const color = ANIMAL_CIRCLE_COLORS[chapterId] || '#5e9438';
  return (
    <motion.div
      className="flex items-center justify-center rounded-full shadow-lg"
      style={{
        width: 140,
        height: 140,
        background: `radial-gradient(circle at 40% 35%, ${color}dd, ${color})`,
      }}
      animate={{
        y: [0, -4, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <span className="text-white font-display font-extrabold text-4xl drop-shadow-md">
        {animalName.charAt(0)}
      </span>
    </motion.div>
  );
}

// ────────────────────────────────────────────
// ChapterPage component
// ────────────────────────────────────────────

export default function ChapterPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const progress = useGameStore((s) => s.progress);

  const chapter = chapterId ? getChapterById(chapterId) : undefined;

  if (!chapter) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-full gap-4 p-6 bg-forest-800"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        <p className="text-white text-lg font-body">Capitulo no encontrado</p>
        <button
          className="game-button bg-forest-200 text-bark py-3 px-6"
          onClick={() => navigate('/')}
        >
          Volver al Bosque
        </button>
      </motion.div>
    );
  }

  // Chapter progress from store
  const cp = progress.chapters[chapter.id];
  const currentStage = cp?.currentStage ?? 1;
  const exercisesInStage = cp?.exercisesInCurrentStage ?? 0;
  const totalPaws = cp?.totalPaws ?? 0;
  const isCompleted = cp?.completed === true;

  // Current stage data
  const stageData = chapter.stages.find((s) => s.order === currentStage);
  const exercisesRequired = stageData?.exercisesRequired ?? 5;

  // Determine which text to show in the speech bubble
  const bubbleText =
    !cp || (currentStage === 1 && exercisesInStage === 0)
      ? chapter.storyIntro
      : isCompleted
      ? chapter.completionFact
      : stageData?.description ?? '';

  // Background gradient
  const bg =
    BACKGROUND_GRADIENTS[chapter.backgroundTheme] ||
    BACKGROUND_GRADIENTS['bosque-valdiviano'];

  return (
    <motion.div
      className="flex flex-col h-full w-full overflow-hidden"
      style={{ background: bg }}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {/* ── Top bar ── */}
      <div className="flex items-center px-4 pt-4 pb-2 shrink-0">
        <motion.button
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm"
          onClick={() => navigate('/')}
          whileTap={{ scale: 0.9 }}
          aria-label="Volver al bosque"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M13 4l-6 6 6 6"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>

        <h1 className="flex-1 text-center text-white font-display font-bold text-lg truncate px-2">
          {chapter.title}
        </h1>

        {/* Spacer to balance the back button */}
        <div className="w-10" />
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 scrollbar-none">
        <div className="flex flex-col items-center max-w-md mx-auto">
          {/* Animal character */}
          <motion.div
            className="mt-2 mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 18 }}
          >
            <AnimalDisplay chapterId={chapter.id} animalName={chapter.animal.name} />
          </motion.div>

          {/* Speech bubble */}
          <motion.div
            className="mb-4 w-full flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SpeechBubble text={bubbleText} visible={true} position="above" />
          </motion.div>

          {/* Progress trail */}
          <motion.div
            className="w-full card-game mb-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ProgressTrail
              stages={chapter.stages.map((s) => ({ title: s.title, order: s.order }))}
              currentStage={currentStage}
              exercisesInStage={exercisesInStage}
              exercisesRequired={exercisesRequired}
            />
          </motion.div>

          {/* Stage info card */}
          {stageData && !isCompleted && (
            <motion.div
              className="w-full card-game mb-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-bark font-display font-bold text-base mb-1">
                Etapa {stageData.order}: {stageData.title}
              </p>
              <p className="text-bark/70 font-body text-sm leading-snug mb-4">
                {stageData.description}
              </p>

              <motion.button
                className="game-button bg-sunset-500 text-white py-3.5 px-8 w-full text-base font-bold shadow-lg"
                onClick={() => navigate(`/exercise/${chapter.id}`)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
              >
                Comenzar
              </motion.button>
            </motion.div>
          )}

          {/* Completed state */}
          {isCompleted && (
            <motion.div
              className="w-full card-game mb-4 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              <span className="text-3xl block mb-2">&#x2B50;</span>
              <p className="text-forest-700 font-display font-bold text-base mb-1">
                Capitulo completado
              </p>
              <p className="text-bark/60 font-body text-sm">
                {chapter.completionFact}
              </p>
            </motion.div>
          )}

          {/* Total paws counter */}
          <motion.div
            className="flex items-center gap-2 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="text-lg">&#x1F43E;</span>
            <span className="text-white/80 font-bold text-sm">
              {totalPaws} patitas ganadas
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
