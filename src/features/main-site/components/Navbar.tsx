import { Button } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AccountDropdown, Sidebar } from '../../../layouts/components';
import HilightLink from '../../../shared/components/HilightLink/HilightLink';
import { LinkLogo } from '../../../shared/components/LinkLogo';
import BurgerIcon from '../../../shared/icons/burger.svg';
import { ROUTES } from '../../../shared/lib/routes';
import { logout } from '../../app/auth/services/authService';
import { useTalentProfile } from '../../app/talent/talent-profile-edit/hooks/useTalentProfile';

const Navbar = () => {
  const { t } = useTranslation();
  const { data: myProfile } = useTalentProfile();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full bg-[var(--color-primary-white)] flex flex-row items-center py-4">
      <nav className="relative w-full px-6 lg:px-10 flex flex-row items-center justify-between z-20">
        <LinkLogo horizontal />
        <button
          type="button"
          className="cursor-pointer lg:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
        >
          <img src={BurgerIcon} alt="" className="w-7" />
        </button>
        <div className="hidden lg:flex flex-row gap-6 items-center justify-between">
          <HilightLink
            to={ROUTES.TALENT_DATABASE}
            label={t('routes.talent-database')}
            className="text-base font-semibold text-nowrap"
          ></HilightLink>
          {myProfile ? (
            <>
              <HilightLink to={ROUTES.TALENT} label={t('routes.profile')} exact={false} width={72} height={34} />
              <AccountDropdown onLogout={logout} />
            </>
          ) : (
            <>
              <HilightLink
                to={ROUTES.AUTH}
                label={t('routes.login')}
                className="text-base font-semibold text-nowrap"
              ></HilightLink>
              <Button variant="primary" asChild>
                <Link to={ROUTES.AUTH_REGISTER}>{t('routes.register')}</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} onLogout={() => logout()} />
    </div>
  );
};

export default Navbar;
