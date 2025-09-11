import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useProfile } from '../../features/profile-edit/hooks/useProfile';
import { LinkLogo } from '../../shared/components/LinkLogo';
import { ROUTES } from '../../shared/lib/routes';

const PublicNavbar = () => {
  const { t } = useTranslation();
  const { data } = useProfile();

  return (
    <nav className="w-full h-14 px-10 flex flex-row items-center justify-between">
      <LinkLogo horizontal />
      <ul className="flex flex-row gap-4">
        <Link className="font-semibold text-sm" to={ROUTES.TALENT_DATABASE}>
          {t('routes.talent-database')}
        </Link>
        {data ? (
          <div className=" flex flex-row gap-4 font-semibold text-sm">
            <Link className="font-semibold text-sm" to={ROUTES.PROFILE}>
              {t('routes.profile')}
            </Link>
            <Link to={ROUTES.PROFILE}>{t('routes.account')}</Link>
          </div>
        ) : (
          <Link className="font-semibold text-sm" to={ROUTES.AUTH}>
            {t('routes.login')}
          </Link>
        )}
      </ul>
    </nav>
  );
};

export default PublicNavbar;
