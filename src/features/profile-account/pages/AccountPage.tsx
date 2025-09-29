import { FormInputField } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import AccountSideNav from '../../../layouts/components/AccountSideNav';
import HilighterSvg from '../../../shared/icons/HilighterSvg';
import { useProfile } from '../../profile-edit/hooks/useProfile';

export default function AccountPanel() {
  const { t } = useTranslation();
  const { data } = useProfile();

  return (
    <section className="w-full h-full min-w-0 flex flex-col gap-6">
      <div className="lg:flex lg:flex-row lg:gap-4 h-full min-h-0">
        <AccountSideNav />
        {/* Content */}
        <article
          className="w-full h-full text-center lg:pb-4 lg:py-6 lg:max-w-[650px] xl:max-w-[778px] lg:m-auto
        min-h-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]
        scrollbar-hide"
        >
          {/* Mobile */}
          <div className="lg:hidden flex flex-col gap-8">
            <div className="relative inline-flex items-center justify-center min-h-[50px] isolation-auto">
              <div className="text-2xl font-bold relative z-10">{t('account.page.title')}</div>
              <HilighterSvg
                width={110}
                height={56}
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
              />
            </div>
            <div className="flex flex-col gap-2">
              <FormInputField
                id="access-email"
                label={t('Email de Acceso')}
                labelClassName="font-bold"
                value={data?.contact.email as string}
                editable
                readOnly
                onEdit={() => {
                  console.log('edit');
                }}
              />
            </div>
          </div>
          {/* Desktop */}
        </article>
      </div>
    </section>
  );
}
