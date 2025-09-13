import { useTranslation } from 'react-i18next';
import { useProfile } from '../../features/profile-edit/hooks/useProfile';
import HilightLink from '../../shared/components/HilightLink/HilightLink';
import { LinkLogo } from '../../shared/components/LinkLogo';
import { ROUTES } from '../../shared/lib/routes';

const Navbar = () => {
  const { t } = useTranslation();
  const { data } = useProfile();

  return (
    <nav className="w-full h-14 px-10 flex flex-row items-center justify-between">
      <LinkLogo horizontal />

      <ul className="flex flex-row gap-6 items-center">
        <li>
          <HilightLink to={ROUTES.TALENT_DATABASE} label={t('routes.talent-database')} width={96} height={38} />
        </li>

        {data ? (
          <>
            <li>
              <HilightLink to={ROUTES.PROFILE} label={t('routes.profile')} exact={false} width={72} height={34} />
            </li>
            <li>
              <HilightLink to={ROUTES.ACCOUNT} label={t('routes.account')} exact={false} width={78} height={34} />
            </li>
            <li>
              <HilightLink
                to={ROUTES.PUBLIC_PROFILE + '/' + data?.publicSlug}
                label={t('Publico')}
                exact={false}
                width={78}
                height={34}
              />
            </li>
          </>
        ) : (
          <li>
            <HilightLink to={ROUTES.AUTH} label={t('routes.login')} width={62} height={30} />
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
