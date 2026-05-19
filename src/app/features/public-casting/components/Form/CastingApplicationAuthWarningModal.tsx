import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';

type Props = {
  onLogin: () => void;
  onRegister: () => void;
};

const CastingApplicationAuthWarningModal = ({ onLogin, onRegister }: Props) => {
  const { t } = useTranslation();

  return (
    <article className="flex flex-col gap-4">
      <p className="text-base text-[var(--color-secondary-gray)]">{t('application.cta_auth_warning')}</p>

      <Separator className="opacity-20 my-2" />

      <div className="flex flex-row items-center gap-2">
        <Button variant="primaryOutline" onClick={onLogin}>
          {t('auth.login.submit')}
        </Button>
        <Button onClick={onRegister}>{t('auth.register.submit')}</Button>
      </div>
    </article>
  );
};

export default CastingApplicationAuthWarningModal;
