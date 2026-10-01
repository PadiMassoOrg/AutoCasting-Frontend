import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LinkLogo } from '../../../shared/components/LinkLogo';
import { ROUTES } from '../../../shared/lib/routes';

const PublicFooter = () => {
  const { t } = useTranslation();
  return (
    <section className="w-full bg-[var(--color-secondary-white)] px-10 py-12 border-t  border-[var(--color-secondary-outline))]">
      <div className="flex flex-row items-center justify-between">
        <LinkLogo horizontal />
        <div className="flex flex-col text-xs font-semibold gap-2.5">
          <Link to={ROUTES.SUPPORT}>{t('routes.support')}</Link>
          <Link to={ROUTES.TERMS}>{t('routes.terms')}</Link>
          <Link to={ROUTES.PRIVACY}>{t('routes.privacy')}</Link>
        </div>
      </div>
    </section>
  );
};

export default PublicFooter;
