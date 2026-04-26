import { FormInputField } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../context/ModalContext';
import SectionCard from '../../../../shared/components/Section/SectionCard';
import ChangePasswordForm from './ChangePasswordForm';

type SettingsSecuritySectionProps = {
  email: string;
  userAccountProvider?: string | null;
};

const SettingsSecuritySection = ({ email, userAccountProvider }: SettingsSecuritySectionProps) => {
  const { t } = useTranslation();
  const { openModal } = useModal();

  const handleModal = () => {
    openModal(<ChangePasswordForm />, t('settings.page.account.change_pass_modal.title'), 'lg');
  };

  const isAutocastingAccount = () => userAccountProvider === 'LOCAL';

  return (
    <SectionCard>
      <div className="flex flex-col">
        {!isAutocastingAccount() && (
          <div className="flex flex-col py-6 mb-2">
            <p className="mt-[-1.3rem] text-[14px] font-light">{t('settings.page.account.warning_account_other')}</p>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div>
            <FormInputField
              id="email"
              label={t('auth.login.email')}
              labelClassName="text-[14px] font-semibold text-start"
              value={email}
              disabled
              readOnly
            />
          </div>
          <div>
            <FormInputField
              id="password"
              label={t('auth.login.password')}
              placeholder={t('********')}
              labelClassName="text-[14px] font-semibold text-start"
              readOnly
              disabled={!isAutocastingAccount()}
              editable={isAutocastingAccount()}
              onEdit={handleModal}
            />
            {isAutocastingAccount() && (
              <p className="mt-[-1.3rem] pl-2 text-[12px] font-light">{t('settings.page.account.password_text')}</p>
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default SettingsSecuritySection;
