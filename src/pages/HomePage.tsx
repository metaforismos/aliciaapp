import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { chapters } from '../data/chapters';
import { useGameStore } from '../store/useGameStore';

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
// Animal emojis / icons per chapter
// ────────────────────────────────────────────

const ANIMAL_EMOJI: Record<string, string> = {
  'ch1-pudu': '\uD83E\uDD8C',       // deer
  'ch2-bandurria': '\uD83E\uDDA9',  // flamingo-ish
  'ch3-zorro': '\uD83E\uDD8A',      // fox
  'ch4-monito': '\uD83D\uDC35',     // monkey
  'ch5-guina': '\uD83D\uDC31',      // cat
  'ch6-chungungo': '\uD83E\uDDA6',  // otter
};

const ANIMAL_COLOR: Record<string, string> = {
  'ch1-pudu': 'bg-earth-500',
  'ch2-bandurria': 'bg-sunset-500',
  'ch3-zorro': 'bg-earth-700',
  'ch4-monito': 'bg-forest-600',
  'ch5-guina': 'bg-river-700',
  'ch6-chungungo': 'bg-river-500',
};

// Operation label for each chapter
const OP_LABEL: Record<string, string> = {
  addition: 'Suma',
  subtraction: 'Resta',
  mixed: 'Suma y Resta',
};

// ────────────────────────────────────────────
// Stagger animation for chapter cards
// ────────────────────────────────────────────

const listContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  initial: { opacity: 0, x: -30, scale: 0.95 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 20,
    },
  },
};

// ────────────────────────────────────────────
// HomePage component
// ────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate();
  const progress = useGameStore((s) => s.progress);

  // Determine which chapters are unlocked
  function isChapterUnlocked(_chapterId: string, order: number): boolean {
    if (order === 1) return true;
    // Find previous chapter
    const prevChapter = chapters.find((ch) => ch.order === order - 1);
    if (!prevChapter) return false;
    const prevProgress = progress.chapters[prevChapter.id];
    return prevProgress?.completed === true;
  }

  function getChapterStageProgress(chapterId: string): number {
    const cp = progress.chapters[chapterId];
    if (!cp) return 0;
    if (cp.completed) return 5;
    return Math.max(0, cp.currentStage - 1);
  }

  return (
    <motion.div
      className="flex flex-col h-full w-full overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, var(--color-forest-900) 0%, var(--color-forest-600) 100%)',
      }}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {/* ── Header ── */}
      <div className="flex flex-col items-center pt-10 pb-4 px-6 shrink-0">
        <motion.h1
          className="text-2xl font-display font-extrabold text-white tracking-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Las aventuras de Alicia
        </motion.h1>
        <motion.p
          className="text-earth-300 font-display text-lg font-semibold mt-0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          en Chiloé
        </motion.p>

        {/* Total paws badge */}
        {progress.totalPaws > 0 && (
          <motion.div
            className="flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-sm">&#x1F43E;</span>
            <span className="text-white/90 text-sm font-bold">{progress.totalPaws}</span>
          </motion.div>
        )}
      </div>

      {/* ── Chapter Cards List ── */}
      <motion.div
        className="flex-1 overflow-y-auto px-4 pb-28 scrollbar-none"
        variants={listContainer}
        initial="initial"
        animate="animate"
      >
        <div className="flex flex-col gap-3 max-w-md mx-auto">
          {chapters.map((chapter) => {
            const unlocked = isChapterUnlocked(chapter.id, chapter.order);
            const stagesDone = getChapterStageProgress(chapter.id);
            const cp = progress.chapters[chapter.id];
            const isCompleted = cp?.completed === true;

            return (
              <motion.button
                key={chapter.id}
                variants={cardVariants}
                className={`relative flex items-center gap-3 rounded-[var(--radius-card)] p-4 text-left transition-all ${
                  unlocked
                    ? 'bg-white/90 backdrop-blur-sm shadow-lg active:scale-[0.98]'
                    : 'bg-white/20 backdrop-blur-sm opacity-60 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (unlocked) navigate(`/chapter/${chapter.id}`);
                }}
                disabled={!unlocked}
                whileTap={unlocked ? { scale: 0.97 } : undefined}
              >
                {/* Animal circle */}
                <div
                  className={`shrink-0 flex items-center justify-center w-14 h-14 rounded-full shadow-md ${
                    unlocked ? ANIMAL_COLOR[chapter.id] || 'bg-forest-500' : 'bg-gray-400'
                  }`}
                >
                  <span className="text-2xl">
                    {unlocked
                      ? ANIMAL_EMOJI[chapter.id] || chapter.animal.name[0]
                      : '\uD83D\uDD12'}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-bold truncate ${
                      unlocked ? 'text-bark' : 'text-bark/50'
                    }`}
                  >
                    {chapter.title}
                  </p>
                  <p
                    className={`text-xs mt-0.5 truncate ${
                      unlocked ? 'text-bark/60' : 'text-bark/30'
                    }`}
                  >
                    {chapter.animal.name} &middot; {OP_LABEL[chapter.operation] || chapter.operation} &middot; Nivel {chapter.difficultyLevel}
                  </p>
                </div>

                {/* Progress dots */}
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full ${
                          i < stagesDone
                            ? isCompleted
                              ? 'bg-forest-500'
                              : 'bg-sunset-500'
                            : unlocked
                            ? 'bg-gray-300'
                            : 'bg-gray-400/50'
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-[10px] font-semibold ${
                      unlocked ? 'text-bark/40' : 'text-bark/20'
                    }`}
                  >
                    {stagesDone}/5
                  </span>
                </div>

                {/* Completed badge */}
                {isCompleted && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-forest-500 flex items-center justify-center shadow-md"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M3 7l3 3 5-6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Bottom bar ── */}
      <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-4 pb-6 pt-4 bg-gradient-to-t from-forest-900/90 via-forest-900/60 to-transparent">
        <motion.button
          className="game-button bg-river-500 text-white py-3 px-6 shadow-lg text-sm font-bold"
          onClick={() => navigate('/refuge')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          &#x1F3E0; El Refugio
        </motion.button>

        <motion.button
          className="game-button bg-white/15 backdrop-blur-sm text-white/70 py-3 px-4 text-sm"
          onClick={() => navigate('/parent')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          aria-label="Panel parental"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM6 9a4 4 0 018 0v1H6V9zM3.5 14.5A1.5 1.5 0 015 13h10a1.5 1.5 0 011.5 1.5v.5A2.5 2.5 0 0114 17.5H6A2.5 2.5 0 013.5 15v-.5z"
              fill="currentColor"
              fillOpacity={0.7}
            />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}
