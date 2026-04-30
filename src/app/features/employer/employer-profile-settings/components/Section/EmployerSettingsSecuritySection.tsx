import { DashboardLoadingLabel, DashboardSection } from 'autocasting-ui-library-padimasso';
import { SettingsSecuritySection } from '../../../../auth/change-password/components';
import { useEmployerProfile } from '../../../employer-profile-edit/hooks/useEmployerProfile';

const EmployerSettingsSecuritySection = () => {
  const { data, isLoading } = useEmployerProfile();

  if (isLoading || !data) {
    return (
      <DashboardSection>
        <DashboardLoadingLabel />
      </DashboardSection>
    );
  }

  return <SettingsSecuritySection email={data.email} userAccountProvider={data.userAccountProvider} />;
};

export default EmployerSettingsSecuritySection;
