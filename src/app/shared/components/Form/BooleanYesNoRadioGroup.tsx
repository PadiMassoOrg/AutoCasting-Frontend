import clsx from 'clsx';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

export type BooleanYesNoRadioGroupProps = {
  label: string;
  value: boolean | null;
  onChange: (next: boolean) => void;

  name?: string;
  className?: string;
  legendClassName?: string;
  optionClassName?: string;
  disabled?: boolean;

  required?: boolean;
};

export default function BooleanYesNoRadioGroup({
  label,
  value,
  onChange,
  name,
  className,
  legendClassName,
  optionClassName,
  disabled = false,
  required = false,
}: BooleanYesNoRadioGroupProps) {
  const { t } = useTranslation();
  const uid = useId();
  const groupName = (name ?? 'bool') + '__' + uid;

  const finalClassName = clsx('flex flex-col gap-1', className);
  const finalLegendClassName = clsx('text-[14px] font-semibold', legendClassName);
  const finalOptionClassName = clsx('flex items-center gap-2 text-[14px] font-semibold', optionClassName);

  const idYes = `${groupName}-yes`;
  const idNo = `${groupName}-no`;

  const renderRadioInput = (checked: boolean, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <span className="relative inline-flex items-center justify-center h-6 w-6">
      <input
        {...props}
        type="radio"
        checked={checked}
        disabled={disabled}
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
          disabled:opacity-50
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

  return (
    <fieldset className={finalClassName}>
      <legend className={finalLegendClassName}>
        {label}
        {required ? (
          <span className="text-red-500 ml-1" aria-hidden="true">
            *
          </span>
        ) : null}
      </legend>

      {/* Horizontal yes/no */}
      <div className="mt-2 pl-1 flex flex-row items-center gap-6">
        {/* Sí */}
        <label htmlFor={idYes} className={finalOptionClassName}>
          {renderRadioInput(value === true, {
            id: idYes,
            name: groupName,
            onChange: () => onChange(true),
          })}
          <span className="cursor-pointer select-none">{t('general.yes')}</span>
        </label>

        {/* No */}
        <label htmlFor={idNo} className={finalOptionClassName}>
          {renderRadioInput(value === false, {
            id: idNo,
            name: groupName,
            onChange: () => onChange(false),
          })}
          <span className="cursor-pointer select-none">{t('general.no')}</span>
        </label>
      </div>

      <div className="min-h-6.25" />
    </fieldset>
  );
}
