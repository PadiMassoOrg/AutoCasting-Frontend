import CrossSmallIconPurple from '../../../shared/icons/cross-small-purple.svg';

type ChipProps = {
  label: string;
  onRemove?: () => void;
  t: (k: string) => string;
  /** Marca el chip como "nuevo" y cambia el background */
  newItem?: boolean;
};

export function Chip({ label, onRemove, t, newItem = false }: ChipProps) {
  return (
    <span
      className={[
        'flex items-center gap-[6px] rounded-lg border px-3.5 py-1',
        newItem
          ? 'font-semibold bg-[var(--color-secondary-white)] border-[var(--color-primary-purple)] text-[var(--color-primary-purple)]'
          : 'bg-[var(--color-primary-white)] border-[var(--color-secondary-outline)] text-[var(--color-primary-black)]',
      ].join(' ')}
    >
      <p className="text-sm">{t(label)}</p>
      {onRemove && (
        <button type="button" onClick={onRemove} className="cursor-pointer flex items-center justify-center">
          <img src={CrossSmallIconPurple} alt="" />
        </button>
      )}
    </span>
  );
}
