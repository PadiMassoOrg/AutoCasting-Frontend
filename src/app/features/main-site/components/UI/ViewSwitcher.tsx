import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export type MainSiteView = 'talent' | 'employer';

type Props = {
  value: MainSiteView;
  onChange: (view: MainSiteView) => void;
  className?: string;
};

export default function ViewSwitcher({ value, onChange, className }: Props) {
  const { t } = useTranslation();

  const options: { key: MainSiteView; label: string }[] = [
    { key: 'talent', label: t('landing.switcher.talent') },
    { key: 'employer', label: t('landing.switcher.employer') },
  ];

  return (
    <div
      role="tablist"
      aria-label={t('landing.switcher.talent') + ' / ' + t('landing.switcher.employer')}
      className={clsx('inline-flex items-center rounded-full border border-(--color-secondary-outline) p-1', className)}
    >
      {options.map(({ key, label }) => {
        const selected = key === value;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(key)}
            className={clsx(
              'rounded-full px-6 py-4 text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors',
              selected ? 'bg-(--color-primary-purple)/10 text-(--color-primary-purple)' : 'text-(--color-primary-black)'
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
