// ────────────────────────────────────────────
// HeaderBar — top bar with title, stage, parents button
// ────────────────────────────────────────────

interface HeaderBarProps {
  stageName: string;
  stageOrder: number;
  onParents?: () => void;
}

export default function HeaderBar({
  stageName,
  stageOrder,
  onParents,
}: HeaderBarProps) {
  return (
    <div className="flex-shrink-0 bg-forest-700 pt-safe px-4 py-2 flex items-center justify-between">
      {/* Left: Title + subtitle */}
      <div className="min-w-0 flex-1">
        <h1 className="text-sm font-bold italic text-cream leading-tight truncate">
          Las aventuras de Alicia en Chiloé
        </h1>
        <p className="text-[11px] text-cream/60 leading-tight mt-0.5">
          Etapa {stageOrder}: {stageName}
        </p>
      </div>

      {/* Right: Parents button */}
      {onParents && (
        <button
          type="button"
          onClick={onParents}
          className="
            ml-3 flex-shrink-0
            px-3 py-1.5 rounded-lg
            border border-cream/30
            text-cream/70 text-[10px] font-semibold
            hover:bg-cream/10 active:bg-cream/20
            touch-manipulation select-none transition-colors
          "
        >
          Padres
        </button>
      )}
    </div>
  );
}
