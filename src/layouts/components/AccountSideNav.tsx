import { Separator } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { logout } from '../../features/auth/services/authService';
import { ChevronRight } from '../../shared/components/Chevron';
import HilightLink from '../../shared/components/HilightLink/HilightLink';
import { ROUTES } from '../../shared/lib/routes';

export default function AccountSideNav() {
  const { t } = useTranslation();

  return (
    <article className="hidden lg:relative lg:flex lg:flex-col lg:w-[264px] lg:h-full lg:gap-14 lg:py-6">
      <span className="absolute top-0 right-0 h-[96%] border-r-1 border-black/20"></span>
      <div className="w-full">
        <h2 className="font-bold text-base">{t('account.page.title')}</h2>
      </div>
      <nav className="w-full h-full py-10 flex flex-col justify-between">
        <li className="cursor-pointer flex flex-row items-center gap-2">
          <ChevronRight></ChevronRight>
          <HilightLink label={t('account.menu.access')} to={ROUTES.ACCOUNT} className="text-[18px]"></HilightLink>
        </li>
        <ul className="flex flex-col gap-4">
          {/* <Link
            className="cursor-pointer flex flex-row items-center gap-2  text-[var(--color-secondary-disabled-grey)] text-sm font-semibold"
            to={ROUTES.SUPPORT}
          >
            <ChevronRight></ChevronRight>
            {t('routes.support')}
          </Link>
          <Link
            className="cursor-pointer flex flex-row items-center gap-2  text-[var(--color-secondary-disabled-grey)] text-sm font-semibold"
            to={ROUTES.FAQ}
          >
            <ChevronRight></ChevronRight>
            {t('routes.faq')}
          </Link> */}
          <Separator className="opacity-20 my-3 mr-14" />
          <li
            onClick={() => logout()}
            className="cursor-pointer flex flex-row items-center gap-2  text-[var(--color-secondary-disabled-grey)] text-sm font-semibold"
          >
            <ChevronRight></ChevronRight>
            {t('general.logout')}
          </li>
        </ul>
      </nav>
    </article>
  );
}
