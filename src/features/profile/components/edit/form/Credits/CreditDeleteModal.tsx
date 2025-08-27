import { Button } from 'autocasting-ui-library-padimasso';
import type { Credit } from '../../../../types/profile.types';

const CreditDeleteModal = ({
  credit,
  onConfirm,
  onCancel,
  t,
}: {
  credit: Credit;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  t: (k: string) => string;
}) => {
  return (
    <article className="flex flex-col gap-5">
      <p className="text-base">
        {t('profile.credits.delete_confirm')}: <strong>{credit.projectName}</strong> ({credit.year})
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

export default CreditDeleteModal;
