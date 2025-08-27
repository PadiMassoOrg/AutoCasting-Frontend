export function Chip({ label, onRemove, t }: { label: string; onRemove?: () => void; t: (k: string) => string }) {
  return (
    <span className="flex items-center gap-1 rounded-xl border border-[var(--color-secondary-outline)] px-3 py-0.5">
      <p className="text-sm">{t(label)}</p>
      {onRemove && (
        <span onClick={onRemove} className="cursor-pointer text-xl font-semibold" aria-label="Remove">
          ×
        </span>
      )}
    </span>
  );
}
