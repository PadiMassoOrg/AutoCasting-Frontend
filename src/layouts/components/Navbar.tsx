import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logout } from '../../features/auth/services/authService';
import { useProfile } from '../../features/profile-edit/hooks/useProfile';
import HilightLink from '../../shared/components/HilightLink/HilightLink';
import { LinkLogo } from '../../shared/components/LinkLogo';
import BurgerIcon from '../../shared/icons/burger.svg';
import { ROUTES } from '../../shared/lib/routes';
import Sidebar from './Sidebar'; // <-- importa el nuevo componente

const Navbar = () => {
  const { t } = useTranslation();
  const { data } = useProfile();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="w-full h-14 px-10 flex flex-row items-center justify-between">
        <LinkLogo horizontal />
        <button
          type="button"
          className="cursor-pointer lg:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
        >
          <img src={BurgerIcon} alt="" className="w-7" />
        </button>

        <ul className="hidden lg:flex flex-row gap-6 items-center">
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

      {/* Sidebar móvil */}
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogout={() => logout()}
        isAuthenticated={!!data}
        publicSlug={data?.publicSlug}
      />
    </>
  );
};

export default Navbar;
