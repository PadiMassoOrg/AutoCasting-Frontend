// src/layouts/DesktopSidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import { ROUTES, USER_ROUTES } from '../../shared/lib/routes';
import { useTranslation } from 'react-i18next';
import { logout } from '../../features/auth/services/authService';
import { LinkLogo } from '../../shared/components/LinkLogo';

export default function DesktopSidebar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <aside className="hidden md:static md:flex flex-col w-56 bg-white min-h-screen p-6 fixed">
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
        <li className="block px-4 py-2 rounded cursor-pointer hover:font-bold" onClick={logout}>
          {t('dashboard.logout')}
        </li>
      </div>
    </aside>
  );
}
