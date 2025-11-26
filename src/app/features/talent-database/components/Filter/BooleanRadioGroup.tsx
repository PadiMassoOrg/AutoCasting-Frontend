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

  const renderRadio = (checked: boolean) => (
    <span className="cursor-pointer inline-flex items-center justify-center">
      <span
        className={
          'flex items-center justify-center h-6 w-6 rounded-full border ' +
          (checked ? 'border-[var(--color-primary-purple)]' : 'border-[var(--color-secondary-outline)]')
        }
      >
        <span
          className={
            'h-3 w-3 rounded-full transition-transform ' +
            (checked ? 'bg-[var(--color-primary-purple)] scale-100' : 'bg-transparent')
          }
        />
      </span>
    </span>
  );

  // manejamos el click en el label, no en el input
  const handleSelect = (next: boolean | undefined) => (e: React.MouseEvent) => {
    e.preventDefault(); // evitamos que el navegador intente cambiar el radio por su cuenta
    if (value === next) return;
    onChange(next);
  };

  return (
    <fieldset className={className}>
      <legend className={legendClassName}>{label}</legend>

      <div className="mt-2 pl-1 flex flex-col gap-2">
        {/* Cualquiera / Todos */}
        <label htmlFor={idAny} className={optionClassName} onClick={handleSelect(undefined)}>
          {renderRadio(tri === '')}
          <input id={idAny} type="radio" name={groupName} checked={tri === ''} readOnly className="sr-only" />
          <span className="cursor-pointer select-none">{t('general.all')}</span>
        </label>

        {/* Sí */}
        <label htmlFor={idYes} className={optionClassName} onClick={handleSelect(true)}>
          {renderRadio(tri === 'true')}
          <input id={idYes} type="radio" name={groupName} checked={tri === 'true'} readOnly className="sr-only" />
          <span className="cursor-pointer select-none">{t('general.yes')}</span>
        </label>

        {/* No */}
        <label htmlFor={idNo} className={optionClassName} onClick={handleSelect(false)}>
          {renderRadio(tri === 'false')}
          <input id={idNo} type="radio" name={groupName} checked={tri === 'false'} readOnly className="sr-only" />
          <span className="cursor-pointer select-none">{t('general.no')}</span>
        </label>
      </div>

      <div className="min-h-[25px]" />
    </fieldset>
  );
}
