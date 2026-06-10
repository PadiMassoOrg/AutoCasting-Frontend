import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';

type FiltersDrawerActionBarProps = {
  onReset: () => void;
  onApply: () => void;
};

export default function FiltersDrawerActionBar({ onReset, onApply }: FiltersDrawerActionBarProps) {
  const { t } = useTranslation();

  const handleApply = () => {
    requestAnimationFrame(() => {
      onApply();
    });
  };

  return (
    <>
      <Separator className="opacity-20 mb-4" />
      <div className="w-full flex flex-row items-center gap-4">
        <Button type="button" variant="outline" className="flex-1" onClick={onReset}>
          {t('general.reset')}
        </Button>
        <Button type="button" variant="primary" className="flex-1" onClick={handleApply}>
          {t('general.apply')}
        </Button>
      </div>
    </>
  );
}
