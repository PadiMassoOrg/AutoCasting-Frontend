// shared/components/Radio/ExclusiveRadioGroup.tsx
import React, { useId } from 'react';

export type ExclusiveRadioOption<TMeta = unknown> = {
  value: string; // token (UUID/stringCode/NULL)
  label: string;
  disabled?: boolean;
  meta?: TMeta;
};

export type ExclusiveRadioGroupProps<TMeta = unknown> = {
  label?: string;
  value: string; // selected value
  options: ExclusiveRadioOption<TMeta>[];
  onChange: (next: string) => void;

  name?: string;
  className?: string;
  legendClassName?: string;
  optionClassName?: string;

  renderOption?: (opt: ExclusiveRadioOption<TMeta>, checked: boolean) => React.ReactNode;
};

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

const Circle = ({ checked }: { checked: boolean }) => (
  <span className="relative inline-flex items-center justify-center h-6 w-6">
    <span
      className={cx(
        'h-6 w-6 rounded-full border appearance-none',
        'border-[var(--color-secondary-outline)] bg-white transition-colors',
        checked ? 'border-[var(--color-primary-purple)]' : ''
      )}
    />
    <span
      className={cx(
        'pointer-events-none absolute h-3 w-3 rounded-full',
        'bg-[var(--color-primary-purple)] transition-transform',
        checked ? 'scale-100' : 'scale-0'
      )}
    />
  </span>
);

export default function ExclusiveRadioGroup<TMeta = unknown>({
  label,
  value,
  options,
  onChange,
  name,
  className = 'flex flex-col gap-1',
  legendClassName = 'text-[14px] font-semibold',
  optionClassName = 'flex items-center gap-3 text-[14px] font-semibold',
  renderOption,
}: ExclusiveRadioGroupProps<TMeta>) {
  const uid = useId();
  const groupName = (name ?? 'exclusive-radio') + '__' + uid;

  return (
    <fieldset className={className}>
      {label ? <legend className={legendClassName}>{label}</legend> : null}

      <div className="mt-2 pl-1 flex flex-col gap-3">
        {(options ?? []).map((opt) => {
          const checked = opt.value === value;
          const id = `${groupName}-${opt.value}`;

          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={cx(optionClassName, opt.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer')}
            >
              <input
                id={id}
                name={groupName}
                type="radio"
                value={opt.value}
                checked={checked}
                disabled={!!opt.disabled}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />

              <Circle checked={checked} />

              {renderOption ? renderOption(opt, checked) : <span className="select-none">{opt.label}</span>}
            </label>
          );
        })}
      </div>

      <div className="min-h-[10px]" />
    </fieldset>
  );
}
