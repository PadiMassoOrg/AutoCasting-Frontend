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
import { useUserMode } from '../../context/UserModeContext';
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
  const jwt = jwtDecoder(isAuth!);
  const profileUrl = `${ROUTES.PUBLIC_PROFILE}/${jwt?.publicSlug}`;

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
  //const activeProductions = isRouteActive(ROUTES.PRODUCTIONS);

  // Private
  const activeTalentProfile = isRouteActive(ROUTES.TALENT, true);
  const activePublicProfile = isRouteActive(profileUrl, true);
  //const activeAppliedProductions = isRouteActive(ROUTES.TALENT_APPLIED_PRODUCTIONS, true);
  const activeSettings = isRouteActive(ROUTES.TALENT_SETTINGS, true);

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
            <Icon className="w-7" name={'burger'} />
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
            <div className="ml-16 flex flex-row items-center gap-2">
              <Link to={ROUTES.TALENT_DATABASE}>
                <span className={clsx(baseClass, activeTalentDatabase && activeClass)}>
                  {showIcons && (
                    <Icon
                      name="catalog"
                      variant={activeTalentDatabase ? 'primary' : 'default'}
                      size={24}
                      className="w-6"
                    />
                  )}
                  {showLabels && t('routes.talent-database')}
                </span>
              </Link>
              {/* <Link to={ROUTES.PRODUCTIONS}>
                <span className={clsx(baseClass, activeProductions && activeClass)}>
                  {showIcons && (
                    <img src={activeProductions ? ClapperIconPurple : ClapperIcon} alt="" className="w-6" />
                  )}
                  {showLabels && t('routes.productions')}
                </span>
              </Link> */}
              {isAuth && (
                <span className="ml-2">
                  <UserModeSwitcher></UserModeSwitcher>
                </span>
              )}
            </div>
          </div>
          {/* Right: Authenticated */}
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
            ) : mode == 'talent' ? (
              <div className="flex flex-row gap-2 items-center h-full">
                {/* Talent */}
                {/* <Link to={ROUTES.TALENT_APPLIED_PRODUCTIONS}>
                  <span className={clsx(baseClass, activeAppliedProductions && activeClass)}>
                    {showIcons && (
                      <img src={activeAppliedProductions ? FileIconPurple : FileIcon} alt="" className="w-6" />
                    )}
                    {showLabels && t('routes.talent-applied-productions')}
                  </span>
                </Link> */}
                <Link to={profileUrl}>
                  <span className={clsx(baseClass, activePublicProfile && activeClass)}>
                    {showIcons && (
                      <Icon
                        name="view"
                        variant={activePublicProfile ? 'primary' : 'default'}
                        size={24}
                        className="w-6"
                      />
                    )}
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
                    {showIcons && (
                      <Icon
                        name="settings"
                        variant={activeSettings ? 'primary' : 'default'}
                        size={24}
                        className="w-6"
                      />
                    )}
                    {showLabels && t('routes.settings')}
                  </span>
                </Link>
              </div>
            ) : (
              <>{/* Employer */}</>
            )}
            {isAuth && (
              <span
                className="ml-2 cursor-pointer flex flex-row items-center gap-2 text-[var(--color-alert-error)]"
                onClick={logout}
              >
                <Icon name="logout" variant="danger" size={24} className="w-6" /> {showLabels && t('routes.logout')}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
