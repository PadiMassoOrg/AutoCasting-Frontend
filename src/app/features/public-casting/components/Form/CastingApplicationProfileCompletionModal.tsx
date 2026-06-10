import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';

type Props = {
  onCancel: () => void;
  onConfirm: () => void;
};

const CastingApplicationProfileCompletionModal = ({ onCancel, onConfirm }: Props) => {
  const { t } = useTranslation();

  return (
    <article className="flex flex-col gap-6">
      <p className="text-base text-[var(--color-secondary-gray)]">{t('application.profile_completion_modal.text')}</p>

      <Separator className="opacity-20" />

      <div className="flex flex-row items-center gap-4">
        <Button variant="primaryOutline" onClick={onCancel}>
          {t('application.profile_completion_modal.cancel')}
        </Button>
        <Button onClick={onConfirm}>{t('application.profile_completion_modal.confirm')}</Button>
      </div>
    </article>
  );
};

export default CastingApplicationProfileCompletionModal;
