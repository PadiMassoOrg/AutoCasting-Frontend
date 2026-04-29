import { Label } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';

type DashboardLoadingLabelProps = {
  className?: string;
};

const DashboardLoadingLabel = ({ className = '' }: DashboardLoadingLabelProps) => {
  const { t } = useTranslation();

  return (
    <Label className={`w-full text-center text-[var(--color-secondary-grey-fonts)] pt-10 ${className}`}>
      {t('state.loading')}
    </Label>
  );
};

export default DashboardLoadingLabel;
