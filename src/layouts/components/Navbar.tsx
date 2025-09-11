import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useProfile } from '../../features/profile-edit/hooks/useProfile';
import { LinkLogo } from '../../shared/components/LinkLogo';
import { ROUTES } from '../../shared/lib/routes';

const Navbar = () => {
  const { t } = useTranslation();
  const { data } = useProfile();

  const toPublicProfile = () => {
    window.location.href = ROUTES.PUBLIC_PROFILE + '/' + data?.publicSlug;
  };

  return (
    <nav className="w-full h-14 px-10 flex flex-row items-center justify-between">
      <LinkLogo horizontal />
      <ul className="flex flex-row gap-6">
        <Link className="font-semibold text-sm" to={ROUTES.TALENT_DATABASE}>
          {t('routes.talent-database')}
        </Link>
        {data ? (
          <div className=" flex flex-row gap-6 font-semibold text-sm">
            <Link className="font-semibold text-sm" to={ROUTES.PROFILE}>
              {t('routes.profile')}
            </Link>
            <Link to={ROUTES.ACCOUNT}>{t('routes.account')}</Link>
            <span onClick={toPublicProfile} className="cursor-pointer">
              Publico
            </span>
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

export default Navbar;
