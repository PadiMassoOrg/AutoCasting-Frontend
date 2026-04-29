import { DashboardLoadingLabel, DashboardSection } from '../../../../../layouts/components';
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
