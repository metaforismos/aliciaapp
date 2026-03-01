import { motion } from 'framer-motion';

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

interface NumberPadProps {
  onDigit: (digit: number) => void;
  onDelete: () => void;
  onSubmit: () => void;
  disabled?: boolean;
  submitLabel?: string; // default "checkmark"
  className?: string;
}

// ────────────────────────────────────────────
// Key button sub-component
// ────────────────────────────────────────────

type KeyVariant = 'digit' | 'delete' | 'submit';

interface PadKeyProps {
  label: string;
  variant: KeyVariant;
  onPress: () => void;
  disabled: boolean;
}

const variantStyles: Record<KeyVariant, string> = {
  digit:
    'bg-white border-2 border-forest-200 text-bark hover:bg-forest-100 active:bg-forest-200',
  delete:
    'bg-sunset-100 border-2 border-sunset-200 text-sunset-600 hover:bg-sunset-200 active:bg-sunset-300',
  submit:
    'bg-forest-500 border-2 border-forest-600 text-white hover:bg-forest-600 active:bg-forest-700',
};

function PadKey({ label, variant, onPress, disabled }: PadKeyProps) {
  return (
    <motion.button
      type="button"
      className={`
        inline-flex items-center justify-center
        rounded-xl font-bold font-display
        touch-manipulation select-none
        w-[52px] h-[48px] min-w-[44px] min-h-[44px]
        text-xl shadow-sm
        transition-colors duration-100
        ${variantStyles[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      onClick={disabled ? undefined : onPress}
      disabled={disabled}
      aria-label={
        variant === 'delete'
          ? 'Borrar'
          : variant === 'submit'
            ? 'Confirmar'
            : `Numero ${label}`
      }
    >
      {label}
    </motion.button>
  );
}

// ────────────────────────────────────────────
// Number Pad layout
//
// [7] [8] [9]
// [4] [5] [6]
// [1] [2] [3]
// [⌫] [0] [✓]
// ────────────────────────────────────────────

const rows: { label: string; variant: KeyVariant; digit?: number }[][] = [
  [
    { label: '7', variant: 'digit', digit: 7 },
    { label: '8', variant: 'digit', digit: 8 },
    { label: '9', variant: 'digit', digit: 9 },
  ],
  [
    { label: '4', variant: 'digit', digit: 4 },
    { label: '5', variant: 'digit', digit: 5 },
    { label: '6', variant: 'digit', digit: 6 },
  ],
  [
    { label: '1', variant: 'digit', digit: 1 },
    { label: '2', variant: 'digit', digit: 2 },
    { label: '3', variant: 'digit', digit: 3 },
  ],
  [
    { label: '\u232B', variant: 'delete' }, // ⌫
    { label: '0', variant: 'digit', digit: 0 },
    { label: '\u2713', variant: 'submit' }, // ✓
  ],
];

// ────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────

export default function NumberPad({
  onDigit,
  onDelete,
  onSubmit,
  disabled = false,
  submitLabel,
  className = '',
}: NumberPadProps) {
  function handlePress(key: (typeof rows)[number][number]) {
    if (disabled) return;
    if (key.variant === 'delete') {
      onDelete();
    } else if (key.variant === 'submit') {
      onSubmit();
    } else if (key.digit !== undefined) {
      onDigit(key.digit);
    }
  }

  return (
    <div
      className={`inline-flex flex-col gap-1.5 ${className}`}
      role="group"
      aria-label="Teclado numerico"
    >
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1.5 justify-center">
          {row.map((key, keyIdx) => {
            // Allow submitLabel to override the checkmark
            const displayLabel =
              key.variant === 'submit' && submitLabel
                ? submitLabel
                : key.label;

            return (
              <PadKey
                key={`${rowIdx}-${keyIdx}`}
                label={displayLabel}
                variant={key.variant}
                onPress={() => handlePress(key)}
                disabled={disabled}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
