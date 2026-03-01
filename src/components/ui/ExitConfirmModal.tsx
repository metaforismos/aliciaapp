import { motion, AnimatePresence } from 'framer-motion';

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

interface ExitConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// ────────────────────────────────────────────
// Component
// ────────────────────────────────────────────

export default function ExitConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
}: ExitConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={onCancel}
          />

          {/* Card */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl max-w-xs w-full p-5"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div className="text-center mb-4">
              <span className="text-3xl">🚪</span>
              <h2 className="text-lg font-bold text-bark mt-2">
                ¿Quieres salir?
              </h2>
              <p className="text-xs text-bark/50 mt-1 leading-relaxed">
                Tu progreso en esta etapa se guardará, pero los ejercicios
                pendientes se reiniciarán.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-bark/70 font-bold rounded-xl text-sm transition-colors touch-manipulation"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 py-2.5 bg-sunset-500 hover:bg-sunset-600 text-white font-bold rounded-xl text-sm transition-colors touch-manipulation"
              >
                Salir
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
