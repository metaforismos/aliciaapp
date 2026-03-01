import { motion, AnimatePresence } from 'framer-motion';

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterTitle: string;
  animalName: string;
  animalEmoji: string;
  stageName: string;
  stageOrder: number;
  stageDescription: string;
  exercisesCompleted: number;
  exercisesRequired: number;
  totalPaws: number;
}

// ────────────────────────────────────────────
// Component
// ────────────────────────────────────────────

export default function MissionModal({
  isOpen,
  onClose,
  chapterTitle,
  animalName,
  animalEmoji,
  stageName,
  stageOrder,
  stageDescription,
  exercisesCompleted,
  exercisesRequired,
  totalPaws,
}: MissionModalProps) {
  const progressPercent = exercisesRequired > 0
    ? Math.round((exercisesCompleted / exercisesRequired) * 100)
    : 0;

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
            className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="text-center mb-4">
              <span className="text-3xl">{animalEmoji}</span>
              <h2 className="text-lg font-bold text-bark mt-1">
                Misión Actual
              </h2>
              <p className="text-xs text-bark/50 font-medium">
                {chapterTitle}
              </p>
            </div>

            {/* Stage info */}
            <div className="bg-forest-50 rounded-xl p-3 mb-4">
              <p className="text-sm font-bold text-forest-700 mb-1">
                Etapa {stageOrder}: {stageName}
              </p>
              <p className="text-xs text-bark/70 leading-relaxed">
                {stageDescription}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-bark/60 mb-1">
                <span>Progreso</span>
                <span className="font-bold text-forest-600">
                  {exercisesCompleted}/{exercisesRequired}
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-forest-400 to-forest-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Paws earned */}
            <div className="flex items-center justify-center gap-2 mb-4 py-2 bg-sunset-50 rounded-lg">
              <span className="text-lg">🐾</span>
              <span className="text-sm font-bold text-sunset-600">
                {totalPaws} patitas ganadas
              </span>
            </div>

            {/* Animal message */}
            <p className="text-center text-xs text-bark/50 italic mb-4">
              ¡{animalName} cuenta contigo para avanzar!
            </p>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-forest-500 hover:bg-forest-600 text-white font-bold rounded-xl text-sm transition-colors touch-manipulation"
            >
              ¡Entendido!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
