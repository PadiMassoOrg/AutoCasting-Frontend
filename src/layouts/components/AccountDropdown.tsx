import { useTranslation } from 'react-i18next';
import { ChevronUpDown } from '../../shared/components/Chevron';
import HilightLink from '../../shared/components/HilightLink/HilightLink';
import { ROUTES } from '../../shared/lib/routes';
import NavbarDropdown, { type MenuItem } from './NavbarDropdown';

export default function AccountDropdown({ onLogout }: { onLogout: () => void }) {
  const { t } = useTranslation();

  const ACTIVE_FOR = [ROUTES.ACCOUNT, ROUTES.AUTH, ROUTES.SUPPORT, ROUTES.FAQ];

  const items: MenuItem[] = [
    { type: 'link', to: ROUTES.ACCOUNT, label: t('routes.access') },
    { type: 'external', href: ROUTES.SUPPORT, label: t('routes.support') },
    { type: 'external', href: ROUTES.FAQ, label: t('routes.faq') },
    { type: 'separator' },
    { type: 'button', onClick: onLogout, label: t('general.logout') },
  ];

  return (
    <NavbarDropdown
      itemClassName="font-extrabold text-[14px]"
      trigger={
        <div className="cursor-pointer flex flex-row items-center">
          <HilightLink to={ROUTES.ACCOUNT} label={t('routes.account')} width={78} height={34} activeFor={ACTIVE_FOR} />
          <ChevronUpDown open={false}></ChevronUpDown>
        </div>
      }
      items={items}
      align="right"
    />
  );
}
