import { FormInputField } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { AccountSideNav } from '../../../../../layouts/components';
import HilighterSvg from '../../../../../shared/icons/HilighterSvg';
import { useTalentProfile } from '../../talent-profile-edit/hooks/useTalentProfile';
import ChangePasswordForm from '../components/ChangePasswordForm';

export default function AccountPanel() {
  const { t } = useTranslation();
  const { data } = useTalentProfile();
  const { openModal } = useModal();

  const handleModal = () => {
    openModal(<ChangePasswordForm />, t('account.page.change_pass_modal.title'), 'lg');
  };

  const isAutocastingAccount = () => {
    return data?.userAccountProvider === 'LOCAL';
  };

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
          <div className="lex flex-col gap-8">
            <div className="relative inline-flex items-center justify-center min-h-[50px] isolation-auto lg:hidden mb-10">
              <div className="text-2xl font-bold relative z-10">{t('account.page.title')}</div>
              <HilighterSvg
                width={110}
                height={56}
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
              />
            </div>
            <div className="hidden lg:flex text-2xl font-bold relative mb-10">{t('account.menu.access')}</div>
            {!isAutocastingAccount() && (
              <div className="flex flex-col py-10 mb-2">
                <p className="mt-[-1.3rem] pl-2 text-[14px] font-light">{t('account.page.warning_account_other')}</p>
              </div>
            )}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <FormInputField
                  id="email"
                  label={t('Email de Acceso')}
                  labelClassName="text-[14px] font-semibold text-start"
                  value={data?.contact.email as string}
                  disabled
                  readOnly
                />
              </div>
              <div className="flex flex-col items-start">
                <FormInputField
                  id="password"
                  label={t('Password')}
                  placeholder={t('********')}
                  labelClassName="text-[14px] font-semibold text-start"
                  readOnly
                  disabled={!isAutocastingAccount()}
                  editable={isAutocastingAccount()}
                  onEdit={() => {
                    handleModal();
                  }}
                />
                {isAutocastingAccount() && (
                  <p className="mt-[-1.3rem] pl-2 text-[12px] font-light">{t('account.page.password_text')}</p>
                )}
              </div>
            </div>
          </div>
          {/* Desktop */}
        </article>
      </div>
    </section>
  );
}
