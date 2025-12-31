import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import type { EmployerCastingRoleCardResponse } from '../../../types/employerCastings.types';

type Props = {
  role: EmployerCastingRoleCardResponse;
  onCancel: () => void;
  onConfirm: () => void;
};

const CastingRoleDeleteModal = ({ role, onCancel, onConfirm }: Props) => {
  const { t } = useTranslation();

  return (
    <article className="flex flex-col gap-5">
      <p className="text-base">
        {t('general.delete_confirm')}: <strong>{role.roleName}</strong>
      </p>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          {t('buttons.cancel')}
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          {t('buttons.delete')}
        </Button>
      </div>
    </article>
  );
};

export default CastingRoleDeleteModal;
