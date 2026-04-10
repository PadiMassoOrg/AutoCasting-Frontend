import { Label } from 'autocasting-ui-library-padimasso';
import clsx from 'clsx';
import type { HTMLAttributes } from 'react';
import React, { useEffect, useId, useMemo, useRef } from 'react';
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

  // NEW (opt-in)
  mustSelectOne?: boolean;

  labelClassName?: string;
  wrapperClassName?: string;
  optionsWrapperClassName?: string;
  optionClassName?: string;

  required?: boolean;
};

const normalize = (v: unknown) =>
  String(v ?? '')
    .trim()
    .toLowerCase();

// clave consistente para comparar (evita number vs string, y espacios)
const toKey = (v: unknown) => String(v ?? '').trim();

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

  mustSelectOne = false,

  wrapperClassName,
  labelClassName,
  optionsWrapperClassName,
  optionClassName,

  required = false,
  className,
  ...rest
}: Props) => {
  const uid = useId();
  const groupName = (name ?? 'multi-radio') + '__' + uid;

  const finalWrapperClassName = clsx('flex flex-col', wrapperClassName);
  const finalLabelClassName = clsx('text-sm font-semibold mb-3', labelClassName);
  const finalOptionsWrapperClassName = clsx('flex flex-col gap-2', optionsWrapperClassName);
  const finalOptionClassName = clsx('flex items-center gap-2 text-sm', optionClassName);

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

  const isLocked = (opt: RadioOption) => normalizedLocked.has(normalize(opt.value));

  const isDisabledOpt = (opt: RadioOption) => {
    if (disabled) return true;
    if (Boolean(opt.disabled)) return true;
    if (isLocked(opt)) return true;
    return normalizedDisabled.has(normalize(opt.value));
  };

  // Selected como claves consistentes
  const selectedKeys = useMemo(() => (selected ?? []).map(toKey).filter(Boolean), [selected]);
  const selectedSet = useMemo(() => new Set(selectedKeys), [selectedKeys]);

  // Primera opción realmente seleccionable
  const firstSelectableValue = useMemo(() => {
    if (!mustSelectOne) return null;
    const first = (options ?? []).find((opt) => !isDisabledOpt(opt));
    const v = first ? toKey(first.value) : '';
    return v || null;
  }, [mustSelectOne, options, normalizedDisabled, normalizedLocked, disabled]);

  // Guard para no spamear onChange
  const didAutoSelectRef = useRef(false);

  useEffect(() => {
    if (!mustSelectOne) {
      didAutoSelectRef.current = false;
      return;
    }

    // Si ya hay algo seleccionado, no hacemos nada.
    if (selectedSet.size > 0) {
      didAutoSelectRef.current = true;
      return;
    }

    // No hay opción seleccionable => no podemos forzar nada.
    if (!firstSelectableValue) return;

    // Auto-select una sola vez por “apertura” (cuando selected llega vacío)
    if (didAutoSelectRef.current) return;
    didAutoSelectRef.current = true;

    // Microtask: evita que el parent (reset de modal / StrictMode) lo pise
    queueMicrotask(() => {
      onChange([firstSelectableValue]);
    });
  }, [mustSelectOne, selectedSet.size, firstSelectableValue, onChange]);

  const toggle = (rawValue: string) => {
    const value = toKey(rawValue);
    const next = new Set<string>(selectedSet);

    if (next.has(value)) {
      // si mustSelectOne, no permitir quedar vacío
      if (mustSelectOne && next.size === 1) return;
      next.delete(value);
    } else {
      next.add(value);
    }

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
          border-(--color-secondary-outline)
          appearance-none
          cursor-pointer
          checked:border-(--color-primary-purple)
          bg-white
          text-sm
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
          bg-(--color-primary-purple)
          scale-0
          peer-checked:scale-100
          transition-transform
        "
      />
    </span>
  );

  return (
    <>
      <div className={clsx(finalWrapperClassName, className)} {...rest}>
        {label ? (
          <Label className={finalLabelClassName}>
            {label}
            {required ? (
              <span className="text-red-500 ml-1" aria-hidden="true">
                *
              </span>
            ) : null}
          </Label>
        ) : null}

        <div className={finalOptionsWrapperClassName}>
          {options.map((opt) => {
            const value = toKey(opt.value);
            const locked = isLocked(opt);
            const isDisabled = isDisabledOpt(opt);
            const checked = locked || selectedSet.has(value);
            const id = `${groupName}--${value}`;

            return (
              <label
                key={value}
                htmlFor={id}
                className={clsx(finalOptionClassName, isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer')}
              >
                {renderCircleCheckbox(checked, {
                  id,
                  name: groupName,
                  value,
                  disabled: isDisabled,
                  onChange: () => {
                    if (isDisabled) return;
                    toggle(value);
                  },
                })}
                <span className="cursor-pointer select-none">{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {!error ? (
        <div className="min-h-6.25" />
      ) : (
        <div className="min-h-6.25">
          <Label id={`${errorId}-error`} variant="error" className="mt-0.5">
            {error}
          </Label>
        </div>
      )}
    </>
  );
};

export default MultiRadioGroupField;
