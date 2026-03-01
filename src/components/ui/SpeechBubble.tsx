import { AnimatePresence, motion } from 'framer-motion';

// ────────────────────────────────────────────
// SpeechBubble — appears next to an animal character
// Pop animation with spring physics, auto-sizing
// ────────────────────────────────────────────

interface SpeechBubbleProps {
  text: string;
  visible: boolean;
  speaker?: string;    // Character name shown above text
  position?: 'left' | 'right' | 'above';
  className?: string;
}

// Tail SVG for each position
function Tail({ position }: { position: 'left' | 'right' | 'above' }) {
  if (position === 'left') {
    // Tail pointing left (animal is to the left)
    return (
      <svg
        className="absolute -left-3 top-1/2 -translate-y-1/2"
        width="14"
        height="20"
        viewBox="0 0 14 20"
        fill="none"
      >
        <path
          d="M14 0 C14 0, 0 10, 14 20"
          fill="white"
          fillOpacity={0.95}
        />
      </svg>
    );
  }

  if (position === 'right') {
    // Tail pointing right (animal is to the right)
    return (
      <svg
        className="absolute -right-3 top-1/2 -translate-y-1/2"
        width="14"
        height="20"
        viewBox="0 0 14 20"
        fill="none"
      >
        <path
          d="M0 0 C0 0, 14 10, 0 20"
          fill="white"
          fillOpacity={0.95}
        />
      </svg>
    );
  }

  // position === 'above' — tail pointing down (animal is below)
  return (
    <svg
      className="absolute -bottom-3 left-1/2 -translate-x-1/2"
      width="20"
      height="14"
      viewBox="0 0 20 14"
      fill="none"
    >
      <path
        d="M0 0 C0 0, 10 14, 20 0"
        fill="white"
        fillOpacity={0.95}
      />
    </svg>
  );
}

// Transform origin based on where the tail is
const originMap = {
  left: 'left center',
  right: 'right center',
  above: 'center bottom',
} as const;

export default function SpeechBubble({
  text,
  visible,
  speaker,
  position = 'above',
  className = '',
}: SpeechBubbleProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`relative inline-block max-w-[240px] ${className}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 350,
            damping: 20,
          }}
          style={{ transformOrigin: originMap[position] }}
        >
          {/* Bubble body */}
          <div className="relative rounded-2xl bg-white/95 backdrop-blur-sm shadow-md px-4 py-3">
            {speaker && (
              <p className="text-forest-600 text-[11px] font-bold font-display mb-0.5 uppercase tracking-wide">
                {speaker}
              </p>
            )}
            <p className="text-bark text-base font-body leading-snug">
              {text}
            </p>
            <Tail position={position} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
