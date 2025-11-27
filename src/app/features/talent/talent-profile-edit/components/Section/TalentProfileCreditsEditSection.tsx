import { ProfileEditSection } from '../../../../../shared/components/Section';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { CreditsForm } from '../Form';

const TalentProfileCreditsEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  return (
    <ProfileEditSection>
      <CreditsForm data={profile.credits}></CreditsForm>
    </ProfileEditSection>
  );
};

export default TalentProfileCreditsEditSection;
