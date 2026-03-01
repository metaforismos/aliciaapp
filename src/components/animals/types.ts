import type { Variants } from 'framer-motion';

// ────────────────────────────────────────────
// Shared animal component props
// ────────────────────────────────────────────

export type AnimalAnimationState =
  | 'idle'
  | 'walking'
  | 'celebrating'
  | 'hiding'
  | 'worried'
  | 'eating';

export type AnimalSize = 'sm' | 'md' | 'lg';

export interface AnimalProps {
  state: AnimalAnimationState;
  size?: AnimalSize;
  direction?: 'left' | 'right';
  className?: string;
}

// ────────────────────────────────────────────
// Size mappings (height-based, px)
// ────────────────────────────────────────────

export const ANIMAL_SIZE_MAP: Record<AnimalSize, number> = {
  sm: 100,
  md: 150,
  lg: 240,
};

// ────────────────────────────────────────────
// Shared animation variant factories
// ────────────────────────────────────────────

/**
 * Body-level variants shared across all animal components.
 * Each animal can extend or override individual states.
 */
export const bodyVariants: Variants = {
  idle: {
    scaleY: [1.0, 1.02, 1.0],
    y: 0,
    x: 0,
    scale: 1,
    rotate: 0,
    transition: {
      scaleY: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  walking: {
    y: [0, -3, 0, -3, 0],
    rotate: [0, -2, 0, -2, 0],
    scale: 1,
    x: 0,
    transition: {
      y: {
        duration: 0.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
      rotate: {
        duration: 0.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  celebrating: {
    y: [0, -20, 0, -10, 0],
    scale: [1, 1.05, 1, 1.03, 1],
    rotate: 0,
    x: 0,
    transition: {
      y: {
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 0.8,
        ease: 'easeOut',
      },
      scale: {
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 0.8,
        ease: 'easeOut',
      },
    },
  },

  hiding: {
    scale: 0.7,
    x: -30,
    y: 10,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },

  worried: {
    rotate: [0, -1, 1, -1, 1, 0],
    scale: 1,
    x: 0,
    y: 0,
    transition: {
      rotate: {
        duration: 0.3,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  },

  eating: {
    scaleY: 1,
    y: [0, 2, 0],
    x: 0,
    scale: 1,
    rotate: 0,
    transition: {
      y: {
        duration: 1.2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
};

/**
 * Ear animation variants (left/right ears can mirror).
 */
export const earVariants: Variants = {
  idle: {
    rotate: [0, -5, 0],
    transition: {
      duration: 0.4,
      repeat: Infinity,
      repeatDelay: 3,
      ease: 'easeInOut',
    },
  },
  walking: {
    rotate: [0, -3, 3, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  celebrating: {
    rotate: [0, -8, 8, -8, 0],
    transition: {
      duration: 0.4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  hiding: {
    rotate: -10,
    transition: { duration: 0.3 },
  },
  worried: {
    rotate: -15,
    transition: {
      duration: 0.2,
      repeat: Infinity,
      repeatType: 'reverse' as const,
    },
  },

  eating: {
    rotate: [0, -3, 0],
    transition: {
      duration: 1.0,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Tail animation variants.
 */
export const tailVariants: Variants = {
  idle: {
    rotate: [0, 5, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  walking: {
    rotate: [0, 8, -8, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  celebrating: {
    rotate: [0, 15, -15, 15, 0],
    transition: {
      duration: 0.3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  hiding: {
    rotate: -5,
    scale: 0.8,
    transition: { duration: 0.3 },
  },
  worried: {
    rotate: [-5, 5, -5],
    transition: {
      duration: 0.2,
      repeat: Infinity,
      ease: 'linear',
    },
  },

  eating: {
    rotate: [0, 3, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Eye variants for expressive states.
 */
export const eyeVariants: Variants = {
  idle: {
    scaleY: [1, 1, 0.1, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatDelay: 2,
      times: [0, 0.9, 0.95, 1],
      ease: 'easeInOut',
    },
  },
  walking: {
    scaleY: 1,
  },
  celebrating: {
    scaleY: 0.3,
    scaleX: 1.1,
    transition: { duration: 0.2 },
  },
  hiding: {
    scaleY: 1.2,
    scaleX: 1.2,
    transition: { duration: 0.3 },
  },
  worried: {
    scaleY: 1.15,
    scaleX: 0.9,
    transition: {
      duration: 0.15,
      repeat: Infinity,
      repeatType: 'reverse' as const,
    },
  },

  eating: {
    scaleY: 1,
    scaleX: 1,
    transition: { duration: 0.3 },
  },
};
