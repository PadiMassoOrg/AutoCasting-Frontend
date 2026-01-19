import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { USER_MODE_TALENT, useUserMode } from '../../../../context/UserModeContext';
import { getAuthToken } from '../../../../shared/lib/cookies';

const ApplySection = () => {
  const { t } = useTranslation();
  const isAuth = getAuthToken();
  const { mode } = useUserMode();

  const showApplySection = isAuth && mode === USER_MODE_TALENT;

  if (showApplySection) {
    return (
      <article className="w-full rounded-xl border border-[var(--color-secondary-outline)] bg-white py-4 px-5 flex flex-col gap-4">
        <h2 className="text-lg font-semibold">{t('casting-database.page.apply_title')}</h2>
        <Separator className="opacity-20 my-2" />
        <Button variant="primary" disabled={!showApplySection}>
          {t('general.apply')}
        </Button>
      </article>
    );
  }
};

export default ApplySection;
