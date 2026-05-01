import { SettingsSecurityDashboardSection } from '../../../../../shared/components/Settings';
import { useTalentProfile } from '../../../talent-profile-edit/hooks/useTalentProfile';

const TalentSettingsSecuritySection = () => {
  const { data, isLoading } = useTalentProfile();

  return (
    <SettingsSecurityDashboardSection
      email={data?.contact.email}
      isLoading={isLoading}
      userAccountProvider={data?.userAccountProvider}
    />
  );
};

export default TalentSettingsSecuritySection;
