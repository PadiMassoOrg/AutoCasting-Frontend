import { Label } from 'autocasting-ui-library-padimasso';
import type { HTMLAttributes } from 'react';
import React, { useId, useMemo } from 'react';
import type { RadioOption } from './RadioGroupField';

type Props = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  label?: string;
  selected: string[];
  options: RadioOption[];
  disabled?: boolean;
  name?: string;
  onChange: (next: string[]) => void;
  error?: string | null;

  disabledValues?: string[];
  lockedValues?: string[];

  labelClassName?: string;
  wrapperClassName?: string;
  optionsWrapperClassName?: string;
  optionClassName?: string;
};

const normalize = (v: unknown) =>
  String(v ?? '')
    .trim()
    .toLowerCase();

const MultiRadioGroupField = ({
  label,
  selected,
  options,
  disabled = false,
  name,
  onChange,
  error,
  disabledValues = [],
  lockedValues = [],

  wrapperClassName = 'flex flex-col',
  labelClassName = 'text-sm font-semibold mb-3',
  optionsWrapperClassName = 'flex flex-col gap-2',
  optionClassName = 'flex items-center gap-2 text-sm',

  className,
  ...rest
}: Props) => {
  const uid = useId();
  const groupName = (name ?? 'multi-radio') + '__' + uid;

  const normalizedDisabled = useMemo(() => {
    const s = new Set<string>();
    (disabledValues ?? []).forEach((v) => {
      const n = normalize(v);
      if (n) s.add(n);
    });
    return s;
  }, [disabledValues]);

  const normalizedLocked = useMemo(() => {
    const s = new Set<string>();
    (lockedValues ?? []).forEach((v) => {
      const n = normalize(v);
      if (n) s.add(n);
    });
    return s;
  }, [lockedValues]);

  const lockedOptionValues = useMemo(() => {
    const set = new Set<string>();
    (options ?? []).forEach((o) => {
      if (normalizedLocked.has(normalize(o.value))) set.add(o.value);
    });
    return set;
  }, [options, normalizedLocked]);

  const userSelectedSet = useMemo(() => {
    const s = new Set<string>();
    (selected ?? []).forEach((v) => {
      if (!lockedOptionValues.has(v)) s.add(v);
    });
    return s;
  }, [selected, lockedOptionValues]);

  const isLocked = (opt: RadioOption) => lockedOptionValues.has(opt.value);

  const isDisabledOpt = (opt: RadioOption) => {
    if (disabled) return true;
    if (Boolean(opt.disabled)) return true;
    if (isLocked(opt)) return true;
    return normalizedDisabled.has(normalize(opt.value));
  };

  const toggle = (value: string) => {
    if (lockedOptionValues.has(value)) return;

    const next = new Set<string>(userSelectedSet);
    if (next.has(value)) next.delete(value);
    else next.add(value);

    onChange(Array.from(next));
  };

  const errorId = useId();
  const describedBy = error ? `${errorId}-error` : undefined;

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
        aria-describedby={describedBy}
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
    <>
      <div className={[wrapperClassName, className].filter(Boolean).join(' ')} {...rest}>
        {label ? <Label className={labelClassName}>{label}</Label> : null}

        <div className={optionsWrapperClassName}>
          {options.map((opt) => {
            const locked = isLocked(opt);
            const isDisabled = isDisabledOpt(opt);
            const checked = locked || userSelectedSet.has(opt.value);
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
      </div>

      {!error ? (
        <div className="min-h-[25px]" />
      ) : (
        <div className="min-h-[25px]">
          <Label id={`${errorId}-error`} variant="error" className="mt-0.5">
            {error}
          </Label>
        </div>
      )}
    </>
  );
};

export default MultiRadioGroupField;
