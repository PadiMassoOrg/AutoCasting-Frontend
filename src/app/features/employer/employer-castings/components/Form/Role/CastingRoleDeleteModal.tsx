import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { usePendingAction } from 'autocasting-ui-library-padimasso';
import type { EmployerCastingRoleCardResponse } from '../../../types/employerCastings.types';

type Props = {
  data: EmployerCastingRoleCardResponse;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

const CastingRoleDeleteModal = ({ data, onCancel, onConfirm }: Props) => {
  const { t } = useTranslation();
  const { isPending, execute } = usePendingAction();

  const handleConfirm = async () => {
    await execute(onConfirm);
  };

  return (
    <article className="flex flex-col gap-5">
      <p className="text-base">
        {t('general.delete_confirm')}: <strong>{data.roleName}</strong>
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

export default CastingRoleDeleteModal;
