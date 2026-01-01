import { Label } from 'autocasting-ui-library-padimasso';
import type { HTMLAttributes } from 'react';

type Props = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;

  labelClassName?: string;
  wrapperClassName?: string;
};

const CheckboxField = ({
  id,
  label,
  checked,
  disabled = false,
  onCheckedChange,
  labelClassName = 'text-sm',
  wrapperClassName = 'flex items-center gap-2.5',
  className,
  ...rest
}: Props) => {
  return (
    <div className={[wrapperClassName, className].filter(Boolean).join(' ')} {...rest}>
      <span className="relative inline-flex items-center justify-center h-6 w-6">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="
            peer
            h-6 w-6
            rounded-lg
            border
            border-[var(--color-secondary-outline)]
            appearance-none
            cursor-pointer
            checked:border-[var(--color-primary-purple)]
            checked:bg-[var(--color-primary-white)]
            transition-colors
            disabled:cursor-not-allowed
          "
        />
        <svg
          viewBox="0 0 16 16"
          className="
            pointer-events-none
            absolute
            h-3 w-3
            opacity-0
            peer-checked:opacity-100
          "
          aria-hidden="true"
        >
          <path
            d="M3 8.5L6.5 12L13 4"
            fill="none"
            stroke="var(--color-primary-purple)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <Label
        htmlFor={id}
        className={[labelClassName, disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer', 'select-none'].join(
          ' '
        )}
      >
        {label}
      </Label>
    </div>
  );
};

export default CheckboxField;
