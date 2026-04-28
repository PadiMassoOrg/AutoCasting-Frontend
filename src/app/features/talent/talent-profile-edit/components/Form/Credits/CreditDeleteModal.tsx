import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { usePendingAction } from 'autocasting-ui-library-padimasso';
import type { Credit } from '../../../types/talentProfile.types';

const CreditDeleteModal = ({
  credit,
  onConfirm,
  onCancel,
}: {
  credit: Credit;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}) => {
  const { t } = useTranslation();
  const { isPending, execute } = usePendingAction();

  const handleConfirm = async () => {
    await execute(onConfirm);
  };

  return (
    <article className="flex flex-col gap-5">
      <p className="text-base">
        {t('general.delete_confirm')}: <strong>{credit.projectName}</strong> ({credit.year})
      </p>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          {t('buttons.cancel')}
        </Button>
        <Button variant="primary" onClick={handleConfirm} loading={isPending}>
          {t('buttons.delete')}
        </Button>
      </div>
    </article>
  );
};

export default CreditDeleteModal;
