import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';

type Props = {
  onLogout: () => void;
  onCancel: () => void;
};

const LogoutModal = ({ onLogout, onCancel }: Props) => {
  const { t } = useTranslation();
  return (
    <article className="flex flex-col gap-4">
      <p className="text-base">{t('auth.logout.modal_text')}</p>
      <Separator className="opacity-20 my-2" />

      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          {t('buttons.cancel')}
        </Button>
        <Button onClick={onLogout}>{t('buttons.accept')}</Button>
      </div>
    </article>
  );
};

export default LogoutModal;
