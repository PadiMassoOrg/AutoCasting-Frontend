import { DashboardLoadingLabel } from 'autocasting-ui-library-padimasso';
import { SettingsSecuritySection } from '../../../features/auth/change-password/components';

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
  if (isLoading || !email) {
    return <DashboardLoadingLabel />;
  }

  return <SettingsSecuritySection email={email} userAccountProvider={userAccountProvider} />;
}
