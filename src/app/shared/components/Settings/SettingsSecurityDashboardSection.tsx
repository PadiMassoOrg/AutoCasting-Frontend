import { DashboardLoadingLabel, DashboardSection, LG_SCREEN_SIZE, useMedia } from 'autocasting-ui-library-padimasso';
import { useTranslation } from 'react-i18next';
import { SettingsSecuritySection } from '../../../features/auth/change-password/components';
import { SectionTitle } from '../Section';

type SettingsSecurityDashboardSectionProps = {
  email?: string | null;
  isLoading: boolean;
  userAccountProvider?: string | null;
};

export default function SettingsSecurityDashboardSection({
  email,
  isLoading,
  userAccountProvider,
}: SettingsSecurityDashboardSectionProps) {
  const { t } = useTranslation();
  const isDesktop = useMedia(LG_SCREEN_SIZE);

  if (isLoading || !email) {
    return (
      <DashboardSection>
        {!isDesktop && <SectionTitle title={t('settings.page.title')} />}
        <DashboardLoadingLabel />
      </DashboardSection>
    );
  }

  return (
    <DashboardSection>
      {!isDesktop && <SectionTitle title={t('settings.page.title')} />}
      <SettingsSecuritySection email={email} userAccountProvider={userAccountProvider} />
    </DashboardSection>
  );
}
