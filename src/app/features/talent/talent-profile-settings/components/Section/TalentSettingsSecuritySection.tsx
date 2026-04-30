import { DashboardLoadingLabel, DashboardSection } from 'autocasting-ui-library-padimasso';
import { SettingsSecuritySection } from '../../../../auth/change-password/components';
import { useTalentProfile } from '../../../talent-profile-edit/hooks/useTalentProfile';

const TalentSettingsSecuritySection = () => {
  const { data, isLoading } = useTalentProfile();

  if (isLoading || !data) {
    return (
      <DashboardSection>
        <DashboardLoadingLabel />
      </DashboardSection>
    );
  }

  return <SettingsSecuritySection email={data.contact.email!} userAccountProvider={data.userAccountProvider} />;
};

export default TalentSettingsSecuritySection;
