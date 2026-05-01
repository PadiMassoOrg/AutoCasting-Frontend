import { SettingsSecurityDashboardSection } from '../../../../../shared/components/Settings';
import { useEmployerProfile } from '../../../employer-profile-edit/hooks/useEmployerProfile';

const EmployerSettingsSecuritySection = () => {
  const { data, isLoading } = useEmployerProfile();

  return (
    <SettingsSecurityDashboardSection
      email={data?.email}
      isLoading={isLoading}
      userAccountProvider={data?.userAccountProvider}
    />
  );
};

export default EmployerSettingsSecuritySection;
