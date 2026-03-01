import { motion, AnimatePresence } from 'framer-motion';
import { chapters } from '../../data/chapters';
import type { ChapterProgress, Achievement } from '../../types/game';

// Animal emoji mapping
const ANIMAL_EMOJI: Record<string, string> = {
  'ch1-pudu': '🦌',
  'ch2-bandurria': '🦩',
  'ch3-zorro': '🦊',
  'ch4-monito': '🐵',
  'ch5-guina': '🐱',
  'ch6-chungungo': '🦦',
};

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

interface RewardsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  totalPaws: number;
  chapterProgress: Record<string, ChapterProgress>;
  achievements: Achievement[];
  streak: { currentDays: number; longestStreak: number };
}

// ────────────────────────────────────────────
// Chapter badge card
// ────────────────────────────────────────────

function ChapterBadge({
  emoji,
  animalName,
  completed,
  totalPaws,
}: {
  emoji: string;
  animalName: string;
  completed: boolean;
  totalPaws: number;
}) {
  return (
    <div
      className={`flex flex-col items-center p-2 rounded-xl text-center ${
        completed
          ? 'bg-forest-50 border border-forest-200'
          : 'bg-gray-50 border border-gray-100 opacity-50'
      }`}
    >
      <span className={`text-2xl ${completed ? '' : 'grayscale'}`}>
        {emoji}
      </span>
      <span className="text-[10px] font-bold text-bark/80 mt-1 leading-tight">
        {animalName}
      </span>
      {completed && (
        <span className="text-[9px] text-forest-600 font-medium">
          {totalPaws} 🐾
        </span>
      )}
      {completed && (
        <span className="text-[9px] text-forest-500 mt-0.5">✓ Amiga</span>
      )}
    </div>
  );
}

// ────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────

export default function RewardsPanel({
  isOpen,
  onClose,
  totalPaws,
  chapterProgress,
  achievements,
  streak,
}: RewardsPanelProps) {
  // Map chapters to badge data
  const chapterBadges = chapters.map((ch) => {
    const progress = chapterProgress[ch.id];
    return {
      id: ch.id,
      emoji: ANIMAL_EMOJI[ch.id] ?? '🐾',
      animalName: ch.animal.name,
      completed: progress?.completed ?? false,
      totalPaws: progress?.totalPaws ?? 0,
    };
  });

  const completedCount = chapterBadges.filter((b) => b.completed).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full max-h-[80vh] overflow-y-auto p-5"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="text-center mb-4">
              <span className="text-3xl">🏆</span>
              <h2 className="text-lg font-bold text-bark mt-1">Premios</h2>
            </div>

            {/* Paw summary */}
            <div className="flex items-center justify-center gap-3 mb-4 py-3 bg-sunset-50 rounded-xl">
              <span className="text-3xl">🐾</span>
              <div>
                <p className="text-2xl font-bold text-sunset-600">{totalPaws}</p>
                <p className="text-[10px] text-sunset-500 font-medium -mt-0.5">
                  patitas totales
                </p>
              </div>
            </div>

            {/* Streak */}
            {streak.currentDays > 0 && (
              <div className="flex items-center justify-center gap-2 mb-4 py-2 bg-river-50 rounded-lg">
                <span className="text-lg">🔥</span>
                <span className="text-sm font-bold text-river-600">
                  {streak.currentDays} {streak.currentDays === 1 ? 'día' : 'días'} seguidos
                </span>
                {streak.longestStreak > streak.currentDays && (
                  <span className="text-[10px] text-river-400">
                    (récord: {streak.longestStreak})
                  </span>
                )}
              </div>
            )}

            {/* Chapter badges */}
            <div className="mb-4">
              <h3 className="text-xs font-bold text-bark/60 uppercase tracking-wider mb-2">
                Amigos de Chiloé ({completedCount}/{chapterBadges.length})
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {chapterBadges.map((badge) => (
                  <ChapterBadge
                    key={badge.id}
                    emoji={badge.emoji}
                    animalName={badge.animalName}
                    completed={badge.completed}
                    totalPaws={badge.totalPaws}
                  />
                ))}
              </div>
            </div>

            {/* Achievements */}
            {achievements.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-bold text-bark/60 uppercase tracking-wider mb-2">
                  Logros ({achievements.length})
                </h3>
                <div className="space-y-1.5">
                  {achievements.slice(0, 8).map((ach) => (
                    <div
                      key={ach.id}
                      className="flex items-center gap-2 text-xs bg-gray-50 rounded-lg px-3 py-1.5"
                    >
                      <span className="text-base">⭐</span>
                      <span className="font-medium text-bark/80">{ach.title}</span>
                    </div>
                  ))}
                  {achievements.length > 8 && (
                    <p className="text-[10px] text-bark/40 text-center">
                      +{achievements.length - 8} logros más
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-forest-500 hover:bg-forest-600 text-white font-bold rounded-xl text-sm transition-colors touch-manipulation"
            >
              Cerrar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
