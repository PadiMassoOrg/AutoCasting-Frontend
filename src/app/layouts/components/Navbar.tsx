import { Button } from 'autocasting-ui-library-padimasso';
import { forwardRef, type HTMLAttributes, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { logout } from '../../features/auth/services/authService';
import { LinkLogo } from '../../shared/components/LinkLogo';
import { getAuthToken } from '../../shared/lib/cookies';
import { ROUTES } from '../../shared/lib/routes';
import Sidebar from './Sidebar';
import UserModeSwitcher from './UserModeSwitcher';

import clsx from 'clsx';
import { USER_MODE_TALENT, useUserMode } from '../../context/UserModeContext';
import { Icon } from '../../shared/components/Icon/Icon';
import { jwtDecoder } from '../../shared/utils/jwtDecoder';

type NavbarVariant = 'icons' | 'icons-labels' | 'labels';
type NavbarProps = HTMLAttributes<HTMLElement> & {
  variant?: NavbarVariant;
};

const Navbar = forwardRef<HTMLElement, NavbarProps>(function Navbar({ className = '', variant, ...props }, ref) {
  const { t } = useTranslation();
  const location = useLocation();
  const isAuth = getAuthToken();
  const { mode } = useUserMode();
  const jwt = isAuth ? jwtDecoder(isAuth) : null;
  const talentProfileSlug = jwt?.talentProfileSlug;
  const profileUrl = talentProfileSlug ? `${ROUTES.PUBLIC_PROFILE}/${talentProfileSlug}` : ROUTES.TALENT;

  const [menuOpen, setMenuOpen] = useState(false);

  const effectiveVariant: NavbarVariant = variant ?? (isAuth ? 'icons' : 'icons-labels');
  const showIcons = effectiveVariant !== 'labels';
  const showLabels = effectiveVariant !== 'icons';

  const baseClass = 'p-2 px-3 flex flex-row items-center gap-2';
  const activeClass =
    'rounded-lg bg-[var(--color-secondary-white-nav)] shadow-sm text-[var(--color-primary-purple)] font-semibold';

  const isRouteActive = (to: string, exact = false) => {
    if (exact) {
      return location.pathname === to;
    }
    return !!matchPath({ path: to + '/*', end: false }, location.pathname);
  };

  // Public
  const activeTalentDatabase = isRouteActive(ROUTES.TALENT_DATABASE);
  const activeCastingDatabase = isRouteActive(ROUTES.CASTING_DATABASE);
  // Talent
  const activeTalentProfile = isRouteActive(ROUTES.TALENT, true);
  const activePublicProfile = isRouteActive(profileUrl, true);
  const activeSettings = isRouteActive(ROUTES.TALENT_SETTINGS, true);
  // Employer
  const activeEmployerProfile = isRouteActive(ROUTES.EMPLOYER, true);

  return (
    <nav
      ref={ref}
      {...props}
      className={`w-full bg-[var(--color-primary-white)] border-[var(--color-secondary-outline)] border-b ${className}`}
    >
      <div className="relative py-3 px-6 bg-[var(--color-primary-white)]">
        <div className="lg:hidden w-full flex flex-row items-center justify-between">
          <LinkLogo horizontal path={ROUTES.HOME} />
          <button
            type="button"
            className="cursor-pointer lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Icon name="burger" />
          </button>
        </div>
        <Sidebar
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onLogout={() => logout()}
          isAuthenticated={isAuth != null}
        />

        <div className="hidden lg:flex flex-row items-center justify-between ">
          <div className="flex flex-row items-center">
            <LinkLogo horizontal path={ROUTES.HOME} />
            <div className="ml-16 flex flex-row items-center gap-2">
              <Link to={ROUTES.TALENT_DATABASE}>
                <span className={clsx(baseClass, activeTalentDatabase && activeClass)}>
                  {showIcons && <Icon name="catalog" variant={activeTalentDatabase ? 'primary' : 'default'} />}
                  {showLabels && t('routes.talent-database')}
                </span>
              </Link>
              <Link to={ROUTES.CASTING_DATABASE}>
                <span className={clsx(baseClass, activeCastingDatabase && activeClass)}>
                  {showIcons && <Icon name="clapper" variant={activeCastingDatabase ? 'primary' : 'default'} />}
                  {showLabels && t('routes.casting-database')}
                </span>
              </Link>
              {isAuth && (
                <span className="ml-2">
                  <UserModeSwitcher></UserModeSwitcher>
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center text-nowrap">
            {!isAuth ? (
              <>
                <Button asChild variant="primaryOutline" className="min-w-[145px]">
                  <Link to={ROUTES.AUTH}>{t('routes.login')}</Link>
                </Button>
                <Button asChild variant="primary" className="min-w-[145px]">
                  <Link to={ROUTES.AUTH_REGISTER}>{t('routes.register')}</Link>
                </Button>
              </>
            ) : mode == USER_MODE_TALENT ? (
              <div className="flex flex-row gap-2 items-center h-full">
                <Link to={profileUrl}>
                  <span className={clsx(baseClass, activePublicProfile && activeClass)}>
                    {showIcons && <Icon name="view" variant={activePublicProfile ? 'primary' : 'default'} />}
                    {showLabels && t('routes.profile')}
                  </span>
                </Link>
                <Link to={ROUTES.TALENT}>
                  <span className={clsx(baseClass, activeTalentProfile && activeClass)}>
                    {showIcons && (
                      <Icon
                        name="profile"
                        variant={activeTalentProfile ? 'primary' : 'default'}
                        size={24}
                        className="w-6"
                      />
                    )}
                    {showLabels && t('routes.profile')}
                  </span>
                </Link>
                <Link to={ROUTES.TALENT_SETTINGS}>
                  <span className={clsx(baseClass, activeSettings && activeClass)}>
                    {showIcons && <Icon name="settings" variant={activeSettings ? 'primary' : 'default'} />}
                    {showLabels && t('routes.settings')}
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-row gap-2 items-center h-full">
                <Link to={ROUTES.EMPLOYER}>
                  <span className={clsx(baseClass, activeEmployerProfile && activeClass)}>
                    {showIcons && (
                      <Icon
                        name="profile"
                        variant={activeEmployerProfile ? 'primary' : 'default'}
                        size={24}
                        className="w-6"
                      />
                    )}
                    {showLabels && t('routes.profile')}
                  </span>
                </Link>
              </div>
            )}
            {isAuth && (
              <span
                className="ml-2 cursor-pointer flex flex-row items-center gap-2 text-[var(--color-alert-error)]"
                onClick={logout}
              >
                <Icon name="logout" variant="danger" /> {showLabels && t('routes.logout')}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
