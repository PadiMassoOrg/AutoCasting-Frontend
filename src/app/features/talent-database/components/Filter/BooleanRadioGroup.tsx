import { useId } from 'react';
import { useTranslation } from 'react-i18next';

type Tri = '' | 'true' | 'false';
const boolToTri = (b: boolean | undefined): Tri => (b === undefined ? '' : b ? 'true' : 'false');

export type BooleanRadioGroupProps = {
  label: string;
  value: boolean | undefined;
  onChange: (next: boolean | undefined) => void;
  name?: string;
  className?: string;
  legendClassName?: string;
  optionClassName?: string;
};

export default function BooleanRadioGroup({
  label,
  value,
  onChange,
  name,
  className = 'flex flex-col gap-1',
  legendClassName = 'text-[14px] font-semibold',
  optionClassName = 'flex items-center gap-2 text-[14px] font-semibold',
}: BooleanRadioGroupProps) {
  const { t } = useTranslation();
  const uid = useId();
  const groupName = (name ?? 'bool') + '__' + uid;
  const tri = boolToTri(value);

  const idAny = `${groupName}-any`;
  const idYes = `${groupName}-yes`;
  const idNo = `${groupName}-no`;

  const renderRadioInput = (checked: boolean, props: React.InputHTMLAttributes<HTMLInputElement>) => (
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
          border-[var(--color-secondary-outline)]
          appearance-none
          cursor-pointer
          checked:border-[var(--color-primary-purple)]
          bg-white
          transition-colors
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
    <fieldset className={className}>
      <legend className={legendClassName}>{label}</legend>

      <div className="mt-2 pl-1 flex flex-col gap-2">
        {/* Cualquiera / Todos */}
        <label htmlFor={idAny} className={optionClassName}>
          {renderRadioInput(tri === '', {
            id: idAny,
            name: groupName,
            onChange: () => onChange(undefined),
          })}
          <span className="cursor-pointer select-none">{t('general.all')}</span>
        </label>

        {/* Sí */}
        <label htmlFor={idYes} className={optionClassName}>
          {renderRadioInput(tri === 'true', {
            id: idYes,
            name: groupName,
            onChange: () => onChange(true),
          })}
          <span className="cursor-pointer select-none">{t('general.yes')}</span>
        </label>

        {/* No */}
        <label htmlFor={idNo} className={optionClassName}>
          {renderRadioInput(tri === 'false', {
            id: idNo,
            name: groupName,
            onChange: () => onChange(false),
          })}
          <span className="cursor-pointer select-none">{t('general.no')}</span>
        </label>
      </div>

      <div className="min-h-[25px]" />
    </fieldset>
  );
}
