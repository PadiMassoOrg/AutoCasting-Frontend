import { Button } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import type { EmployerCastingRequirementCardResponse } from '../../../types/employerCastings.types';

type Props = {
  data: EmployerCastingRequirementCardResponse;
  onCancel: () => void;
  onConfirm: () => void;
};

const CastingRequirementDeleteModal = ({ data, onCancel, onConfirm }: Props) => {
  const { t } = useTranslation();

  return (
    <article className="flex flex-col gap-5">
      <p className="text-base">
        {t('general.delete_confirm')}: <strong>{data.roleName}</strong>
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

export default CastingRequirementDeleteModal;
