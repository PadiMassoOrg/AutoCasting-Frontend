import { Icon } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';

type FilterToggleButtonProps = {
  open?: boolean;
  count?: number;
  onClick: () => void;
  ariaLabel: string;
  ariaPressed?: boolean;
  size?: 'desktop' | 'mobile';
};

export default function FilterToggleButton({
  open = false,
  count = 0,
  onClick,
  ariaLabel,
  ariaPressed,
  size = 'desktop',
}: FilterToggleButtonProps) {
  const [hovered, setHovered] = useState(false);
  const hasActiveCount = count > 0;

  const frameClasses = useMemo(() => {
    if (open || hasActiveCount) {
      return 'border-(--color-primary-purple)';
    }

    if (hovered) {
      return 'border-[#BBA0F0]';
    }

    return 'border-[#E9EBEE]';
  }, [hasActiveCount, hovered, open]);

  const iconVariant = 'primary';
  const boxSizeClasses = size === 'mobile' ? 'h-12 w-12' : 'h-11 w-11';
  const iconSize = 16;

  return (
    <div className="relative inline-flex overflow-visible">
      <button
        type="button"
        className={`inline-flex cursor-pointer items-center justify-center rounded-xl border bg-(--color-primary-white) transition-colors ${boxSizeClasses} ${frameClasses} ${count > 0 && 'border-(--color-primary-purple)'}`}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={ariaLabel}
        aria-pressed={ariaPressed}
      >
        <Icon name="filter" variant={iconVariant} size={iconSize} />
      </button>
      {count > 0 ? (
        <span className="pointer-events-none absolute -right-2 -top-2 z-10 min-w-5 h-5 px-1 inline-flex items-center justify-center rounded-full bg-(--color-primary-purple) text-(--color-primary-white) text-[11px] font-semibold leading-none">
          {count}
        </span>
      ) : null}
    </div>
  );
}
