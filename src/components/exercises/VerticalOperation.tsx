import { motion, AnimatePresence } from 'framer-motion';

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

interface VerticalOperationProps {
  operandA: number;
  operandB: number;
  operation: '+' | '-';
  digits: number; // 1, 2, or 3
  hasCarry?: boolean;
  hasBorrow?: boolean;
  userDigits: (number | null)[]; // Current user input per position [ones, tens, hundreds]
  activeDigitIndex: number; // Which digit position is currently active
  showCarryIndicator?: boolean; // Show the "me llevo" indicator
  isCorrect?: boolean | null; // null = not submitted, true/false = result
  className?: string;
}

// ────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────

/** Extract individual digit at `position` (0=ones, 1=tens, 2=hundreds). Returns 0 if out of range. */
function digitAt(num: number, position: number): number {
  return Math.floor(Math.abs(num) / 10 ** position) % 10;
}

/** Pad a number to an array of its digits (most significant first) with length = `cols`. */
function toPaddedDigits(num: number, cols: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = cols - 1; i >= 0; i--) {
    const d = digitAt(num, i);
    // Hide leading zeros: if position > actual number of digits, show null
    if (d === 0 && i >= Math.max(1, String(Math.abs(num)).length)) {
      result.push(null);
    } else {
      result.push(d);
    }
  }
  return result;
}

// ────────────────────────────────────────────
// Animation variants
// ────────────────────────────────────────────

const carryVariants = {
  hidden: { opacity: 0, scale: 0, y: 6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 500, damping: 15 },
  },
  exit: { opacity: 0, scale: 0 },
};

const shakeVariants = {
  shake: {
    x: [0, -6, 6, -4, 4, -2, 2, 0],
    transition: { duration: 0.5 },
  },
};

const correctCelebration = {
  initial: { scale: 1 },
  celebrate: {
    scale: [1, 1.08, 1],
    transition: { duration: 0.4, ease: 'easeInOut' as const },
  },
};

const pulseRing = {
  animate: {
    borderColor: [
      'var(--color-forest-500)',
      'var(--color-forest-300)',
      'var(--color-forest-500)',
    ],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

// ────────────────────────────────────────────
// DigitCell - a single cell in the grid
// ────────────────────────────────────────────

function DigitCell({
  value,
  isPlaceholder,
}: {
  value: number | null;
  isPlaceholder?: boolean;
}) {
  return (
    <div className="flex items-center justify-center w-10 h-11 min-w-[40px] min-h-[44px]">
      <span
        className={`text-3xl font-bold font-display leading-none ${
          isPlaceholder || value === null ? 'text-transparent' : 'text-bark'
        }`}
      >
        {value ?? 0}
      </span>
    </div>
  );
}

// ────────────────────────────────────────────
// InputCell - answer cell with active/correct/wrong states
// ────────────────────────────────────────────

function InputCell({
  value,
  isActive,
  isCorrect,
}: {
  value: number | null;
  isActive: boolean;
  isCorrect: boolean | null;
}) {
  const baseClasses =
    'flex items-center justify-center w-10 h-11 min-w-[40px] min-h-[44px] rounded-lg border-2 transition-colors duration-150';

  let stateClasses: string;
  if (isCorrect === true) {
    stateClasses = 'bg-forest-100 border-forest-500';
  } else if (isCorrect === false) {
    stateClasses = 'border-sunset-500 bg-sunset-100';
  } else if (isActive) {
    stateClasses = 'bg-white border-forest-500';
  } else {
    stateClasses = 'bg-white border-forest-200';
  }

  return (
    <motion.div
      className={`${baseClasses} ${stateClasses}`}
      animate={isActive && isCorrect === null ? 'animate' : undefined}
      variants={isActive && isCorrect === null ? pulseRing : undefined}
    >
      <span className="text-3xl font-bold font-display leading-none text-bark">
        {value !== null ? value : ''}
      </span>
    </motion.div>
  );
}

// ────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────

export default function VerticalOperation({
  operandA,
  operandB,
  operation,
  digits,
  hasCarry = false,
  userDigits,
  activeDigitIndex,
  showCarryIndicator = false,
  isCorrect = null,
  className = '',
}: VerticalOperationProps) {
  // Number of columns: at least `digits`, but allow space for carry result (1 extra)
  const cols = digits + 1; // extra column on the left for possible carry overflow
  const totalWidth = cols + 1; // +1 for the operator symbol column

  const digitsA = toPaddedDigits(operandA, cols);
  const digitsB = toPaddedDigits(operandB, cols);

  // Build the answer input cells (right-to-left: index 0 = ones position)
  // userDigits[0] = ones, userDigits[1] = tens, etc.
  // We display them left-to-right in the grid, so reverse the mapping
  const answerCells: { value: number | null; posIndex: number }[] = [];
  for (let i = cols - 1; i >= 0; i--) {
    answerCells.push({
      value: i < userDigits.length ? userDigits[i] : null,
      posIndex: i,
    });
  }

  // Determine which column indices should show a carry indicator.
  // Carry appears above the tens column (and beyond) when adding ones produces carry.
  // We show carry above each column where the sum of that column's digits >= 10.
  const carryColumns: Set<number> = new Set();
  if (hasCarry && showCarryIndicator && operation === '+') {
    let carry = 0;
    for (let pos = 0; pos < cols; pos++) {
      const sum = digitAt(operandA, pos) + digitAt(operandB, pos) + carry;
      carry = sum >= 10 ? 1 : 0;
      if (carry === 1 && pos + 1 < cols) {
        // carry indicator goes above the next column
        carryColumns.add(pos + 1);
      }
    }
  }

  // The whole answer row wrapper handles shake / celebration
  const answerRowMotionProps =
    isCorrect === false
      ? { variants: shakeVariants, animate: 'shake' }
      : isCorrect === true
        ? { variants: correctCelebration, initial: 'initial', animate: 'celebrate' }
        : {};

  return (
    <div
      className={`inline-flex flex-col items-end select-none ${className}`}
      role="math"
      aria-label={`${operandA} ${operation} ${operandB}`}
    >
      {/* ── Carry row ── */}
      <div className="flex" style={{ minHeight: 20 }}>
        {/* Spacer for operator column */}
        <div className="w-7" />
        {Array.from({ length: cols }).map((_, colIdx) => {
          // colIdx 0 = most-significant position, cols-1 = ones
          const posIndex = cols - 1 - colIdx;
          const showCarry = carryColumns.has(posIndex);
          return (
            <div
              key={`carry-${colIdx}`}
              className="flex items-center justify-center w-10 min-w-[40px] h-5"
            >
              <AnimatePresence>
                {showCarry && (
                  <motion.span
                    key={`carry-indicator-${posIndex}`}
                    className="text-sm font-bold text-sunset-600 font-display"
                    variants={carryVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    1
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* ── Operand A row ── */}
      <div className="flex">
        {/* Operator column spacer (no symbol for first operand) */}
        <div className="w-7" />
        {digitsA.map((d, i) => (
          <DigitCell key={`a-${i}`} value={d} isPlaceholder={d === null} />
        ))}
      </div>

      {/* ── Operand B row (with operator) ── */}
      <div className="flex items-center">
        {/* Operator symbol */}
        <div className="flex items-center justify-center w-7 h-11">
          <span className="text-2xl font-bold text-bark font-display">
            {operation}
          </span>
        </div>
        {digitsB.map((d, i) => (
          <DigitCell key={`b-${i}`} value={d} isPlaceholder={d === null} />
        ))}
      </div>

      {/* ── Horizontal line ── */}
      <div
        className="border-b-[3px] border-bark/70 my-1"
        style={{ width: totalWidth * 40 }}
      />

      {/* ── Answer row ── */}
      <motion.div className="flex" {...answerRowMotionProps}>
        {/* Operator column spacer */}
        <div className="w-7" />
        {answerCells.map((cell) => (
          <InputCell
            key={`ans-${cell.posIndex}`}
            value={cell.value}
            isActive={cell.posIndex === activeDigitIndex && isCorrect === null}
            isCorrect={
              isCorrect === null
                ? null
                : cell.value !== null
                  ? isCorrect
                  : null
            }
          />
        ))}
      </motion.div>
    </div>
  );
}
