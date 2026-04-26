import { SettingsSecuritySection } from '../../../../auth/change-password/components';
import { useTalentProfile } from '../../../talent-profile-edit/hooks/useTalentProfile';

const TalentSettingsSecuritySection = () => {
  const { data } = useTalentProfile();

  return <SettingsSecuritySection email={data?.contact.email!} userAccountProvider={data?.userAccountProvider} />;
};

export default TalentSettingsSecuritySection;
