import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../shared/lib/routes';
import { LinkLogo } from '../../../shared/components/LinkLogo';
import HilightLink from '../../../shared/components/HilightLink/HilightLink';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: Props) {
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
    <div aria-modal="true" role="dialog" className="fixed inset-0 z-[100] lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute inset-0 bg-white flex flex-col pt-5">
        <header className="h-14 px-5 flex items-center justify-between">
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
        <nav className="w-[68%] h-full m-auto">
          <ul className="grid place-items-center w-full h-full">
            <div className="w-full flex flex-col gap-6">
              <div className="w-full flex flex-col gap-6 items-start">
                <li onClick={onClose}>
                  <HilightLink
                    to={ROUTES.HOME}
                    label={t('routes.home')}
                    className="z-[150] block text-[28px] font-extrabold leading-none"
                    width={180}
                    height={60}
                    exact={false}
                  />
                </li>
                <li onClick={onClose}>
                  <HilightLink
                    to={ROUTES.TALENT_DATABASE}
                    label={t('routes.talent-database')}
                    className="z-[150] block text-[28px] font-extrabold leading-none"
                    width={250}
                    height={65}
                    exact={false}
                  />
                </li>
                <li onClick={onClose}>
                  <HilightLink
                    to={ROUTES.AUTH}
                    label={t('routes.login')}
                    className="z-[150] block text-[26px] font-extrabold leading-none"
                    width={270}
                    height={68}
                    exact={false}
                  />
                </li>
              </div>
            </div>
          </ul>
        </nav>
      </aside>
    </div>
  );
}
