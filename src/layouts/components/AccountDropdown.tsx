import { useTranslation } from 'react-i18next';
import { NavbarDropdown } from '.';
import { ChevronUpDown } from '../../shared/components/Chevron';
import HilightLink from '../../shared/components/HilightLink/HilightLink';
import { ROUTES } from '../../shared/lib/routes';
import type { MenuItem } from './NavbarDropdown';

export default function AccountDropdown({ onLogout }: { onLogout: () => void }) {
  const { t } = useTranslation();
  const ACTIVE_FOR = [ROUTES.ACCOUNT, ROUTES.AUTH, ROUTES.SUPPORT, ROUTES.FAQ];

  const items: MenuItem[] = [
    { type: 'link', to: ROUTES.ACCOUNT, label: t('routes.access') },
    { type: 'link', to: ROUTES.SUPPORT, label: t('routes.support') },
    { type: 'separator' },
    { type: 'button', onClick: onLogout, label: t('general.logout') },
  ];

  return (
    <NavbarDropdown
      align="right"
      itemClassName="font-semibold text-[14px] opacity-70 hover:opacity-100 transition-all duration-300"
      trigger={
        <div className="flex items-center gap-1 cursor-pointer">
          <HilightLink
            as="span"
            to={ROUTES.ACCOUNT}
            label={t('routes.account')}
            width={78}
            height={34}
            activeFor={ACTIVE_FOR}
          />
          <ChevronUpDown open={false} />
        </div>
      }
      items={items}
    />
  );
}
