import { motion } from 'framer-motion';

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

interface HintButtonProps {
  hintsUsed: number; // 0-4
  maxHints: number; // 4
  onRequestHint: () => void;
  disabled?: boolean;
  className?: string;
}

// ────────────────────────────────────────────
// Lightbulb SVG icon
// ────────────────────────────────────────────

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Bulb body */}
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
      {/* Light rays */}
      <line x1="12" y1="2" x2="12" y2="0" opacity="0.5" />
      <line x1="4.22" y1="4.22" x2="2.81" y2="2.81" opacity="0.5" />
      <line x1="1" y1="12" x2="3" y2="12" opacity="0.5" />
      <line x1="19.78" y1="4.22" x2="21.19" y2="2.81" opacity="0.5" />
      <line x1="21" y1="12" x2="23" y2="12" opacity="0.5" />
    </svg>
  );
}

// ────────────────────────────────────────────
// Hint dots indicator
// ────────────────────────────────────────────

function HintDots({
  hintsUsed,
  maxHints,
}: {
  hintsUsed: number;
  maxHints: number;
}) {
  return (
    <div className="flex gap-1.5 justify-center mt-1">
      {Array.from({ length: maxHints }).map((_, i) => {
        const isUsed = i < hintsUsed;
        return (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full ${
              isUsed ? 'bg-sunset-500' : 'bg-gray-300'
            }`}
            initial={false}
            animate={
              isUsed
                ? { scale: [1, 1.3, 1], transition: { duration: 0.3 } }
                : {}
            }
          />
        );
      })}
    </div>
  );
}

// ────────────────────────────────────────────
// Pulse animation for when no hints used yet
// ────────────────────────────────────────────

const pulseVariants = {
  idle: {
    scale: [1, 1.06, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
  static: {
    scale: 1,
  },
};

// ────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────

export default function HintButton({
  hintsUsed,
  maxHints,
  onRequestHint,
  disabled = false,
  className = '',
}: HintButtonProps) {
  const allUsed = hintsUsed >= maxHints;
  const isDisabled = disabled || allUsed;
  const shouldPulse = hintsUsed === 0 && !disabled;

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <motion.button
        type="button"
        className={`
          flex items-center justify-center
          w-12 h-12 min-w-[48px] min-h-[48px]
          rounded-full border-2
          touch-manipulation select-none
          transition-colors duration-150
          ${
            isDisabled
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
              : 'bg-sunset-100 border-sunset-300 text-sunset-600 hover:bg-sunset-200 active:bg-sunset-300 cursor-pointer'
          }
        `}
        variants={pulseVariants}
        animate={shouldPulse ? 'idle' : 'static'}
        whileTap={isDisabled ? undefined : { scale: 0.9 }}
        onClick={isDisabled ? undefined : onRequestHint}
        disabled={isDisabled}
        aria-label={
          allUsed
            ? 'No quedan pistas'
            : `Pedir pista (${maxHints - hintsUsed} restantes)`
        }
      >
        <LightbulbIcon className="w-6 h-6" />
      </motion.button>

      <HintDots hintsUsed={hintsUsed} maxHints={maxHints} />
    </div>
  );
}
