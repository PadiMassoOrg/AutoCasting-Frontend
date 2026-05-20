import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';

type Props = {
  onCancel: () => void;
  onSwitchToTalent: () => void;
  loading?: boolean;
};

const CastingApplicationTalentModeModal = ({ onCancel, onSwitchToTalent, loading = false }: Props) => {
  const { t } = useTranslation();

  return (
    <article className="flex flex-col gap-4">
      <p className="text-base text-[var(--color-secondary-gray)]">{t('application.cta_employer_warning')}</p>

      <Separator className="opacity-20 my-2" />

      <div className="flex flex-row items-center gap-2">
        <Button variant="primaryOutline" onClick={onCancel} disabled={loading}>
          {t('general.cancel')}
        </Button>
        <Button onClick={onSwitchToTalent} loading={loading}>
          {t('application.cta_switch_talent')}
        </Button>
      </div>
    </article>
  );
};

export default CastingApplicationTalentModeModal;
