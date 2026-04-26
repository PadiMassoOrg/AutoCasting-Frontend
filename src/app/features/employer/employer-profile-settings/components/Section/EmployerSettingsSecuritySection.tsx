import { SettingsSecuritySection } from '../../../../auth/change-password/components';
import { useEmployerProfile } from '../../../employer-profile-edit/hooks/useEmployerProfile';

const EmployerSettingsSecuritySection = () => {
  const { data } = useEmployerProfile();

  return <SettingsSecuritySection email={data?.email!} userAccountProvider={data?.userAccountProvider} />;
};

export default EmployerSettingsSecuritySection;
