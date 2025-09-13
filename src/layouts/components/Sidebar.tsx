import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LinkLogo } from '../../shared/components/LinkLogo';
import { ROUTES } from '../../shared/lib/routes';

type Props = {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  isAuthenticated?: boolean;
  publicSlug?: string | null;
};

export default function Sidebar({ open, onClose, onLogout, isAuthenticated, publicSlug }: Props) {
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

  const items = [
    { to: ROUTES.TALENT_DATABASE, label: t('routes.talent-database') },
    ...(isAuthenticated
      ? [
          { to: ROUTES.PROFILE, label: t('routes.profile') },
          { to: ROUTES.ACCOUNT, label: t('routes.account') },
          { to: `${ROUTES.PUBLIC_PROFILE}/${publicSlug ?? ''}`, label: t('Publico') },
        ]
      : [{ to: ROUTES.AUTH, label: t('routes.login') }]),
  ];

  return (
    <div aria-modal="true" role="dialog" className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <aside className="absolute inset-0 bg-white flex flex-col pt-5">
        <header className="h-14 px-5 flex items-center justify-between">
          <LinkLogo horizontal />
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close') || 'Cerrar'}
            className="p-2 rounded-md hover:bg-black/5 text-2xl leading-none"
          >
            ×
          </button>
        </header>

        <nav className="px-8 py-6">
          <ul className="flex flex-col gap-8">
            {items.map((it) => (
              <li key={it.to} onClick={onClose}>
                <Link to={it.to} className="block text-5xl font-extrabold leading-none tracking-tight">
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {isAuthenticated && (
          <div className="mt-auto border-t border-black/10 px-8 py-6">
            <button type="button" onClick={onLogout} className="text-lg font-semibold">
              {t('routes.logout') || 'Cerrar Sesión'}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
