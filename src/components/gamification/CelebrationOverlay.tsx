import { useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PawPrints from './PawPrints';

// ────────────────────────────────────────────
// CelebrationOverlay — full-screen celebration
// stage_complete: confetti + fun fact card
// chapter_complete: dramatic badge reveal
// ────────────────────────────────────────────

interface CelebrationOverlayProps {
  type: 'stage_complete' | 'chapter_complete';
  animalName: string;
  stageName?: string;
  badgeTitle?: string;
  funFact?: string;
  onContinue: () => void;
  className?: string;
}

// ── Confetti particle config ────────────────

const CONFETTI_COLORS = [
  'var(--color-forest-400)',
  'var(--color-forest-600)',
  'var(--color-sunset-400)',
  'var(--color-sunset-500)',
  'var(--color-river-400)',
  'var(--color-river-500)',
  'var(--color-earth-400)',
];

const CONFETTI_COUNT = 28;

interface ConfettiPiece {
  id: number;
  x: number; // start x in vw
  size: number;
  color: string;
  delay: number;
  duration: number;
  rotation: number;
}

function useConfetti(): ConfettiPiece[] {
  return useMemo(
    () =>
      Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 6 + Math.random() * 8,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 0.8,
        duration: 1.8 + Math.random() * 1.5,
        rotation: Math.random() * 720 - 360,
      })),
    [],
  );
}

function Confetti() {
  const pieces = useConfetti();

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            left: `${p.x}%`,
            top: -20,
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{
            y: '110vh',
            rotate: p.rotation,
            opacity: [1, 1, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}

// ── Badge icon (placeholder shield) ─────────

function BadgeIcon() {
  return (
    <svg
      width="80"
      height="96"
      viewBox="0 0 80 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Shield body */}
      <path
        d="M40 4 L72 16 V48 C72 68 56 84 40 92 C24 84 8 68 8 48 V16 L40 4Z"
        fill="var(--color-sunset-500)"
        stroke="var(--color-sunset-700)"
        strokeWidth="2"
      />
      {/* Inner shield */}
      <path
        d="M40 12 L64 22 V46 C64 62 52 76 40 82 C28 76 16 62 16 46 V22 L40 12Z"
        fill="var(--color-forest-500)"
      />
      {/* Star */}
      <path
        d="M40 28 L43.5 38 L54 38 L45.5 44 L49 54 L40 48 L31 54 L34.5 44 L26 38 L36.5 38 Z"
        fill="white"
      />
    </svg>
  );
}

// ── Stage Complete Card ─────────────────────

function StageCompleteCard({
  stageName,
  funFact,
  onContinue,
}: {
  stageName?: string;
  funFact?: string;
  onContinue: () => void;
}) {
  return (
    <motion.div
      className="relative z-10 card-game max-w-sm mx-4 flex flex-col items-center gap-4 text-center"
      initial={{ scale: 0.7, opacity: 0, y: 40 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.2 }}
    >
      {/* Title */}
      <h2 className="text-2xl font-display font-bold text-forest-700">
        {stageName ? `${stageName}` : 'Etapa completada'}
      </h2>

      <p className="text-sunset-600 font-semibold text-sm">
        Patitas ganadas
      </p>
      <PawPrints count={3} animate size="lg" />

      {/* Fun fact */}
      {funFact && (
        <motion.div
          className="bg-forest-100 rounded-xl px-4 py-3 mt-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <p className="text-xs font-bold text-forest-700 mb-1">
            ¿Sabías que...?
          </p>
          <p className="text-sm text-bark/80 leading-snug">{funFact}</p>
        </motion.div>
      )}

      {/* Continue button */}
      <motion.button
        className="game-button bg-forest-500 text-white py-3 px-8 mt-2 w-full"
        onClick={onContinue}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        Continuar
      </motion.button>
    </motion.div>
  );
}

// ── Chapter Complete Card ───────────────────

function ChapterCompleteCard({
  animalName,
  badgeTitle,
  funFact,
  onContinue,
}: {
  animalName: string;
  badgeTitle?: string;
  funFact?: string;
  onContinue: () => void;
}) {
  return (
    <motion.div
      className="relative z-10 card-game max-w-sm mx-4 flex flex-col items-center gap-4 text-center"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 250, damping: 20, delay: 0.3 }}
    >
      {/* Badge reveal */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 14,
          delay: 0.6,
        }}
      >
        <BadgeIcon />
      </motion.div>

      {/* Title */}
      <motion.h2
        className="text-2xl font-display font-bold text-sunset-600"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {badgeTitle || `Amiga del ${animalName}`}
      </motion.h2>

      <motion.p
        className="text-bark/60 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Has completado todas las etapas con {animalName}
      </motion.p>

      {/* Completion fact */}
      {funFact && (
        <motion.div
          className="bg-sunset-100 rounded-xl px-4 py-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <p className="text-sm text-bark/80 leading-snug">{funFact}</p>
        </motion.div>
      )}

      {/* Back to forest button */}
      <motion.button
        className="game-button bg-sunset-500 text-white py-3 px-8 mt-2 w-full"
        onClick={onContinue}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        Volver a Chiloé
      </motion.button>
    </motion.div>
  );
}

// ── Main Overlay ────────────────────────────

export default function CelebrationOverlay({
  type,
  animalName,
  stageName,
  badgeTitle,
  funFact,
  onContinue,
  className = '',
}: CelebrationOverlayProps) {
  const handleContinue = useCallback(() => {
    onContinue();
  }, [onContinue]);

  const isChapter = type === 'chapter_complete';

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <motion.div
          className={`absolute inset-0 ${isChapter ? 'bg-black/40' : 'bg-black/30'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Confetti */}
        <Confetti />

        {/* Card */}
        {isChapter ? (
          <ChapterCompleteCard
            animalName={animalName}
            badgeTitle={badgeTitle}
            funFact={funFact}
            onContinue={handleContinue}
          />
        ) : (
          <StageCompleteCard
            stageName={stageName}
            funFact={funFact}
            onContinue={handleContinue}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
