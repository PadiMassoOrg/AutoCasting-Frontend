import { FormInputField } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../context/ModalContext';
import { DashboardSection } from '../../../../../layouts/components';
import { useTalentProfile } from '../../../talent-profile-edit/hooks/useTalentProfile';
import ChangePasswordForm from '../ChangePasswordForm';

const TalentSettingsSecuritySection = () => {
  const { t } = useTranslation();
  const { data } = useTalentProfile();
  const { openModal } = useModal();

  const handleModal = () => {
    openModal(<ChangePasswordForm />, t('settings.page.account.change_pass_modal.title'), 'lg');
  };

  const isAutocastingAccount = () => {
    return data?.userAccountProvider === 'LOCAL';
  };

  return (
    <DashboardSection>
      <div className="flex flex-col">
        {!isAutocastingAccount() && (
          <div className="flex flex-col py-6 mb-2">
            <p className="mt-[-1.3rem] pl-2 text-[14px] font-light">
              {t('settings.page.account.warning_account_other')}
            </p>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div>
            <FormInputField
              id="email"
              label={t('auth.login.email')}
              labelClassName="text-[14px] font-semibold text-start"
              value={data?.contact.email as string}
              disabled
              readOnly
            />
            {/* {isAutocastingAccount() && (
              <p className="mt-[-1.3rem] pl-2 text-[12px] font-light">{t('settings.page.account.email_text')}</p>
            )} */}
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
              onEdit={() => {
                handleModal();
              }}
            />
            {isAutocastingAccount() && (
              <p className="mt-[-1.3rem] pl-2 text-[12px] font-light">{t('settings.page.account.password_text')}</p>
            )}
          </div>
        </div>
      </div>
    </DashboardSection>
  );
};

export default TalentSettingsSecuritySection;
