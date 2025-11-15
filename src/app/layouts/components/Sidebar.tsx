import { Button, Separator } from 'autocasting-ui-library-padimasso';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LinkLogo } from '../../shared/components/LinkLogo';
import { ROUTES } from '../../shared/lib/routes';

import CatalogoIcon from '../../shared/icons/catalogo.svg';
import ClapperIcon from '../../shared/icons/clapper.svg';
import InstagramIcon from '../../shared/icons/instagram-purple.svg';
import LinkedInIcon from '../../shared/icons/linkedin-purple.svg';
import LogoutIcon from '../../shared/icons/logout-red.svg';
import AccountIcon from '../../shared/icons/profile.svg';
import SettingsIcon from '../../shared/icons/settings.svg';
import SwitcherIcon from '../../shared/icons/switcher-purple.svg';
import Waves from '../../shared/icons/wave.svg';

type Props = {
  open: boolean;
  isAuthenticated: boolean;
  onClose: () => void;
  onLogout: () => void;
};

export default function Sidebar({ open, isAuthenticated, onClose, onLogout }: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;
  return (
    <div aria-modal="true" role="dialog" className="fixed inset-0 z-300 lg:hidden bg-[var(--color-secondary-white)]">
      <img src={Waves} alt="" className="absolute bottom-0 left-0 w-full h-[11rem]" />
      <aside className="absolute inset-0 flex flex-col">
        {/* Header */}
        <header className="py-3 px-6 flex items-center justify-between border-[var(--color-secondary-outline)] border-b bg-white">
          <LinkLogo horizontal />
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close') || 'Cerrar'}
            className="cursor-pointer p-2 rounded-md text-3xl leading-none"
          >
            ×
          </button>
        </header>
        {/* Content */}
        <nav className="w-[65%] h-full m-auto text-base font-semibold ">
          <div className="grid grid-rows-[3.5fr_1fr] place-items-center w-full h-full">
            <div className="w-full flex flex-col pt-10">
              {/* Public */}
              <ul className="w-full flex flex-col gap-5">
                <li onClick={onClose}>
                  <Link to={ROUTES.TALENT_DATABASE}>
                    <span className="flex flex-row items-center gap-2">
                      <img src={CatalogoIcon} alt="" className="w-7" />
                      {t('routes.talent-database')}
                    </span>
                  </Link>
                </li>
                <li onClick={onClose}>
                  <Link to={ROUTES.TALENT_DATABASE}>
                    <span className="flex flex-row items-center gap-2">
                      <img src={ClapperIcon} alt="" className="w-7" />
                      {t('routes.productions')}
                    </span>
                  </Link>
                </li>
                {isAuthenticated && (
                  <li onClick={onClose}>
                    <span className="flex flex-row items-center gap-2 cursor-pointer">
                      <img src={SwitcherIcon} alt="" className="w-7" />
                    </span>
                  </li>
                )}
              </ul>

              <Separator className="opacity-20 my-6" />

              {/* Authenticated */}
              {!isAuthenticated ? (
                <ul className="flex flex-col gap-4">
                  <Button asChild variant="primaryOutline" className="min-w-[145px]">
                    <Link to={ROUTES.AUTH}>{t('routes.login')}</Link>
                  </Button>
                  <Button asChild variant="primary" className="min-w-[145px]">
                    <Link to={ROUTES.AUTH_REGISTER}>{t('routes.register')}</Link>
                  </Button>
                </ul>
              ) : (
                <ul className="w-full flex flex-col gap-6 font-semibold">
                  <li onClick={onClose}>
                    <Link to={ROUTES.TALENT}>
                      <span className="flex flex-row items-center gap-2">
                        <img src={AccountIcon} alt="" className="w-7" />
                        {t('routes.profile')}
                      </span>
                    </Link>
                  </li>
                  <li onClick={onClose}>
                    <Link to={ROUTES.ACCOUNT}>
                      <span className="flex flex-row items-center gap-2">
                        <img src={SettingsIcon} alt="" className="w-7" />
                        {t('routes.settings')}
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
              {isAuthenticated && (
                <>
                  <Separator className="opacity-20 my-6" />
                  <li
                    onClick={() => {
                      onLogout();
                    }}
                  >
                    <span className="flex flex-row items-center gap-2 text-[var(--color-alert-error)]">
                      <img src={LogoutIcon} alt="" className="w-7" />
                      {t('routes.logout')}
                    </span>
                  </li>
                </>
              )}
            </div>
            {/* Terms & Policies // Socials */}
            <div className="w-full flex flex-col items-center gap-4 text-center">
              {/* Terms */}
              <ul className="flex flex-col gap-2 text-sm font-normal text-[var(--color-secondary-grey)]">
                <li onClick={onClose}>
                  <Link to={ROUTES.TERMS}>{t('routes.terms')}</Link>
                </li>
                <li onClick={onClose}>
                  <Link to={ROUTES.PRIVACY}>{t('routes.privacy')}</Link>
                </li>
              </ul>
              {/* Socials */}
              <ul className="flex flex-row gap-2">
                <li onClick={onClose}>
                  <a
                    href={ROUTES.LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                    aria-label={t('routes.linkedIn')}
                    title="LinkedIn"
                  >
                    <img src={LinkedInIcon} alt="" className="w-6" />
                  </a>
                </li>
                <li onClick={onClose}>
                  <a
                    href={ROUTES.INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                    aria-label={t('routes.instagram')}
                    title="Instagram"
                  >
                    <img src={InstagramIcon} alt="" className="w-6" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </aside>
    </div>
  );
}
