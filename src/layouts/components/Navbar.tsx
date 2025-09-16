import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logout } from '../../features/auth/services/authService';
import { useProfile } from '../../features/profile-edit/hooks/useProfile';
import HilightLink from '../../shared/components/HilightLink/HilightLink';
import { LinkLogo } from '../../shared/components/LinkLogo';
import BurgerIcon from '../../shared/icons/burger.svg';
import { ROUTES } from '../../shared/lib/routes';
import AccountDropdown from './AccountDropdown';
import Sidebar from './Sidebar';

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
        <div className="hidden lg:flex flex-row gap-6 items-center">
          <HilightLink to={ROUTES.TALENT_DATABASE} label={t('routes.talent-database')} width={96} height={38} />
          {data ? (
            <>
              <HilightLink to={ROUTES.PROFILE} label={t('routes.profile')} exact={false} width={72} height={34} />

              <AccountDropdown onLogout={logout} />
            </>
          ) : (
            <HilightLink to={ROUTES.AUTH} label={t('routes.login')} width={62} height={30} />
          )}
        </div>
      </nav>

      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} onLogout={() => logout()} isAuthenticated={!!data} />
    </>
  );
};

export default Navbar;
