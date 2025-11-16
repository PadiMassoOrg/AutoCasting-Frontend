import { Button } from 'autocasting-ui-library-padimasso';
import { forwardRef, type HTMLAttributes, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { logout } from '../../features/auth/services/authService';
import { LinkLogo } from '../../shared/components/LinkLogo';
import { getAuthToken } from '../../shared/lib/cookies';
import { ROUTES } from '../../shared/lib/routes';
import Sidebar from './Sidebar';
import UserModeSwitcher from './UserModeSwitcher';

import { useUserMode } from '../../context/UserModeContext';
import BurgerIcon from '../../shared/icons/burger.svg';
import CatalogoIcon from '../../shared/icons/catalogo.svg';
import ClapperIcon from '../../shared/icons/clapper.svg';
import FileIcon from '../../shared/icons/file.svg';
import LogoutIcon from '../../shared/icons/logout-red.svg';
import ProfileIcon from '../../shared/icons/profile.svg';
import SettingsIcon from '../../shared/icons/settings.svg';

type NavbarVariant = 'icons' | 'icons-labels' | 'labels';
type NavbarProps = HTMLAttributes<HTMLElement> & {
  variant?: NavbarVariant;
};

const Navbar = forwardRef<HTMLElement, NavbarProps>(function Navbar({ className = '', variant, ...props }, ref) {
  const { t } = useTranslation();
  const isAuth = getAuthToken();
  const { mode } = useUserMode();

  const [menuOpen, setMenuOpen] = useState(false);

  const effectiveVariant: NavbarVariant = variant ?? (isAuth ? 'icons' : 'icons-labels');

  const showIcons = effectiveVariant !== 'labels';
  const showLabels = effectiveVariant !== 'icons';

  return (
    <nav
      ref={ref}
      {...props}
      className={`w-full bg-[var(--color-primary-white)] border-[var(--color-secondary-outline)] border-b ${className}`}
    >
      <div className="relative py-3 px-6 bg-[var(--color-primary-white)]">
        {/* Mobile */}
        <div className="lg:hidden w-full flex flex-row items-center justify-between">
          <LinkLogo horizontal path={ROUTES.HOME} />
          <button
            type="button"
            className="cursor-pointer lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <img src={BurgerIcon} alt="" className="w-7" />
          </button>
        </div>
        <Sidebar
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onLogout={() => logout()}
          isAuthenticated={isAuth != null}
        />

        {/* Desktop */}
        <div className="hidden lg:flex flex-row items-center justify-between ">
          {/* Left: Public */}
          <div className="flex flex-row items-center">
            <LinkLogo horizontal path={ROUTES.HOME} />
            <div className="ml-16 flex flex-row items-center gap-6">
              <Link to={ROUTES.TALENT_DATABASE}>
                <span className="flex flex-row items-center gap-2">
                  {showIcons && <img src={CatalogoIcon} alt="" className="w-6" />}
                  {showLabels && t('routes.talent-database')}
                </span>
              </Link>
              <Link to={ROUTES.TALENT_DATABASE}>
                <span className="flex flex-row items-center gap-2">
                  {showIcons && <img src={ClapperIcon} alt="" className="w-6" />}
                  {showLabels && t('routes.productions')}
                </span>
              </Link>
              {isAuth && <UserModeSwitcher></UserModeSwitcher>}
            </div>
          </div>
          {/* Right: Authenticated */}
          <div className="flex flex-row gap-6 items-center text-nowrap">
            {!isAuth ? (
              <>
                <Button asChild variant="primaryOutline" className="min-w-[145px]">
                  <Link to={ROUTES.AUTH}>{t('routes.login')}</Link>
                </Button>
                <Button asChild variant="primary" className="min-w-[145px]">
                  <Link to={ROUTES.AUTH_REGISTER}>{t('routes.register')}</Link>
                </Button>
              </>
            ) : mode == 'talent' ? (
              <>
                {/* Talent */}
                <Link to={ROUTES.TALENT_APPLIED_PRODUCTIONS}>
                  <span className="flex flex-row items-center gap-2">
                    {showIcons && <img src={FileIcon} alt="" className="w-6" />}
                    {showLabels && t('routes.talent-applied-productions')}
                  </span>
                </Link>
                <Link to={ROUTES.TALENT}>
                  <span className="flex flex-row items-center gap-2">
                    {showIcons && <img src={ProfileIcon} alt="" className="w-6" />}
                    {showLabels && t('routes.profile')}
                  </span>
                </Link>
                <Link to={ROUTES.ACCOUNT}>
                  <span className="flex flex-row items-center gap-2">
                    {showIcons && <img src={SettingsIcon} alt="" className="w-6" />}
                    {showLabels && t('routes.settings')}
                  </span>
                </Link>
              </>
            ) : (
              <>{/* Employer */}</>
            )}
            {isAuth && (
              <span
                className="cursor-pointer flex flex-row items-center gap-2 text-[var(--color-alert-error)]"
                onClick={logout}
              >
                <img src={LogoutIcon} alt="" className="w-7" />
                {showLabels && t('routes.logout')}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
