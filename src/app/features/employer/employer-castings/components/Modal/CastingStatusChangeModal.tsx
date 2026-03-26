import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';

type Props = {
  descriptionKey: string;
  description2Key?: string;
  confirmButtonKey: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isPending?: boolean;
};

const CastingStatusChangeModal = ({
  descriptionKey,
  description2Key,
  confirmButtonKey,
  onConfirm,
  onCancel,
  isPending = false,
}: Props) => {
  const { t } = useTranslation();

  const hasDescription2 = Boolean(description2Key && t(description2Key).trim());

  return (
    <>
      <div className="flex flex-col gap-4 text-sm">
        <p>{t(descriptionKey)}</p>
        {hasDescription2 && <p>{t(description2Key!)}</p>}
      </div>

      <Separator className="opacity-20 my-7" />

      <div className="flex flex-row gap-4">
        <Button variant="outline" onClick={onCancel} disabled={isPending} className="min-w-[180px]">
          {t('buttons.cancel')}
        </Button>

        <Button variant="primary" onClick={onConfirm} disabled={isPending} className="min-w-[180px]">
          {t(confirmButtonKey)}
        </Button>
      </div>
    </>
  );
};

export default CastingStatusChangeModal;
