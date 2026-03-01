import { motion } from 'framer-motion';

// ────────────────────────────────────────────
// ProgressTrail — 5-stage sendero within a chapter
// Compact horizontal trail: (*)---(*)---(o)---(o)---(o)
// ────────────────────────────────────────────

interface ProgressTrailProps {
  stages: { title: string; order: number }[];
  currentStage: number; // 1-5
  exercisesInStage: number;
  exercisesRequired: number;
  className?: string;
}

// Checkmark icon for completed stages
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3 7l3 3 5-6"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const CIRCLE_SIZE = 28;

export default function ProgressTrail({
  stages,
  currentStage,
  exercisesInStage,
  exercisesRequired,
  className = '',
}: ProgressTrailProps) {
  const progress = exercisesRequired > 0
    ? Math.min(exercisesInStage / exercisesRequired, 1)
    : 0;

  return (
    <div
      className={`w-full px-2 ${className}`}
      role="progressbar"
      aria-valuenow={currentStage}
      aria-valuemin={1}
      aria-valuemax={stages.length}
      aria-label={`Etapa ${currentStage} de ${stages.length}`}
    >
      {/* Trail row */}
      <div className="flex items-center justify-between w-full">
        {stages.map((stage, i) => {
          const stageNum = stage.order;
          const isCompleted = stageNum < currentStage;
          const isCurrent = stageNum === currentStage;
          const isFuture = stageNum > currentStage;

          return (
            <div key={stage.order} className="flex items-center flex-1 last:flex-none">
              {/* Stage circle */}
              <div className="relative flex flex-col items-center">
                {/* Circle */}
                {isCompleted && (
                  <motion.div
                    className="flex items-center justify-center rounded-full bg-forest-500"
                    style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <CheckIcon />
                  </motion.div>
                )}

                {isCurrent && (
                  <motion.div
                    className="relative flex items-center justify-center rounded-full border-3 border-sunset-500 bg-cream"
                    style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
                    animate={{ boxShadow: ['0 0 0 0px rgba(232,148,61,0.3)', '0 0 0 6px rgba(232,148,61,0)', '0 0 0 0px rgba(232,148,61,0.3)'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {/* Inner fill based on exercise progress */}
                    <svg
                      width={CIRCLE_SIZE - 6}
                      height={CIRCLE_SIZE - 6}
                      viewBox="0 0 22 22"
                      className="absolute"
                    >
                      <circle
                        cx="11"
                        cy="11"
                        r="9"
                        fill="none"
                        stroke="var(--color-sunset-200)"
                        strokeWidth="3"
                      />
                      <motion.circle
                        cx="11"
                        cy="11"
                        r="9"
                        fill="none"
                        stroke="var(--color-sunset-500)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 9}
                        initial={{ strokeDashoffset: 2 * Math.PI * 9 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 9 * (1 - progress) }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        transform="rotate(-90 11 11)"
                      />
                    </svg>
                    <span className="text-[10px] font-bold text-sunset-700 z-10">
                      {exercisesInStage}
                    </span>
                  </motion.div>
                )}

                {isFuture && (
                  <div
                    className="flex items-center justify-center rounded-full border-2 border-gray-300 bg-gray-100"
                    style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
                  />
                )}
              </div>

              {/* Connecting line (not after the last stage) */}
              {i < stages.length - 1 && (
                <div className="flex-1 h-[3px] mx-1 relative overflow-hidden rounded-full bg-gray-200">
                  {/* Fill for completed segments */}
                  {stageNum < currentStage && (
                    <motion.div
                      className="absolute inset-0 bg-forest-300 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      style={{ transformOrigin: 'left' }}
                    />
                  )}
                  {/* Partial fill for current-to-next transition */}
                  {stageNum === currentStage && (
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-sunset-300 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress * 50}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stage titles */}
      <div className="flex items-start justify-between w-full mt-1">
        {stages.map((stage) => {
          const isCurrent = stage.order === currentStage;

          return (
            <div
              key={stage.order}
              className={`flex-1 last:flex-none text-center ${
                isCurrent ? 'text-sunset-700 font-bold' : 'text-bark/40'
              }`}
              style={{ maxWidth: isCurrent ? undefined : CIRCLE_SIZE + 16 }}
            >
              <p className="text-[10px] leading-tight truncate px-0.5">
                {stage.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mini progress bar below current stage */}
      <div className="flex justify-center mt-1.5">
        <div className="flex items-center gap-1.5 text-[10px] text-sunset-600 font-semibold">
          <div className="w-16 h-1.5 rounded-full bg-sunset-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-sunset-500"
              initial={{ width: '0%' }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span>{exercisesInStage}/{exercisesRequired}</span>
        </div>
      </div>
    </div>
  );
}
