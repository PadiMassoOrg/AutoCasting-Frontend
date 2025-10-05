import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LinkLogo } from '../../../shared/components/LinkLogo';
import { ROUTES } from '../../../shared/lib/routes';

const PublicFooter = () => {
  const { t } = useTranslation();
  return (
    <section className="w-full bg-[var(--color-secondary-outline)] pt-10 pb-7 px-6 lg:px-10">
      <div className="flex flex-col gap-12">
        <div className="flex flex-row items-center justify-between">
          <LinkLogo horizontal />
          <div className="flex flex-col text-sm font-semibold">
            <Link to={ROUTES.SUPPORT}>{t('routes.support')}</Link>
            <Link to={ROUTES.TERMS}>{t('routes.terms')}</Link>
            <Link to={ROUTES.PRIVACY}>{t('routes.privacy')}</Link>
          </div>
        </div>
        <h2 className="text-center font-light text-sm">{t('company.trademark')}</h2>
      </div>
    </section>
  );
};

export default PublicFooter;
