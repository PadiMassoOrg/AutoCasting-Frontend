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
  accentClassName?: string;
};

export default function BooleanRadioGroup({
  label,
  value,
  onChange,
  name,
  className = 'flex flex-col gap-1',
  legendClassName = 'text-[14px] font-semibold',
  optionClassName = 'flex items-center gap-2 text-[14px] font-semibold',
  accentClassName = 'accent-[var(--color-primary-black)]',
}: BooleanRadioGroupProps) {
  const { t } = useTranslation();
  const uid = useId();
  const groupName = (name ?? 'bool') + '__' + uid;
  const tri = boolToTri(value);
  const idAny = `${groupName}-any`;
  const idYes = `${groupName}-yes`;
  const idNo = `${groupName}-no`;

  const inputBase = `cursor-pointer size-5 ${accentClassName} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 rounded-full`;

  return (
    <fieldset className={className}>
      <legend className={legendClassName}>{label}</legend>
      <div className="mt-2 pl-1 flex flex-col gap-1">
        <div className={optionClassName}>
          <input
            id={idAny}
            type="radio"
            name={groupName}
            checked={tri === ''}
            onChange={() => onChange(undefined)}
            className={inputBase}
          />
          <label htmlFor={idAny}>{t('general.any')}</label>
        </div>

        <div className={optionClassName}>
          <input
            id={idYes}
            type="radio"
            name={groupName}
            checked={tri === 'true'}
            onChange={() => onChange(true)}
            className={inputBase}
          />
          <label htmlFor={idYes}>{t('general.yes')}</label>
        </div>

        <div className={optionClassName}>
          <input
            id={idNo}
            type="radio"
            name={groupName}
            checked={tri === 'false'}
            onChange={() => onChange(false)}
            className={inputBase}
          />
          <label htmlFor={idNo}>{t('general.no')}</label>
        </div>
      </div>
      <div className="min-h-[25px]" />
    </fieldset>
  );
}
