import { motion, AnimatePresence } from 'framer-motion';
import {
  SpeakerOnIcon,
  SpeakerOffIcon,
  TargetIcon,
  LightbulbIcon,
  TrophyIcon,
  DoorIcon,
} from './icons';

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

interface BottomBarProps {
  // Sound
  soundEnabled: boolean;
  onToggleSound: () => void;

  // Mission
  onOpenMission: () => void;

  // Clue (hint)
  hintsUsed: number;
  maxHints: number;
  onRequestHint: () => void;
  hintDisabled: boolean;

  // Rewards
  onOpenRewards: () => void;

  // Exit
  onExit: () => void;

  // Visibility (hidden during celebrations)
  visible: boolean;
}

// ────────────────────────────────────────────
// Hint dots (compact version for bottom bar)
// ────────────────────────────────────────────

function HintDots({ hintsUsed, maxHints }: { hintsUsed: number; maxHints: number }) {
  return (
    <div className="flex gap-0.5 justify-center mt-0.5">
      {Array.from({ length: maxHints }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i < hintsUsed ? 'bg-sunset-400' : 'bg-cream/30'
          }`}
        />
      ))}
    </div>
  );
}

// ────────────────────────────────────────────
// Bar button
// ────────────────────────────────────────────

function BarButton({
  icon,
  label,
  onClick,
  disabled = false,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      className={`
        flex flex-col items-center justify-center
        min-w-[52px] min-h-[48px] px-2 py-1
        rounded-lg touch-manipulation select-none
        transition-colors duration-100
        ${disabled
          ? 'text-cream/25 cursor-not-allowed'
          : 'text-cream/80 hover:text-cream active:bg-white/10 cursor-pointer'
        }
      `}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={label}
    >
      {icon}
      <span className="text-[9px] font-semibold mt-0.5 leading-tight">{label}</span>
      {children}
    </motion.button>
  );
}

// ────────────────────────────────────────────
// Main BottomBar component
// ────────────────────────────────────────────

export default function BottomBar({
  soundEnabled,
  onToggleSound,
  onOpenMission,
  hintsUsed,
  maxHints,
  onRequestHint,
  hintDisabled,
  onOpenRewards,
  onExit,
  visible,
}: BottomBarProps) {
  const allHintsUsed = hintsUsed >= maxHints;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 inset-x-0 z-40 bg-[#3E2C1A] rounded-t-xl pb-safe"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center px-2 py-1">
            {/* Left group: Sound, Mission, Clue, Rewards */}
            <div className="flex items-center gap-0.5 flex-1">
              <BarButton
                icon={
                  soundEnabled ? (
                    <SpeakerOnIcon className="w-5 h-5" />
                  ) : (
                    <SpeakerOffIcon className="w-5 h-5" />
                  )
                }
                label={soundEnabled ? 'Sonido' : 'Silencio'}
                onClick={onToggleSound}
              />

              <BarButton
                icon={<TargetIcon className="w-5 h-5" />}
                label="Misión"
                onClick={onOpenMission}
              />

              <BarButton
                icon={<LightbulbIcon className="w-5 h-5" />}
                label="Pista"
                onClick={onRequestHint}
                disabled={hintDisabled || allHintsUsed}
              >
                <HintDots hintsUsed={hintsUsed} maxHints={maxHints} />
              </BarButton>

              <BarButton
                icon={<TrophyIcon className="w-5 h-5" />}
                label="Premios"
                onClick={onOpenRewards}
              />
            </div>

            {/* Right: Exit button (separated) */}
            <BarButton
              icon={<DoorIcon className="w-5 h-5" />}
              label="Salir"
              onClick={onExit}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
