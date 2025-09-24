import { forwardRef, type HTMLAttributes, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, useLocation, useParams } from 'react-router-dom';
import { logout } from '../../features/auth/services/authService';
import { ProfileCompletionCard } from '../../features/profile-edit/components/ProfileCompletionCard/ProfileCompletionCard';
import { useProfile } from '../../features/profile-edit/hooks/useProfile';
import {
  computeProfileProgress,
  type ProfileProgress,
} from '../../features/profile-edit/services/computeProfileProgress';
import HilightLink from '../../shared/components/HilightLink/HilightLink';
import { LinkLogo } from '../../shared/components/LinkLogo';
import BurgerIcon from '../../shared/icons/burger.svg';
import { ROUTES } from '../../shared/lib/routes';
import AccountDropdown from './AccountDropdown';
import Sidebar from './Sidebar';

type NavbarProps = HTMLAttributes<HTMLElement>;

const Navbar = forwardRef<HTMLElement, NavbarProps>(function Navbar({ className = '', ...props }, ref) {
  const { t } = useTranslation();
  const { data: myProfile } = useProfile();
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isOnProfileEdit = !!matchPath({ path: ROUTES.PROFILE + '/*', end: false }, location.pathname);
  const isOwner = !!myProfile?.publicSlug && myProfile.publicSlug === slug;
  const shouldShowCard = !!myProfile && (isOnProfileEdit || isOwner);

  const progress = useMemo<ProfileProgress | null>(() => {
    if (!shouldShowCard || !myProfile) return null;
    return computeProfileProgress(myProfile);
  }, [shouldShowCard, myProfile]);

  const isEditMode = isOnProfileEdit;

  return (
    <nav ref={ref} {...props} className={`w-full bg-[var(--color-primary-white)] ${className}`}>
      <div className="relative py-4 px-10 2xl:px-30 flex flex-row items-center justify-between bg-[var(--color-primary-white)]">
        <LinkLogo horizontal path={ROUTES.HOME} />
        <button
          type="button"
          className="cursor-pointer lg:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
        >
          <img src={BurgerIcon} alt="" className="w-7" />
        </button>

        <span className="hidden h-auto lg:block lg:absolute lg:w-[310px] lg:left-1/2 lg:-translate-x-1/2">
          {shouldShowCard && progress && (
            <ProfileCompletionCard progress={progress} isEdit={isEditMode} publicSlug={myProfile!.publicSlug} />
          )}
        </span>

        <div className="hidden lg:flex flex-row gap-6 items-center">
          <HilightLink to={ROUTES.TALENT_DATABASE} label={t('routes.talent-database')} width={96} height={38} />
          {myProfile ? (
            <>
              <HilightLink to={ROUTES.PROFILE} label={t('routes.profile')} exact={false} width={72} height={34} />
              <AccountDropdown onLogout={logout} />
            </>
          ) : (
            <HilightLink to={ROUTES.AUTH} label={t('routes.login')} width={62} height={30} />
          )}
        </div>
      </div>

      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogout={() => logout()}
        isAuthenticated={!!myProfile}
      />
    </nav>
  );
});

export default Navbar;
