import { motion } from 'framer-motion';
import {
  type AnimalProps,
  ANIMAL_SIZE_MAP,
  bodyVariants,
  earVariants,
  tailVariants,
} from './types';

// ────────────────────────────────────────────
// Pudu (Pascual) — Pudu puda
// World's smallest deer, native to Chile
// ────────────────────────────────────────────

/**
 * SVG viewBox: 0 0 240 200
 * The pudu is drawn centered, facing right by default.
 * Proportions: big round barrel body, short stubby legs,
 * small head with tiny ears and small antler bumps,
 * simple cute dot eyes. Grass tufts underneath.
 */

// ── Leg animation variants ──

const legVariants = {
  idle: {
    rotate: 0,
    transition: { duration: 0.5 },
  },
  walking: {
    rotate: [0, 12, -12, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
  celebrating: {
    rotate: [0, -5, 5, 0],
    transition: {
      duration: 0.4,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
  hiding: {
    rotate: 0,
    transition: { duration: 0.3 },
  },
  worried: {
    rotate: [0, 2, -2, 0],
    transition: {
      duration: 0.2,
      repeat: Infinity,
      ease: 'linear' as const,
    },
  },
  eating: {
    rotate: 0,
    transition: { duration: 0.5 },
  },
};

const legVariantsAlt = {
  idle: {
    rotate: 0,
    transition: { duration: 0.5 },
  },
  walking: {
    rotate: [0, -12, 12, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
  celebrating: {
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 0.4,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
  hiding: {
    rotate: 0,
    transition: { duration: 0.3 },
  },
  worried: {
    rotate: [0, -2, 2, 0],
    transition: {
      duration: 0.2,
      repeat: Infinity,
      ease: 'linear' as const,
    },
  },
  eating: {
    rotate: 0,
    transition: { duration: 0.5 },
  },
};

// ── Head animation variants for eating (head dips down) ──

const headVariants = {
  idle: {
    y: 0,
    transition: { duration: 0.5 },
  },
  walking: {
    y: [0, -2, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
  celebrating: {
    y: [0, -4, 0],
    transition: {
      duration: 0.4,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
  hiding: {
    y: 4,
    transition: { duration: 0.3 },
  },
  worried: {
    y: [0, 1, -1, 0],
    transition: {
      duration: 0.3,
      repeat: Infinity,
      ease: 'linear' as const,
    },
  },
  eating: {
    y: [0, 10, 10, 0],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      times: [0, 0.3, 0.7, 1],
    },
  },
};

// ── Mouth animation for eating (opens when head is down) ──

const mouthEatingVariants = {
  idle: {
    scaleY: 0,
    opacity: 0,
    transition: { duration: 0.2 },
  },
  walking: {
    scaleY: 0,
    opacity: 0,
    transition: { duration: 0.2 },
  },
  celebrating: {
    scaleY: 0,
    opacity: 0,
    transition: { duration: 0.2 },
  },
  hiding: {
    scaleY: 0,
    opacity: 0,
    transition: { duration: 0.2 },
  },
  worried: {
    scaleY: 0,
    opacity: 0,
    transition: { duration: 0.2 },
  },
  eating: {
    scaleY: [0, 1, 1, 0],
    opacity: [0, 1, 1, 0],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      times: [0, 0.3, 0.7, 1],
    },
  },
};

export default function Pudu({
  state = 'idle',
  size = 'md',
  direction = 'right',
  className = '',
}: AnimalProps) {
  const height = ANIMAL_SIZE_MAP[size];
  const width = Math.round(height * 1.2); // wider viewBox ratio (240:200)

  return (
    <motion.svg
      viewBox="0 0 240 200"
      width={width}
      height={height}
      className={className}
      style={{
        transform: direction === 'left' ? 'scaleX(-1)' : undefined,
        overflow: 'visible',
        maxWidth: '100%',
        height: 'auto',
      }}
      variants={bodyVariants}
      animate={state}
      aria-label="Pascual el Pudu"
      role="img"
    >
      <defs>
        {/* Body gradient - warm reddish-brown */}
        <radialGradient id="pudu-body" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#A0704D" />
          <stop offset="100%" stopColor="#8B5E3C" />
        </radialGradient>

        {/* Head gradient - slightly lighter */}
        <radialGradient id="pudu-head" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#AD7D58" />
          <stop offset="100%" stopColor="#8B5E3C" />
        </radialGradient>

        {/* Belly - lighter underbelly */}
        <radialGradient id="pudu-belly" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C4956A" />
          <stop offset="100%" stopColor="#A0704D" />
        </radialGradient>

        {/* Inner ear */}
        <radialGradient id="pudu-inner-ear" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E0BA94" />
          <stop offset="100%" stopColor="#D4A574" />
        </radialGradient>
      </defs>

      {/* ════════════════════════════════════════ */}
      {/* Grass tufts underneath the pudu          */}
      {/* ════════════════════════════════════════ */}

      {/* Grass tuft 1 - left */}
      <path
        d="M55 172 Q58 158 61 172 Q64 155 67 172 Q70 160 73 172"
        stroke="#5e9438"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />

      {/* Grass tuft 2 - center-left */}
      <path
        d="M95 172 Q97 160 100 172 Q103 152 106 172 Q109 158 112 172"
        stroke="#5e9438"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.65"
      />

      {/* Grass tuft 3 - center-right */}
      <path
        d="M135 172 Q138 156 141 172 Q143 162 146 172 Q149 154 152 172"
        stroke="#5e9438"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />

      {/* Grass tuft 4 - right */}
      <path
        d="M175 172 Q177 162 180 172 Q183 155 186 172"
        stroke="#5e9438"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />

      {/* Ground line - soft */}
      <line
        x1="40"
        y1="174"
        x2="200"
        y2="174"
        stroke="#5e9438"
        strokeWidth="1.5"
        opacity="0.25"
      />

      {/* ════════════════════════════════════════ */}
      {/* Tail                                     */}
      {/* ════════════════════════════════════════ */}
      <motion.ellipse
        cx="72"
        cy="110"
        rx="8"
        ry="6"
        fill="#7A5233"
        variants={tailVariants}
        animate={state}
        style={{ originX: '80px', originY: '110px' }}
      />

      {/* ════════════════════════════════════════ */}
      {/* Hind legs (behind body)                  */}
      {/* ════════════════════════════════════════ */}
      <motion.g
        variants={legVariantsAlt}
        animate={state}
        style={{ originX: '95px', originY: '145px' }}
      >
        {/* Hind-left leg */}
        <rect x="89" y="145" width="13" height="22" rx="6.5" fill="#7A5233" />
        {/* Hoof */}
        <ellipse cx="95.5" cy="168" rx="7.5" ry="4.5" fill="#3D2B1F" />
      </motion.g>

      <motion.g
        variants={legVariants}
        animate={state}
        style={{ originX: '107px', originY: '145px' }}
      >
        {/* Hind-right leg */}
        <rect x="101" y="145" width="13" height="22" rx="6.5" fill="#8B5E3C" />
        <ellipse cx="107.5" cy="168" rx="7.5" ry="4.5" fill="#3D2B1F" />
      </motion.g>

      {/* ════════════════════════════════════════ */}
      {/* Front legs (behind body)                 */}
      {/* ════════════════════════════════════════ */}
      <motion.g
        variants={legVariants}
        animate={state}
        style={{ originX: '138px', originY: '145px' }}
      >
        {/* Front-left leg */}
        <rect x="132" y="145" width="12" height="22" rx="6" fill="#7A5233" />
        <ellipse cx="138" cy="168" rx="7" ry="4.5" fill="#3D2B1F" />
      </motion.g>

      <motion.g
        variants={legVariantsAlt}
        animate={state}
        style={{ originX: '150px', originY: '145px' }}
      >
        {/* Front-right leg */}
        <rect x="144" y="145" width="12" height="22" rx="6" fill="#8B5E3C" />
        <ellipse cx="150" cy="168" rx="7" ry="4.5" fill="#3D2B1F" />
      </motion.g>

      {/* ════════════════════════════════════════ */}
      {/* Body - big round barrel                  */}
      {/* ════════════════════════════════════════ */}
      <ellipse cx="120" cy="125" rx="50" ry="35" fill="url(#pudu-body)" />

      {/* Belly highlight */}
      <ellipse cx="120" cy="137" rx="35" ry="18" fill="url(#pudu-belly)" />

      {/* Body spots - subtle darker patches */}
      <circle cx="105" cy="118" r="5" fill="#7A5233" opacity="0.25" />
      <circle cx="130" cy="115" r="4" fill="#7A5233" opacity="0.2" />
      <circle cx="112" cy="132" r="3.5" fill="#7A5233" opacity="0.15" />

      {/* ════════════════════════════════════════ */}
      {/* Neck                                     */}
      {/* ════════════════════════════════════════ */}
      <ellipse cx="155" cy="102" rx="16" ry="25" fill="#8B5E3C" />

      {/* ════════════════════════════════════════ */}
      {/* Head group (animated for eating dip)     */}
      {/* ════════════════════════════════════════ */}
      <motion.g
        variants={headVariants}
        animate={state}
        style={{ originX: '168px', originY: '85px' }}
      >
        {/* Head - round, small compared to body */}
        <ellipse cx="168" cy="78" rx="18" ry="16" fill="url(#pudu-head)" />

        {/* Cheek / muzzle area */}
        <ellipse cx="178" cy="84" rx="10" ry="8" fill="#B0804F" />

        {/* ── Antler bumps (tiny nubs) ── */}
        <ellipse cx="160" cy="63" rx="2.5" ry="4" fill="#7A5233" />
        <ellipse cx="170" cy="62" rx="2.5" ry="4.5" fill="#7A5233" />

        {/* ── Ears ── */}
        {/* Left ear */}
        <motion.g
          variants={earVariants}
          animate={state}
          style={{ originX: '155px', originY: '70px' }}
        >
          <ellipse cx="153" cy="62" rx="6" ry="10" fill="#8B5E3C" />
          <ellipse cx="153" cy="62" rx="3.5" ry="6.5" fill="url(#pudu-inner-ear)" />
        </motion.g>

        {/* Right ear */}
        <motion.g
          variants={{
            ...earVariants,
            idle: {
              ...earVariants.idle,
              rotate: [0, 5, 0],
              transition: {
                duration: 0.4,
                repeat: Infinity,
                repeatDelay: 3.5,
                ease: 'easeInOut',
              },
            },
          }}
          animate={state}
          style={{ originX: '177px', originY: '70px' }}
        >
          <ellipse cx="179" cy="62" rx="6" ry="10" fill="#8B5E3C" />
          <ellipse cx="179" cy="62" rx="3.5" ry="6.5" fill="url(#pudu-inner-ear)" />
        </motion.g>

        {/* ── Eyes - simple cute dots ── */}
        {state === 'celebrating' ? (
          <>
            {/* Happy crescent eyes when celebrating */}
            <path
              d="M158 76 Q161 72 164 76"
              stroke="#2C1810"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M171 76 Q174 72 177 76"
              stroke="#2C1810"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : (
          <>
            {/* Left eye - simple filled dot */}
            <circle cx="161" cy="76" r="3.5" fill="#2C1810" />
            {/* White highlight */}
            <circle cx="162.5" cy="74.5" r="1.2" fill="#FFFFFF" opacity="0.9" />

            {/* Right eye - simple filled dot */}
            <circle cx="174" cy="76" r="3.5" fill="#2C1810" />
            {/* White highlight */}
            <circle cx="175.5" cy="74.5" r="1.2" fill="#FFFFFF" opacity="0.9" />

            {/* Worried eyes: slightly larger with raised brow lines */}
            {state === 'worried' && (
              <>
                <line
                  x1="158"
                  y1="71"
                  x2="164"
                  y2="72"
                  stroke="#5A3D28"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="177"
                  y1="72"
                  x2="171"
                  y2="71"
                  stroke="#5A3D28"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </>
            )}
          </>
        )}

        {/* ── Nose ── */}
        <ellipse cx="186" cy="83" rx="3.5" ry="2.5" fill="#3D2B1F" />
        {/* Nose highlight */}
        <ellipse cx="185.5" cy="82.2" rx="1.2" ry="0.8" fill="#5A4030" opacity="0.6" />

        {/* ── Mouth ── */}
        {/* Default smile line */}
        {state !== 'worried' && state !== 'eating' && (
          <path
            d="M183 87 Q185 89 187 87.5"
            stroke="#5A3D28"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Worried mouth - slight frown */}
        {state === 'worried' && (
          <path
            d="M182 88 Q185 86 188 88"
            stroke="#5A3D28"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Eating mouth - open circle that animates */}
        <motion.ellipse
          cx="186"
          cy="88"
          rx="3"
          ry="2.5"
          fill="#5A3D28"
          variants={mouthEatingVariants}
          animate={state}
          style={{ originX: '186px', originY: '88px' }}
        />

        {/* Forehead / brow marking - lighter patch */}
        <ellipse cx="168" cy="69" rx="7" ry="3.5" fill="#9A6B42" opacity="0.4" />
      </motion.g>
    </motion.svg>
  );
}
