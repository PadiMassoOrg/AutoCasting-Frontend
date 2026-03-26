import { Icon } from 'autocasting-ui-library-padimasso';

type ChipProps = {
  label: string;
  onRemove?: () => void;
  newItem?: boolean;
};

export default function Chip({ label, onRemove, newItem = false }: ChipProps) {
  return (
    <span
      className={[
        'flex items-center gap-[6px] rounded-xl border px-3 py-1 lg:text-[14px]',
        newItem
          ? 'font-semibold bg-[var(--color-secondary-white)] border-[var(--color-primary-purple)] text-[var(--color-primary-purple)]'
          : 'bg-[var(--color-primary-white)] border-[var(--color-secondary-outline)] text-[var(--color-primary-black)]',
      ].join(' ')}
    >
      <p className="text-sm">{label}</p>
      {onRemove && <Icon name="cross" variant="primary" size={11} onClick={onRemove} />}
    </span>
  );
}
