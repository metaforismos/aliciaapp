import { motion } from 'framer-motion';

// ────────────────────────────────────────────
// PawPrints — shows 1–3 paw icons earned for an exercise
// Animated stamp-in with staggered delay
// ────────────────────────────────────────────

interface PawPrintsProps {
  count: 1 | 2 | 3;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 24, md: 32, lg: 48 } as const;

const MAX_PAWS = 3;

// Simple paw SVG: 4 toe pads + 1 main pad
function PawIcon({ px, earned }: { px: number; earned: boolean }) {
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Toe pads */}
      <ellipse cx="9" cy="6" rx="3.2" ry="3.8" fill={earned ? 'var(--color-sunset-500)' : 'var(--color-forest-200)'} />
      <ellipse cx="17" cy="4" rx="3" ry="3.4" fill={earned ? 'var(--color-sunset-500)' : 'var(--color-forest-200)'} />
      <ellipse cx="23" cy="6" rx="3.2" ry="3.8" fill={earned ? 'var(--color-sunset-500)' : 'var(--color-forest-200)'} />
      <ellipse cx="27" cy="12" rx="2.8" ry="3.4" fill={earned ? 'var(--color-sunset-500)' : 'var(--color-forest-200)'} />
      {/* Main pad */}
      <ellipse cx="16" cy="18" rx="8" ry="9" fill={earned ? 'var(--color-sunset-500)' : 'var(--color-forest-200)'} />
    </svg>
  );
}

// Stamp-in animation per paw
const stampVariants = {
  hidden: { scale: 0, rotate: -10, opacity: 0 },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 12,
    },
  },
};

// Overshoot keyframes for the "stamp" feel
const stampWithOvershoot = {
  hidden: { scale: 0, rotate: -10, opacity: 0 },
  visible: {
    scale: [0, 1.25, 1],
    rotate: [-10, 8, 0],
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

export default function PawPrints({
  count,
  animate = true,
  size = 'md',
  className = '',
}: PawPrintsProps) {
  const px = sizeMap[size];

  const paws = Array.from({ length: MAX_PAWS }, (_, i) => i < count);

  return (
    <motion.div
      className={`flex items-center gap-1 ${className}`}
      variants={animate ? containerVariants : undefined}
      initial={animate ? 'hidden' : undefined}
      animate={animate ? 'visible' : undefined}
      aria-label={`${count} de ${MAX_PAWS} patitas ganadas`}
      role="img"
    >
      {paws.map((earned, i) => (
        <motion.div
          key={i}
          variants={animate ? stampWithOvershoot : stampVariants}
          initial={animate ? 'hidden' : 'visible'}
          animate="visible"
          style={{ lineHeight: 0 }}
        >
          <PawIcon px={px} earned={earned} />
        </motion.div>
      ))}
    </motion.div>
  );
}
