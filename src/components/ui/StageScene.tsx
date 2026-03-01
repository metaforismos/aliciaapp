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
// Background gradients per theme (CSS classes)
// ────────────────────────────────────────────

const SCENE_GRADIENTS: Record<string, string> = {
  'bosque-valdiviano': 'bg-gradient-to-b from-sky-100/50 via-emerald-50/30 to-forest-800/20',
  'pradera-humedal': 'bg-gradient-to-b from-sky-200/60 via-cyan-100/40 to-emerald-100/30',
  'bosque-profundo': 'bg-gradient-to-b from-emerald-900/30 via-green-900/20 to-stone-900/30',
  'bosque-nocturno': 'bg-gradient-to-b from-indigo-950/80 via-purple-950/50 to-slate-900/60',
  'bosque-noche-estrellada': 'bg-gradient-to-b from-slate-950/90 via-indigo-950/60 to-slate-900/50',
  'costa-rocosa': 'bg-gradient-to-b from-sky-200/50 via-cyan-200/30 to-teal-300/20',
};

const VIGNETTE_CLASSES: Record<string, string> = {
  'bosque-valdiviano': 'bg-gradient-to-t from-forest-900/20 via-transparent to-transparent',
  'pradera-humedal': 'bg-gradient-to-t from-emerald-900/15 via-transparent to-transparent',
  'bosque-profundo': 'bg-gradient-to-t from-green-950/40 via-transparent to-transparent',
  'bosque-nocturno': 'bg-gradient-to-t from-indigo-950/50 via-transparent to-transparent',
  'bosque-noche-estrellada': 'bg-gradient-to-t from-slate-950/50 via-transparent to-transparent',
  'costa-rocosa': 'bg-gradient-to-t from-teal-900/20 via-transparent to-transparent',
};

// ────────────────────────────────────────────
// Shared tree / vegetation components
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
// Pradera-humedal components
// ────────────────────────────────────────────

function TallGrass({ x, y, height = 30, delay = 0 }: { x: number; y: number; height?: number; delay?: number }) {
  return (
    <motion.g
      transform={`translate(${x}, ${y})`}
      animate={{ rotate: [0, 2, -2, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ originX: `${x}px`, originY: `${y}px` }}
    >
      <path d={`M0 0 Q-2 ${-height * 0.5} 1 ${-height}`} stroke="#7CB342" strokeWidth="2" fill="none" opacity="0.8" />
      <path d={`M3 0 Q5 ${-height * 0.6} 2 ${-height * 0.9}`} stroke="#8BC34A" strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d={`M-2 0 Q-4 ${-height * 0.4} -1 ${-height * 0.7}`} stroke="#689F38" strokeWidth="1.5" fill="none" opacity="0.6" />
    </motion.g>
  );
}

function Cattail({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <motion.g
      transform={`translate(${x}, ${y})`}
      animate={{ rotate: [0, 1.5, -1.5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ originX: `${x}px`, originY: `${y}px` }}
    >
      <line x1="0" y1="0" x2="0" y2="-35" stroke="#5D7B3A" strokeWidth="1.5" />
      <ellipse cx="0" cy="-38" rx="2.5" ry="6" fill="#6B4A24" />
    </motion.g>
  );
}

function WaterPool({ x, y, rx, ry }: { x: number; y: number; rx: number; ry: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#4A9CC7" opacity="0.35" />
      <motion.ellipse
        cx={x}
        cy={y}
        rx={rx * 0.7}
        ry={ry * 0.5}
        fill="#89CFF0"
        opacity="0.2"
        animate={{ rx: [rx * 0.7, rx * 0.5, rx * 0.7], ry: [ry * 0.5, ry * 0.35, ry * 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </g>
  );
}

// ────────────────────────────────────────────
// Bosque-profundo components
// ────────────────────────────────────────────

function DarkTree({ x, scale = 1, delay = 0 }: { x: number; scale?: number; delay?: number }) {
  return (
    <motion.g
      transform={`translate(${x}, 0) scale(${scale})`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {/* Massive trunk */}
      <rect x="8" y="30" width="16" height="65" rx="5" fill="#3D2B1F" />
      <rect x="12" y="30" width="8" height="65" rx="3" fill="#4A3828" opacity="0.5" />
      {/* Dense dark canopy */}
      <ellipse cx="16" cy="20" rx="26" ry="28" fill="#1E4510" />
      <ellipse cx="16" cy="14" rx="20" ry="20" fill="#163A0D" />
      <ellipse cx="10" cy="10" rx="12" ry="14" fill="#1E4510" opacity="0.8" />
    </motion.g>
  );
}

function Mushroom({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x="-1.5" y="-5" width="3" height="7" rx="1" fill="#D4C5A9" />
      <ellipse cx="0" cy="-7" rx="5" ry="3.5" fill="#A0522D" />
      <ellipse cx="-1.5" cy="-7.5" rx="1" ry="0.8" fill="#D4A574" opacity="0.5" />
      <ellipse cx="2" cy="-6.5" rx="0.8" ry="0.6" fill="#D4A574" opacity="0.4" />
    </g>
  );
}

function FallenLog({ x, y, width = 30 }: { x: number; y: number; width?: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="0" y="-3" width={width} height="6" rx="3" fill="#5C3D1A" opacity="0.7" />
      <rect x="0" y="-3" width={width} height="3" rx="2" fill="#6B4A24" opacity="0.4" />
      {/* Moss on log */}
      <ellipse cx={width * 0.3} cy="-4" rx="4" ry="2" fill="#3A6B1E" opacity="0.5" />
      <ellipse cx={width * 0.7} cy="-4" rx="3" ry="1.5" fill="#4A7C2E" opacity="0.4" />
    </g>
  );
}

function MossyRock({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="0" rx="8" ry="5" fill="#5C5C5C" opacity="0.6" />
      <ellipse cx="-2" cy="-2" rx="5" ry="3" fill="#4A7C2E" opacity="0.4" />
    </g>
  );
}

// ────────────────────────────────────────────
// Bosque-nocturno components
// ────────────────────────────────────────────

function NightTreeSilhouette({ x, scale = 1, delay = 0 }: { x: number; scale?: number; delay?: number }) {
  return (
    <motion.g
      transform={`translate(${x}, 0) scale(${scale})`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay }}
    >
      {/* Trunk */}
      <rect x="10" y="40" width="10" height="55" rx="4" fill="#1a1a2e" />
      {/* Dark canopy */}
      <ellipse cx="15" cy="28" rx="22" ry="26" fill="#16213e" />
      <ellipse cx="15" cy="22" rx="16" ry="18" fill="#1a1a2e" opacity="0.7" />
    </motion.g>
  );
}

function Firefly({ cx, cy, delay = 0 }: { cx: number; cy: number; delay?: number }) {
  return (
    <motion.g>
      {/* Glow aura */}
      <motion.circle
        cx={cx}
        cy={cy}
        r="3"
        fill="#FFD700"
        opacity="0"
        animate={{ opacity: [0, 0.3, 0], r: [2, 4, 2] }}
        transition={{ duration: 2.5, repeat: Infinity, delay, ease: 'easeInOut' }}
      />
      {/* Core */}
      <motion.circle
        cx={cx}
        cy={cy}
        r="1.2"
        fill="#FFD700"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity, delay, ease: 'easeInOut' }}
      />
    </motion.g>
  );
}

function HollowTree({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="0" y="-40" width="20" height="50" rx="6" fill="#2A1E12" />
      <rect x="3" y="-40" width="14" height="50" rx="5" fill="#3D2B1F" opacity="0.5" />
      {/* Hollow opening */}
      <ellipse cx="10" cy="-15" rx="6" ry="8" fill="#0f0f1e" />
      <ellipse cx="10" cy="-17" rx="4" ry="5" fill="#1a1a2e" opacity="0.5" />
      {/* Branches */}
      <path d="M-2 -38 Q-10 -50 -6 -60" stroke="#2A1E12" strokeWidth="3" fill="none" />
      <path d="M22 -35 Q30 -48 28 -58" stroke="#2A1E12" strokeWidth="3" fill="none" />
      {/* Canopy tops */}
      <ellipse cx="-8" cy="-62" rx="10" ry="8" fill="#16213e" />
      <ellipse cx="30" cy="-60" rx="10" ry="8" fill="#16213e" />
    </g>
  );
}

function NightStar({ cx, cy, size = 1, delay = 0 }: { cx: number; cy: number; size?: number; delay?: number }) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={size}
      fill="#FFFFFF"
      animate={{ opacity: [0.3, 0.9, 0.3] }}
      transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

// ────────────────────────────────────────────
// Bosque-noche-estrellada components
// ────────────────────────────────────────────

function Moon({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      {/* Moon glow */}
      <circle cx={cx} cy={cy} r={r * 2.5} fill="#F5F5DC" opacity="0.08" />
      <circle cx={cx} cy={cy} r={r * 1.6} fill="#F5F5DC" opacity="0.12" />
      {/* Moon body */}
      <circle cx={cx} cy={cy} r={r} fill="#F5F5DC" />
      {/* Craters */}
      <circle cx={cx - r * 0.2} cy={cy - r * 0.15} r={r * 0.15} fill="#E8E8D0" opacity="0.5" />
      <circle cx={cx + r * 0.25} cy={cy + r * 0.2} r={r * 0.1} fill="#E8E8D0" opacity="0.4" />
    </g>
  );
}

function MoonbeamRay({ x1, y1, x2, y2, delay = 0 }: { x1: number; y1: number; x2: number; y2: number; delay?: number }) {
  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="#C0C0C0"
      strokeWidth="0.5"
      opacity="0"
      animate={{ opacity: [0, 0.15, 0] }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

function SilhouetteBranch({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${flip ? -1 : 1}, 1)`}>
      <path d="M0 0 Q15 -10 30 -5 Q35 -8 40 -3" stroke="#1b2838" strokeWidth="2.5" fill="none" />
      <path d="M15 -8 Q20 -18 25 -15" stroke="#1b2838" strokeWidth="1.5" fill="none" />
      <path d="M28 -5 Q33 -15 38 -12" stroke="#1b2838" strokeWidth="1.5" fill="none" />
    </g>
  );
}

function StarryNightTree({ x, scale = 1, delay = 0 }: { x: number; scale?: number; delay?: number }) {
  return (
    <motion.g
      transform={`translate(${x}, 0) scale(${scale})`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay }}
    >
      <rect x="10" y="35" width="10" height="60" rx="4" fill="#0d1b2a" />
      <ellipse cx="15" cy="25" rx="20" ry="24" fill="#1b2838" />
      <ellipse cx="15" cy="18" rx="14" ry="16" fill="#0d1b2a" opacity="0.8" />
    </motion.g>
  );
}

// ────────────────────────────────────────────
// Costa-rocosa components
// ────────────────────────────────────────────

function Rock({ x, y, width = 15, height = 10, color = '#5C5C5C' }: { x: number; y: number; width?: number; height?: number; color?: string }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={width / 2} ry={height / 2} fill={color} />
      <ellipse cx={x - width * 0.1} cy={y - height * 0.15} rx={width * 0.35} ry={height * 0.3} fill="#8B8B8B" opacity="0.3" />
    </g>
  );
}

function TidePool({ x, y, rx, ry }: { x: number; y: number; rx: number; ry: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={rx + 1} ry={ry + 0.5} fill="#5C5C5C" opacity="0.4" />
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#1a535c" opacity="0.5" />
      <motion.ellipse
        cx={x}
        cy={y}
        rx={rx * 0.6}
        ry={ry * 0.5}
        fill="#4ecdc4"
        opacity="0.3"
        animate={{ rx: [rx * 0.6, rx * 0.4, rx * 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </g>
  );
}

function Wave({ y, delay = 0, amplitude = 3 }: { y: number; delay?: number; amplitude?: number }) {
  return (
    <motion.path
      d={`M-10 ${y} Q10 ${y - amplitude} 30 ${y} Q50 ${y + amplitude} 70 ${y} Q90 ${y - amplitude} 110 ${y}`}
      stroke="#4ecdc4"
      strokeWidth="1.5"
      fill="none"
      opacity="0.4"
      animate={{
        d: [
          `M-10 ${y} Q10 ${y - amplitude} 30 ${y} Q50 ${y + amplitude} 70 ${y} Q90 ${y - amplitude} 110 ${y}`,
          `M-10 ${y} Q10 ${y + amplitude} 30 ${y} Q50 ${y - amplitude} 70 ${y} Q90 ${y + amplitude} 110 ${y}`,
          `M-10 ${y} Q10 ${y - amplitude} 30 ${y} Q50 ${y + amplitude} 70 ${y} Q90 ${y - amplitude} 110 ${y}`,
        ],
      }}
      transition={{ duration: 3, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

function Seaweed({ x, y, height = 20, delay = 0 }: { x: number; y: number; height?: number; delay?: number }) {
  return (
    <motion.g
      animate={{ rotate: [0, 3, -3, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ originX: `${x}px`, originY: `${y}px` }}
    >
      <path d={`M${x} ${y} Q${x + 3} ${y - height * 0.5} ${x - 1} ${y - height}`} stroke="#1a535c" strokeWidth="2" fill="none" opacity="0.6" />
      <path d={`M${x + 3} ${y} Q${x + 6} ${y - height * 0.4} ${x + 2} ${y - height * 0.8}`} stroke="#2E6B8A" strokeWidth="1.5" fill="none" opacity="0.5" />
    </motion.g>
  );
}

function SeaFoam({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <motion.g
      animate={{ opacity: [0.2, 0.6, 0.2] }}
      transition={{ duration: 2, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <circle cx={x} cy={y} r="1.5" fill="#F0F8FF" opacity="0.5" />
      <circle cx={x + 3} cy={y - 0.5} r="1" fill="#F0F8FF" opacity="0.4" />
      <circle cx={x - 2} cy={y + 0.5} r="1.2" fill="#F0F8FF" opacity="0.3" />
    </motion.g>
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
// Scene renderers per theme
// ────────────────────────────────────────────

function BosqueValdivianoScene({ exercisesCompleted, exercisesRequired }: { exercisesCompleted: number; exercisesRequired: number }) {
  return (
    <>
      {/* Background trees (far) */}
      <CoigueTree x={-5} scale={0.7} delay={0.1} />
      <ArrayanTree x={55} scale={0.6} delay={0.2} />

      {/* Mist layer */}
      <motion.rect
        x="0" y="80" width="100" height="30"
        fill="#FFFFFF" opacity="0"
        animate={{ opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Trail */}
      <TrailPath exercisesCompleted={exercisesCompleted} exercisesRequired={exercisesRequired} />

      {/* Midground trees */}
      <CaneloTree x={60} scale={0.85} delay={0.3} />
      <ArrayanTree x={5} scale={0.9} delay={0.4} />

      {/* Foreground trees (closer, larger) */}
      <CoigueTree x={30} scale={1.0} delay={0.5} />
      <ArrayanTree x={-10} scale={1.1} delay={0.6} />

      {/* Moss patches */}
      <ellipse cx="15" cy="350" rx="8" ry="3" fill="#3A6B1E" opacity="0.3" />
      <ellipse cx="70" cy="345" rx="6" ry="2.5" fill="#4A7C2E" opacity="0.25" />

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
    </>
  );
}

function PraderaHumedalScene({ exercisesCompleted, exercisesRequired }: { exercisesCompleted: number; exercisesRequired: number }) {
  return (
    <>
      {/* Open sky area — more visible at top */}
      <rect x="0" y="0" width="100" height="60" fill="#87CEEB" opacity="0.08" />

      {/* Distant low bushes */}
      <ellipse cx="15" cy="70" rx="14" ry="8" fill="#7CB342" opacity="0.4" />
      <ellipse cx="75" cy="65" rx="12" ry="7" fill="#8BC34A" opacity="0.35" />
      <ellipse cx="45" cy="75" rx="10" ry="6" fill="#689F38" opacity="0.3" />

      {/* Water pools */}
      <WaterPool x={20} y={150} rx={15} ry={5} />
      <WaterPool x={65} y={250} rx={12} ry={4} />
      <WaterPool x={35} y={330} rx={18} ry={6} />

      {/* Trail */}
      <TrailPath exercisesCompleted={exercisesCompleted} exercisesRequired={exercisesRequired} />

      {/* Tall grasses scattered */}
      <TallGrass x={5} y={120} height={28} delay={0} />
      <TallGrass x={80} y={130} height={25} delay={0.5} />
      <TallGrass x={15} y={200} height={30} delay={1} />
      <TallGrass x={70} y={210} height={26} delay={0.3} />
      <TallGrass x={10} y={290} height={28} delay={0.8} />
      <TallGrass x={85} y={300} height={24} delay={0.2} />
      <TallGrass x={5} y={360} height={30} delay={0.6} />
      <TallGrass x={75} y={370} height={26} delay={1.2} />

      {/* Cattails near water */}
      <Cattail x={30} y={155} delay={0.3} />
      <Cattail x={55} y={250} delay={0.7} />
      <Cattail x={45} y={335} delay={0.1} />

      {/* Scattered low bushes */}
      <ellipse cx="90" cy="180" rx="8" ry="5" fill="#A5D6A7" opacity="0.4" />
      <ellipse cx="5" cy="260" rx="7" ry="4" fill="#81C784" opacity="0.35" />

      {/* Ground — marshy */}
      <path
        d="M-10 390 Q25 384 50 388 Q75 382 110 386"
        fill="none"
        stroke="#689F38"
        strokeWidth="2"
        opacity="0.25"
      />
      <GrassCluster x={20} y={388} />
      <GrassCluster x={55} y={385} />
      <GrassCluster x={80} y={390} />
    </>
  );
}

function BosqueProfundoScene({ exercisesCompleted, exercisesRequired }: { exercisesCompleted: number; exercisesRequired: number }) {
  return (
    <>
      {/* Dark ambient overlay */}
      <rect x="0" y="0" width="100" height="400" fill="#0A2F0A" opacity="0.15" />

      {/* Far dark trees */}
      <DarkTree x={-8} scale={0.8} delay={0.1} />
      <DarkTree x={50} scale={0.7} delay={0.2} />
      <DarkTree x={25} scale={0.65} delay={0.15} />

      {/* Dense undergrowth layer */}
      <ellipse cx="50" cy="90" rx="55" ry="12" fill="#1E4510" opacity="0.3" />

      {/* Trail */}
      <TrailPath exercisesCompleted={exercisesCompleted} exercisesRequired={exercisesRequired} />

      {/* Midground massive trees */}
      <DarkTree x={60} scale={0.95} delay={0.3} />
      <CoigueTree x={-5} scale={1.0} delay={0.35} />

      {/* Foreground trees */}
      <DarkTree x={30} scale={1.1} delay={0.5} />
      <DarkTree x={-15} scale={1.2} delay={0.6} />

      {/* Fallen logs */}
      <FallenLog x={10} y={310} width={25} />
      <FallenLog x={55} y={240} width={20} />

      {/* Mushrooms on trunks and ground */}
      <Mushroom x={65} y={310} scale={0.8} />
      <Mushroom x={18} y={270} scale={0.6} />
      <Mushroom x={75} y={350} scale={0.7} />
      <Mushroom x={40} y={370} scale={0.9} />

      {/* Mossy rocks */}
      <MossyRock x={80} y={355} scale={0.8} />
      <MossyRock x={25} y={380} scale={0.6} />

      {/* Dense ferns */}
      <FernCluster x={5} y={365} scale={0.9} />
      <FernCluster x={45} y={375} scale={0.8} />
      <FernCluster x={70} y={360} scale={0.7} />
      <FernCluster x={25} y={380} scale={0.6} />
      <FernCluster x={85} y={370} scale={0.5} />

      {/* Ground line */}
      <path
        d="M-10 390 Q25 382 50 387 Q75 383 110 388"
        fill="none"
        stroke="#1E4510"
        strokeWidth="2"
        opacity="0.4"
      />
    </>
  );
}

function BosqueNocturnoScene({ exercisesCompleted, exercisesRequired }: { exercisesCompleted: number; exercisesRequired: number }) {
  return (
    <>
      {/* Night sky base */}
      <rect x="0" y="0" width="100" height="400" fill="#1a1a2e" opacity="0.3" />

      {/* Stars in sky area */}
      <NightStar cx={10} cy={15} size={0.8} delay={0} />
      <NightStar cx={35} cy={8} size={0.6} delay={0.5} />
      <NightStar cx={60} cy={20} size={0.7} delay={1} />
      <NightStar cx={82} cy={12} size={0.5} delay={1.5} />
      <NightStar cx={20} cy={30} size={0.6} delay={0.8} />
      <NightStar cx={70} cy={35} size={0.5} delay={2} />
      <NightStar cx={48} cy={25} size={0.7} delay={0.3} />
      <NightStar cx={90} cy={28} size={0.4} delay={1.2} />

      {/* Tree silhouettes in background */}
      <NightTreeSilhouette x={-8} scale={0.8} delay={0.1} />
      <NightTreeSilhouette x={55} scale={0.7} delay={0.2} />

      {/* Trail */}
      <TrailPath exercisesCompleted={exercisesCompleted} exercisesRequired={exercisesRequired} />

      {/* Midground trees */}
      <NightTreeSilhouette x={65} scale={0.95} delay={0.3} />
      <NightTreeSilhouette x={-5} scale={1.0} delay={0.4} />

      {/* Hollow tree — cozy den */}
      <HollowTree x={60} y={360} />

      {/* Foreground silhouettes */}
      <NightTreeSilhouette x={30} scale={1.1} delay={0.5} />
      <NightTreeSilhouette x={-15} scale={1.15} delay={0.6} />

      {/* Fireflies scattered through the forest */}
      <Firefly cx={15} cy={120} delay={0} />
      <Firefly cx={72} cy={150} delay={0.8} />
      <Firefly cx={40} cy={180} delay={1.5} />
      <Firefly cx={85} cy={200} delay={0.3} />
      <Firefly cx={25} cy={230} delay={2.0} />
      <Firefly cx={60} cy={260} delay={1.0} />
      <Firefly cx={10} cy={300} delay={0.5} />
      <Firefly cx={50} cy={320} delay={1.8} />
      <Firefly cx={78} cy={340} delay={0.2} />
      <Firefly cx={35} cy={350} delay={1.3} />

      {/* Dark purple ambient glow at bottom */}
      <rect x="0" y="350" width="100" height="50" fill="#533483" opacity="0.1" />

      {/* Ground */}
      <path
        d="M-10 390 Q25 384 50 388 Q75 383 110 387"
        fill="none"
        stroke="#16213e"
        strokeWidth="2"
        opacity="0.3"
      />
    </>
  );
}

function BosqueNocheEstrelladaScene({ exercisesCompleted, exercisesRequired }: { exercisesCompleted: number; exercisesRequired: number }) {
  return (
    <>
      {/* Deep night sky */}
      <rect x="0" y="0" width="100" height="400" fill="#0d1b2a" opacity="0.25" />

      {/* Moon */}
      <Moon cx={78} cy={25} r={7} />

      {/* Moonbeam rays through canopy */}
      <MoonbeamRay x1={78} y1={32} x2={55} y2={150} delay={0} />
      <MoonbeamRay x1={78} y1={32} x2={40} y2={200} delay={1.5} />
      <MoonbeamRay x1={78} y1={32} x2={65} y2={250} delay={3} />

      {/* Dense star field */}
      <NightStar cx={5} cy={10} size={0.9} delay={0} />
      <NightStar cx={20} cy={5} size={0.6} delay={0.4} />
      <NightStar cx={38} cy={12} size={0.8} delay={0.8} />
      <NightStar cx={55} cy={8} size={0.5} delay={1.2} />
      <NightStar cx={92} cy={15} size={0.7} delay={0.2} />
      <NightStar cx={12} cy={35} size={0.5} delay={1.6} />
      <NightStar cx={30} cy={28} size={0.6} delay={0.6} />
      <NightStar cx={50} cy={40} size={0.4} delay={2.0} />
      <NightStar cx={68} cy={18} size={0.7} delay={1.0} />
      <NightStar cx={85} cy={38} size={0.5} delay={1.4} />
      <NightStar cx={15} cy={50} size={0.4} delay={0.3} />
      <NightStar cx={42} cy={55} size={0.5} delay={1.8} />

      {/* Tree silhouettes */}
      <StarryNightTree x={-5} scale={0.75} delay={0.1} />
      <StarryNightTree x={60} scale={0.65} delay={0.2} />

      {/* Silhouetted branches across top */}
      <SilhouetteBranch x={-5} y={50} />
      <SilhouetteBranch x={65} y={55} flip />

      {/* Trail */}
      <TrailPath exercisesCompleted={exercisesCompleted} exercisesRequired={exercisesRequired} />

      {/* Midground trees */}
      <StarryNightTree x={65} scale={0.9} delay={0.3} />
      <StarryNightTree x={0} scale={0.95} delay={0.35} />

      {/* Foreground trees */}
      <StarryNightTree x={35} scale={1.05} delay={0.5} />
      <StarryNightTree x={-12} scale={1.15} delay={0.55} />

      {/* Mysterious silver shadow patches */}
      <motion.ellipse
        cx="30" cy="300"
        rx="20" ry="8"
        fill="#C0C0C0"
        opacity="0"
        animate={{ opacity: [0.02, 0.06, 0.02] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.ellipse
        cx="70" cy="340"
        rx="15" ry="6"
        fill="#C0C0C0"
        opacity="0"
        animate={{ opacity: [0.03, 0.07, 0.03] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Ground */}
      <path
        d="M-10 390 Q25 384 50 387 Q75 382 110 386"
        fill="none"
        stroke="#1b2838"
        strokeWidth="2"
        opacity="0.3"
      />
    </>
  );
}

function CostaRocosaScene({ exercisesCompleted, exercisesRequired }: { exercisesCompleted: number; exercisesRequired: number }) {
  return (
    <>
      {/* Ocean background at top */}
      <rect x="0" y="0" width="100" height="100" fill="#2E6B8A" opacity="0.15" />

      {/* Horizon line */}
      <line x1="0" y1="80" x2="100" y2="80" stroke="#4ecdc4" strokeWidth="0.5" opacity="0.3" />

      {/* Ocean waves */}
      <Wave y={60} delay={0} amplitude={3} />
      <Wave y={68} delay={0.5} amplitude={2.5} />
      <Wave y={75} delay={1} amplitude={2} />
      <Wave y={85} delay={1.5} amplitude={3} />

      {/* Sea spray / foam */}
      <SeaFoam x={15} y={72} delay={0} />
      <SeaFoam x={50} y={65} delay={0.8} />
      <SeaFoam x={80} y={78} delay={0.4} />

      {/* Rocky coastline — large boulders */}
      <Rock x={15} y={110} width={25} height={18} color="#5C5C5C" />
      <Rock x={70} y={105} width={20} height={14} color="#6B6B6B" />
      <Rock x={45} y={115} width={18} height={12} color="#4A4A4A" />

      {/* Trail through rocks */}
      <TrailPath exercisesCompleted={exercisesCompleted} exercisesRequired={exercisesRequired} />

      {/* Mid-area rocks */}
      <Rock x={10} y={200} width={22} height={15} color="#5C5C5C" />
      <Rock x={80} y={190} width={18} height={12} color="#6B6B6B" />
      <Rock x={50} y={230} width={16} height={10} color="#4A4A4A" />

      {/* Tide pools among rocks */}
      <TidePool x={25} y={210} rx={8} ry={3} />
      <TidePool x={65} y={280} rx={10} ry={4} />
      <TidePool x={40} y={350} rx={7} ry={3} />

      {/* Seaweed / kelp */}
      <Seaweed x={18} y={220} height={18} delay={0} />
      <Seaweed x={70} y={290} height={15} delay={0.5} />
      <Seaweed x={35} y={355} height={16} delay={1} />
      <Seaweed x={80} y={370} height={12} delay={0.3} />

      {/* Foreground larger rocks */}
      <Rock x={20} y={320} width={28} height={20} color="#5C5C5C" />
      <Rock x={75} y={340} width={24} height={16} color="#4A4A4A" />
      <Rock x={50} y={370} width={20} height={14} color="#6B6B6B" />

      {/* Sea foam on shore */}
      <SeaFoam x={10} y={385} delay={0.2} />
      <SeaFoam x={45} y={388} delay={1} />
      <SeaFoam x={80} y={383} delay={0.6} />

      {/* Rocky ground line */}
      <path
        d="M-10 390 Q10 384 25 388 Q40 382 55 386 Q70 380 85 385 Q95 388 110 383"
        fill="none"
        stroke="#5C5C5C"
        strokeWidth="2.5"
        opacity="0.4"
      />
    </>
  );
}

// ────────────────────────────────────────────
// Scene selector
// ────────────────────────────────────────────

function SceneContent({
  backgroundTheme,
  exercisesCompleted,
  exercisesRequired,
}: {
  backgroundTheme: string;
  exercisesCompleted: number;
  exercisesRequired: number;
}) {
  const sharedProps = { exercisesCompleted, exercisesRequired };

  switch (backgroundTheme) {
    case 'pradera-humedal':
      return <PraderaHumedalScene {...sharedProps} />;
    case 'bosque-profundo':
      return <BosqueProfundoScene {...sharedProps} />;
    case 'bosque-nocturno':
      return <BosqueNocturnoScene {...sharedProps} />;
    case 'bosque-noche-estrellada':
      return <BosqueNocheEstrelladaScene {...sharedProps} />;
    case 'costa-rocosa':
      return <CostaRocosaScene {...sharedProps} />;
    case 'bosque-valdiviano':
    default:
      return <BosqueValdivianoScene {...sharedProps} />;
  }
}

// ────────────────────────────────────────────
// Main scene component
// ────────────────────────────────────────────

export default function StageScene({
  backgroundTheme,
  animalState,
  exercisesCompleted,
  exercisesRequired,
}: StageSceneProps) {
  // Position the Pudu based on progress (starts at bottom, climbs)
  const progressPercent = exercisesRequired > 0
    ? (exercisesCompleted / exercisesRequired) * 100
    : 0;

  const gradient = SCENE_GRADIENTS[backgroundTheme] || SCENE_GRADIENTS['bosque-valdiviano'];
  const vignette = VIGNETTE_CLASSES[backgroundTheme] || VIGNETTE_CLASSES['bosque-valdiviano'];

  return (
    <div className="w-full h-full relative overflow-hidden rounded-r-xl">
      {/* Sky gradient background */}
      <div className={`absolute inset-0 ${gradient}`} />

      {/* Forest scene SVG */}
      <svg
        viewBox="0 0 100 400"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMax slice"
      >
        <SceneContent
          backgroundTheme={backgroundTheme}
          exercisesCompleted={exercisesCompleted}
          exercisesRequired={exercisesRequired}
        />
      </svg>

      {/* Pudu character — positioned based on progress */}
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
      <div className={`absolute inset-0 ${vignette} pointer-events-none`} />
    </div>
  );
}
