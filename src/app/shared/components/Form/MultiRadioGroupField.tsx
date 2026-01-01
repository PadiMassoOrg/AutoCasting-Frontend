import { Label } from 'autocasting-ui-library-padimasso';
import type { HTMLAttributes } from 'react';
import { useId, useMemo } from 'react';
import type { RadioOption } from './RadioGroupField';

type Props = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  label?: string;
  selected: string[];
  options: RadioOption[];
  disabled?: boolean;
  name?: string;
  onChange: (next: string[]) => void;

  labelClassName?: string;
  wrapperClassName?: string;

  optionsWrapperClassName?: string;
  optionClassName?: string;

  minSelections?: number;
};

const MultiRadioGroupField = ({
  label,
  selected,
  options,
  disabled = false,
  name,
  onChange,

  wrapperClassName = 'flex flex-col',
  labelClassName = 'text-sm font-semibold mb-3',
  optionsWrapperClassName = 'flex flex-col gap-2',
  optionClassName = 'flex items-center gap-2 text-sm',

  minSelections,

  className,
  ...rest
}: Props) => {
  const uid = useId();
  const groupName = (name ?? 'multi-radio') + '__' + uid;

  const selectedSet = useMemo(() => new Set(selected ?? []), [selected]);

  const toggle = (value: string) => {
    const next = new Set(selectedSet);
    if (next.has(value)) next.delete(value);
    else next.add(value);

    const arr = Array.from(next);
    if (minSelections != null && arr.length < minSelections) return;

    onChange(arr);
  };

  const renderCircleCheckbox = (checked: boolean, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <span className="relative inline-flex items-center justify-center h-6 w-6">
      <input
        {...props}
        type="checkbox"
        checked={checked}
        className="
          peer
          h-6 w-6
          rounded-full
          border
          border-[var(--color-secondary-outline)]
          appearance-none
          cursor-pointer
          checked:border-[var(--color-primary-purple)]
          bg-white
          transition-colors
          disabled:cursor-not-allowed
        "
      />
      <span
        className="
          pointer-events-none
          absolute
          h-3 w-3
          rounded-full
          bg-[var(--color-primary-purple)]
          scale-0
          peer-checked:scale-100
          transition-transform
        "
      />
    </span>
  );

  return (
    <div className={[wrapperClassName, className].filter(Boolean).join(' ')} {...rest}>
      {label ? <Label className={labelClassName}>{label}</Label> : null}

      <div className={optionsWrapperClassName}>
        {options.map((opt) => {
          const isDisabled = disabled || Boolean(opt.disabled);
          const checked = selectedSet.has(opt.value);
          const id = `${groupName}--${opt.value}`;

          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={[optionClassName, isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'].join(' ')}
            >
              {renderCircleCheckbox(checked, {
                id,
                name: groupName,
                value: opt.value,
                disabled: isDisabled,
                onChange: () => {
                  if (isDisabled) return;
                  toggle(opt.value);
                },
              })}
              <span className="cursor-pointer select-none">{opt.label}</span>
            </label>
          );
        })}
      </div>

      <div className="min-h-[25px]" />
    </div>
  );
};

export default MultiRadioGroupField;
