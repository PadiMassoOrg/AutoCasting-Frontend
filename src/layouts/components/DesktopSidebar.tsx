import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../../features/auth/services/authService';
import { useProfile } from '../../features/profile-edit/hooks/useProfile';
import { LinkLogo } from '../../shared/components/LinkLogo';
import { ROUTES, USER_ROUTES } from '../../shared/lib/routes';

export default function DesktopSidebar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { data } = useProfile();

  const toPublicProfile = () => {
    window.location.href = ROUTES.PUBLIC_PROFILE + '/' + data?.publicSlug;
  };

  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:h-screen md:w-[264px] shrink-0 bg-white p-6 border-r border-r-[var(--color-secondary-grey)] z-20">
      <LinkLogo path={ROUTES.DASHBOARD} />
      <div className="mt-8 space-y-4">
        {USER_ROUTES.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`block px-4 py-2 rounded text-sm font-medium ${
              pathname === item.path
                ? 'bg-gray-100 text-gray-900 font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {t(item.name)}
          </Link>
        ))}
        <li className="block px-2 py-2 rounded cursor-pointer hover:font-bold" onClick={toPublicProfile}>
          Ver Perfil Publico
        </li>
        <li className="block px-4 py-2 rounded cursor-pointer hover:font-bold" onClick={logout}>
          {t('dashboard.logout')}
        </li>
      </div>
    </aside>
  );
}
