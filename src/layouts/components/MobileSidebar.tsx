import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../../features/auth/services/authService';
import { useProfile } from '../../features/profile-edit/hooks/useProfile';
import { LinkLogo } from '../../shared/components/LinkLogo';
import { ROUTES, USER_ROUTES } from '../../shared/lib/routes';

export default function MobileSidebar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useProfile();

  const toPublicProfile = () => {
    window.location.href = ROUTES.PUBLIC_PROFILE + '/' + data?.publicSlug;
  };

  return (
    <div className="">
      <div className="flex items-center justify-between bg-white p-6">
        <LinkLogo horizontal path={ROUTES.DASHBOARD} />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none cursor-pointer transition duration-300"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {isOpen && (
        <nav className="bg-white shadow-md p-4 transition duration-300">
          {USER_ROUTES.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`block px-2 py-2 rounded cursor-pointer ${pathname === item.path ? 'bg-gray-200 font-semibold' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {t(item.name)}
            </Link>
          ))}
          <li className="block px-2 py-2 rounded cursor-pointer hover:font-bold" onClick={toPublicProfile}>
            Ver Perfil Publico
          </li>
          <li className="block px-2 py-2 rounded cursor-pointer hover:font-bold" onClick={logout}>
            {t('dashboard.logout')}
          </li>
        </nav>
      )}
    </div>
  );
}
