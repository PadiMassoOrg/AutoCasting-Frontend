import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { usePendingAction } from 'autocasting-ui-library-padimasso';

type Props = {
  onConfirm: () => void | Promise<void>;
};
const CastingApplicationConfirmationModal = ({ onConfirm }: Props) => {
  const { t } = useTranslation();
  const { isPending, execute } = usePendingAction();

  const handleConfirm = async () => {
    await execute(onConfirm);
  };

  return (
    <article className="flex flex-col gap-4">
      <p className="text-base">{t('application.confirmation_modal.text')}</p>
      <Separator className="opacity-20 my-2" />

      <div className="flex -2">
        <Button onClick={handleConfirm} loading={isPending}>
          {t('general.finalize')}
        </Button>
      </div>
    </article>
  );
};

export default CastingApplicationConfirmationModal;
