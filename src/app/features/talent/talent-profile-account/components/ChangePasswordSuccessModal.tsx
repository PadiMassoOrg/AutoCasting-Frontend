import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';

const ChangePasswordSuccessModal = ({ onClose }: { onClose?: () => void }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <p>{t('account.page.change_pass_modal.success_text')}</p>
      <Separator className="opacity-20 my-4"></Separator>
      <div className="flex gap-2 items-center">
        <Button type="submit" onClick={onClose}>
          {t('buttons.understood')}
        </Button>
      </div>
    </div>
  );
};

export default ChangePasswordSuccessModal;
