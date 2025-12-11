import { Icon } from '../Icon/Icon';

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
        'flex items-center gap-[6px] rounded-xl border px-3 py-1 lg:text-[14px]',
        newItem
          ? 'font-semibold bg-[var(--color-secondary-white)] border-[var(--color-primary-purple)] text-[var(--color-primary-purple)]'
          : 'bg-[var(--color-primary-white)] border-[var(--color-secondary-outline)] text-[var(--color-primary-black)]',
      ].join(' ')}
    >
      <p className="text-base">{t(label)}</p>
      {onRemove && <Icon name="cross" variant="primary" size={11} onClick={onRemove} />}
    </span>
  );
}
