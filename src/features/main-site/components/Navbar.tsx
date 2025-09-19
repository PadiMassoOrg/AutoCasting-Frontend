import { Button } from 'autocasting-ui-library-padimasso';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BurgerIcon from '../../../shared/icons/burger.svg';
import { ROUTES } from '../../../shared/lib/routes';
import Sidebar from './Sidebar';
import { LinkLogo } from '../../../shared/components/LinkLogo';
import HilightLink from '../../../shared/components/HilightLink/HilightLink';

const Navbar = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full bg-[var(--color-primary-white)] flex flex-row items-center py-4">
      <nav className="relative w-full px-14 flex flex-row items-center justify-between z-20">
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
            className="text-base font-semibold"
          ></HilightLink>
          <HilightLink
            to={ROUTES.AUTH}
            label={t('routes.login')}
            className="text-base font-semibold text-nowrap"
          ></HilightLink>
          <Button variant="primary" asChild>
            <a href={ROUTES.AUTH}>{t('routes.register')}</a>
          </Button>
        </div>
      </nav>

      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
};

export default Navbar;
