import { motion } from 'framer-motion';
import Pudu from '../animals/Pudu';
import type { AnimalAnimationState } from '../animals/types';

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

interface StageSceneProps {
  /** Background theme identifier from chapter data */
  backgroundTheme: string;
  /** Animal animation state */
  animalState: AnimalAnimationState;
  /** How many exercises completed in current stage */
  exercisesCompleted: number;
  /** Total exercises required in current stage */
  exercisesRequired: number;
}

// ────────────────────────────────────────────
// Tree components (Chiloé native species)
// ────────────────────────────────────────────

function ArrayanTree({ x, scale = 1, delay = 0 }: { x: number; scale?: number; delay?: number }) {
  return (
    <motion.g
      transform={`translate(${x}, 0) scale(${scale})`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {/* Trunk — distinctive orange/cinnamon bark */}
      <rect x="8" y="50" width="8" height="40" rx="3" fill="#C4722A" />
      <rect x="10" y="50" width="4" height="40" rx="2" fill="#D4853A" opacity="0.6" />
      {/* Canopy */}
      <ellipse cx="12" cy="40" rx="18" ry="22" fill="#2D5016" />
      <ellipse cx="12" cy="35" rx="14" ry="16" fill="#3A6B1E" />
      <ellipse cx="8" cy="30" rx="8" ry="10" fill="#4A7C2E" opacity="0.8" />
    </motion.g>
  );
}

function CoigueTree({ x, scale = 1, delay = 0 }: { x: number; scale?: number; delay?: number }) {
  return (
    <motion.g
      transform={`translate(${x}, 0) scale(${scale})`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {/* Thick trunk */}
      <rect x="10" y="40" width="12" height="50" rx="4" fill="#5C3D1A" />
      <rect x="13" y="40" width="6" height="50" rx="3" fill="#6B4A24" opacity="0.5" />
      {/* Broad canopy */}
      <ellipse cx="16" cy="30" rx="22" ry="25" fill="#1E4510" />
      <ellipse cx="16" cy="25" rx="18" ry="18" fill="#2D5016" />
      <ellipse cx="12" cy="22" rx="10" ry="12" fill="#3A6B1E" opacity="0.7" />
    </motion.g>
  );
}

function CaneloTree({ x, scale = 1, delay = 0 }: { x: number; scale?: number; delay?: number }) {
  return (
    <motion.g
      transform={`translate(${x}, 0) scale(${scale})`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {/* Slender trunk */}
      <rect x="9" y="45" width="6" height="45" rx="2" fill="#6B4A24" />
      {/* Broad leaves canopy */}
      <ellipse cx="12" cy="35" rx="16" ry="20" fill="#2E6B2E" />
      <ellipse cx="12" cy="30" rx="12" ry="14" fill="#3A8535" />
      <ellipse cx="14" cy="28" rx="7" ry="8" fill="#4CA04A" opacity="0.6" />
    </motion.g>
  );
}

function FernCluster({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <path d="M0 0 Q -8 -12 -4 -20 Q -2 -15 0 -12" fill="#3A6B1E" opacity="0.8" />
      <path d="M0 0 Q 2 -14 8 -18 Q 5 -12 2 -8" fill="#4A7C2E" opacity="0.7" />
      <path d="M0 0 Q -3 -10 2 -16 Q 3 -10 1 -5" fill="#2D5016" opacity="0.6" />
    </g>
  );
}

function GrassCluster({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path d="M0 0 Q-2 -6 -1 -10" stroke="#4A7C2E" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M3 0 Q4 -8 2 -12" stroke="#3A6B1E" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M6 0 Q8 -5 7 -8" stroke="#4A7C2E" strokeWidth="1.5" fill="none" opacity="0.4" />
    </g>
  );
}

// ────────────────────────────────────────────
// Winding trail path with progress markers
// ────────────────────────────────────────────

function TrailPath({
  exercisesCompleted,
  exercisesRequired,
}: {
  exercisesCompleted: number;
  exercisesRequired: number;
}) {
  // Path points for the winding trail (bottom to top)
  const trailPoints = [
    { x: 25, y: 340 },
    { x: 45, y: 300 },
    { x: 20, y: 260 },
    { x: 50, y: 220 },
    { x: 30, y: 180 },
    { x: 55, y: 140 },
    { x: 25, y: 100 },
    { x: 45, y: 60 },
  ];

  // Select evenly spaced markers based on exercisesRequired
  const markers = [];
  for (let i = 0; i < exercisesRequired && i < trailPoints.length; i++) {
    const idx = Math.floor((i / exercisesRequired) * trailPoints.length);
    markers.push({ ...trailPoints[Math.min(idx, trailPoints.length - 1)], index: i });
  }

  // Create trail path string
  const pathD = trailPoints
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(' ');

  return (
    <g>
      {/* Trail line (dirt path) */}
      <path
        d={pathD}
        stroke="#8B6914"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.3"
        strokeDasharray="6 4"
      />

      {/* Markers */}
      {markers.map((m) => {
        const isCompleted = m.index < exercisesCompleted;
        return (
          <motion.circle
            key={m.index}
            cx={m.x}
            cy={m.y}
            r={isCompleted ? 5 : 4}
            fill={isCompleted ? '#4A7C2E' : '#D4D4D8'}
            stroke={isCompleted ? '#2D5016' : '#A1A1AA'}
            strokeWidth="1.5"
            initial={false}
            animate={
              isCompleted
                ? { scale: [1, 1.3, 1], transition: { duration: 0.3 } }
                : {}
            }
          />
        );
      })}
    </g>
  );
}

// ────────────────────────────────────────────
// Main scene component
// ────────────────────────────────────────────

export default function StageScene({
  animalState,
  exercisesCompleted,
  exercisesRequired,
}: StageSceneProps) {
  // Position the Pudú based on progress (starts at bottom, climbs)
  const progressPercent = exercisesRequired > 0
    ? (exercisesCompleted / exercisesRequired) * 100
    : 0;

  return (
    <div className="w-full h-full relative overflow-hidden rounded-r-xl">
      {/* Sky gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100/50 via-emerald-50/30 to-forest-800/20" />

      {/* Forest scene SVG */}
      <svg
        viewBox="0 0 100 400"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* Background trees (far) */}
        <CoigueTree x={-5} scale={0.7} delay={0.1} />
        <ArrayanTree x={55} scale={0.6} delay={0.2} />

        {/* Trail */}
        <TrailPath
          exercisesCompleted={exercisesCompleted}
          exercisesRequired={exercisesRequired}
        />

        {/* Midground trees */}
        <CaneloTree x={60} scale={0.85} delay={0.3} />
        <ArrayanTree x={5} scale={0.9} delay={0.4} />

        {/* Foreground trees (closer, larger) */}
        <CoigueTree x={30} scale={1.0} delay={0.5} />
        <ArrayanTree x={-10} scale={1.1} delay={0.6} />

        {/* Ferns and grass at bottom */}
        <FernCluster x={10} y={370} scale={0.8} />
        <FernCluster x={60} y={360} scale={0.6} />
        <FernCluster x={35} y={375} scale={0.7} />
        <GrassCluster x={20} y={385} />
        <GrassCluster x={50} y={390} />
        <GrassCluster x={75} y={382} />

        {/* Ground line */}
        <path
          d="M-10 390 Q25 380 50 385 Q75 390 110 382"
          fill="none"
          stroke="#2D5016"
          strokeWidth="2"
          opacity="0.3"
        />
      </svg>

      {/* Pudú character — positioned based on progress */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-10"
        animate={{
          bottom: `${10 + (progressPercent / 100) * 55}%`,
        }}
        transition={{ type: 'spring', stiffness: 80, damping: 18 }}
      >
        <Pudu
          state={animalState}
          size="md"
          direction="right"
        />
      </motion.div>

      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest-900/20 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
