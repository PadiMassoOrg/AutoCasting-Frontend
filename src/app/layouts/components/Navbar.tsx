import { Button, Tooltip } from 'autocasting-ui-library-padimasso';
import { forwardRef, type HTMLAttributes, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { useAuthToken } from '../../features/auth/hooks/useAuthToken';
import { logout } from '../../features/auth/services/authService';
import { LinkLogo } from '../../shared/components/LinkLogo';
import { ROUTES } from '../../shared/lib/routes';
import { Sidebar } from './';
import UserModeSwitcher from './UserModeSwitcher';

import { Icon } from 'autocasting-ui-library-padimasso';
import clsx from 'clsx';
import { useModal } from '../../context/ModalContext';
import { USER_MODE_TALENT, useUserMode } from '../../context/UserModeContext';
import { LogoutModal } from '../../features/auth/components';

type NavbarVariant = 'icons' | 'icons-labels' | 'labels';
type NavbarProps = HTMLAttributes<HTMLElement> & {
  variant?: NavbarVariant;
};

const Navbar = forwardRef<HTMLElement, NavbarProps>(function Navbar({ className = '', variant, ...props }, ref) {
  const { t } = useTranslation();
  const location = useLocation();
  const { openModal, closeModal } = useModal();
  const isAuth = useAuthToken();
  const { mode } = useUserMode();

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

  const logoutModal = () => {
    openModal(
      <LogoutModal
        onCancel={closeModal}
        onLogout={() => {
          logout();
        }}
      />,
      t('auth.logout.modal_title'),
      'lg'
    );
  };

  // Public
  const activeTalentDatabase = isRouteActive(ROUTES.TALENT_DATABASE);
  const activeCastingDatabase = isRouteActive(ROUTES.CASTING_DATABASE);
  // Talent
  const activeAppliedCastings = isRouteActive(ROUTES.TALENT_APPLIED_CASTINGS, true);
  const activeTalentProfile = isRouteActive(ROUTES.TALENT, true);
  const activeSettings = isRouteActive(ROUTES.TALENT_SETTINGS, true);
  // Employer
  const activeEmployerProfile = isRouteActive(ROUTES.EMPLOYER, true);
  const activeEmployerCastings = isRouteActive(ROUTES.EMPLOYER_CASTINGS, true);
  const activeEmployerSettings = isRouteActive(ROUTES.EMPLOYER_SETTINGS, true);

  return (
    <nav
      ref={ref}
      {...props}
      className={`w-full bg-[var(--color-primary-white)] border-[var(--color-secondary-outline)] border-b ${className}`}
    >
      <div className="relative py-3 px-8 bg-[var(--color-primary-white)]">
        {/* Mobile */}
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

        {/* Sidebar */}
        <Sidebar
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onLogout={() => logout()}
          isAuthenticated={isAuth != null}
        />

        {/* Desktop */}
        <div className="hidden lg:flex flex-row items-center justify-between ">
          <div className="flex flex-row items-center">
            <LinkLogo horizontal path={ROUTES.HOME} />
            <div className="ml-16 flex flex-row items-center gap-2">
              <Link to={ROUTES.TALENT_DATABASE}>
                <span className={clsx(baseClass, activeTalentDatabase && activeClass)}>
                  {showIcons && (
                    <Tooltip title={t('general.tooltips.talent_database')} position="bottomLeft" nudgeX={-10}>
                      <Icon name="catalog" variant={activeTalentDatabase ? 'primary' : 'default'} />
                    </Tooltip>
                  )}
                  {showLabels && t('routes.talent-database')}
                </span>
              </Link>
              <Link to={ROUTES.CASTING_DATABASE}>
                <span className={clsx(baseClass, activeCastingDatabase && activeClass)}>
                  {showIcons && (
                    <Tooltip title={t('general.tooltips.casting_database')} position="bottomLeft" nudgeX={-10}>
                      <Icon name="clapper" variant={activeCastingDatabase ? 'primary' : 'default'} />
                    </Tooltip>
                  )}
                  {showLabels && t('routes.casting-database')}
                </span>
              </Link>
              {isAuth && <UserModeSwitcher showTooltip></UserModeSwitcher>}
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
                <Tooltip title={t('general.tooltips.talent_applied_castings')} position="bottomLeft" nudgeY={-8}>
                  <Link to={ROUTES.TALENT_APPLIED_CASTINGS}>
                    <span className={clsx(baseClass, activeAppliedCastings && activeClass)}>
                      {showIcons && (
                        <Icon name="file" variant={activeAppliedCastings ? 'primary' : 'default'} className="w-6" />
                      )}
                      {showLabels && t('routes.talent-applied-castings')}
                    </span>
                  </Link>
                </Tooltip>
                <Tooltip title={t('general.tooltips.profile')} position="bottomLeft" nudgeY={-8}>
                  <Link to={ROUTES.TALENT}>
                    <span className={clsx(baseClass, activeTalentProfile && activeClass)}>
                      {showIcons && (
                        <Icon name="profile" variant={activeTalentProfile ? 'primary' : 'default'} className="w-6" />
                      )}
                      {showLabels && t('routes.profile')}
                    </span>
                  </Link>
                </Tooltip>
                <Tooltip title={t('general.tooltips.settings')} position="bottomRight" nudgeY={-8}>
                  <Link to={ROUTES.TALENT_SETTINGS}>
                    <span className={clsx(baseClass, activeSettings && activeClass)}>
                      {showIcons && <Icon name="settings" variant={activeSettings ? 'primary' : 'default'} />}
                      {showLabels && t('routes.settings')}
                    </span>
                  </Link>
                </Tooltip>
              </div>
            ) : (
              <div className="flex flex-row gap-2 items-center h-full">
                <Tooltip title={t('general.tooltips.employer_castings')} position="bottomRight" nudgeY={-8}>
                  <Link to={ROUTES.EMPLOYER_CASTINGS}>
                    <span className={clsx(baseClass, activeEmployerCastings && activeClass)}>
                      {showIcons && (
                        <Icon
                          name="clapperManage"
                          variant={activeEmployerCastings ? 'primary' : 'default'}
                          className="w-6"
                        />
                      )}
                      {showLabels && t('routes.employer_castings')}
                    </span>
                  </Link>
                </Tooltip>
                <Tooltip title={t('general.tooltips.profile')} position="bottomRight" nudgeY={-8}>
                  <Link to={ROUTES.EMPLOYER}>
                    <span className={clsx(baseClass, activeEmployerProfile && activeClass)}>
                      {showIcons && (
                        <Icon name="profile" variant={activeEmployerProfile ? 'primary' : 'default'} className="w-6" />
                      )}
                      {showLabels && t('routes.profile')}
                    </span>
                  </Link>
                </Tooltip>
                <Tooltip title={t('general.tooltips.settings')} position="bottomRight" nudgeY={-8}>
                  <Link to={ROUTES.EMPLOYER_SETTINGS}>
                    <span className={clsx(baseClass, activeEmployerSettings && activeClass)}>
                      {showIcons && <Icon name="settings" variant={activeEmployerSettings ? 'primary' : 'default'} />}
                      {showLabels && t('routes.settings')}
                    </span>
                  </Link>
                </Tooltip>
              </div>
            )}
            {isAuth && (
              <Tooltip title={t('general.tooltips.logout')} position="bottomRight" nudgeY={-2}>
                <span
                  className="ml-2 cursor-pointer flex flex-row items-center gap-2 text-[var(--color-alert-error)]"
                  onClick={logoutModal}
                >
                  <Icon name="logout" variant="danger" /> {showLabels && t('routes.logout')}
                </span>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
