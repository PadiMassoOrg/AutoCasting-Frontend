import { Label } from 'autocasting-ui-library-padimasso';
import clsx from 'clsx';
import type { HTMLAttributes } from 'react';
import { useId } from 'react';

export type RadioOption<TMeta = unknown> = {
  value: string;
  label: string;
  disabled?: boolean;
  meta?: TMeta;
};

type Props<TMeta = unknown> = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  label?: string;
  value: string;
  options: RadioOption<TMeta>[];
  disabled?: boolean;
  name?: string;
  onValueChange: (value: string) => void;

  renderOption?: (opt: RadioOption<TMeta>, checked: boolean) => React.ReactNode;

  labelClassName?: string;
  wrapperClassName?: string;

  optionsWrapperClassName?: string;
  optionClassName?: string;
  legendClassName?: string;

  required?: boolean;
};

function renderRadioInput(checked: boolean, props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <span className="relative inline-flex items-center justify-center h-6 w-6">
      <input
        {...props}
        type="radio"
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
          bg-(--color-primary-purple)
          scale-0
          peer-checked:scale-100
          transition-transform
        "
      />
    </span>
  );
}

const RadioGroupField = <TMeta,>({
  label,
  value,
  options,
  disabled = false,
  name,
  onValueChange,

  wrapperClassName,
  labelClassName,
  optionsWrapperClassName,
  optionClassName,
  legendClassName,

  required = false,
  className,
  renderOption,
  ...rest
}: Props<TMeta>) => {
  const uid = useId();
  const groupName = (name ?? 'radio') + '__' + uid;

  const finalWrapperClassName = clsx('flex flex-col', wrapperClassName);
  const finalLabelClassName = clsx('text-sm font-semibold mb-3', labelClassName);
  const finalOptionsWrapperClassName = clsx('flex flex-col gap-2', optionsWrapperClassName);
  const finalOptionClassName = clsx('flex items-center gap-2 text-sm', optionClassName);

  return (
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
          const isDisabled = disabled || Boolean(opt.disabled);
          const checked = opt.value === value;
          const id = `${groupName}--${opt.value}`;

          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={clsx(finalOptionClassName, isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer')}
            >
              {renderRadioInput(checked, {
                id,
                name: groupName,
                value: opt.value,
                disabled: isDisabled,
                onChange: () => {
                  if (isDisabled) return;
                  onValueChange(opt.value);
                },
              })}

              {renderOption ? renderOption(opt, checked) : <span className="select-none">{opt.label}</span>}
            </label>
          );
        })}
      </div>

      <div className="min-h-6.25" />
    </div>
  );
};

export default RadioGroupField;
