import { ProfileEditSection } from '../../../../../shared/components/Section';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { CharacteristicsForm } from '../Form';

const TalentProfileDetailsEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  return (
    <ProfileEditSection>
      <CharacteristicsForm data={profile.characteristics}></CharacteristicsForm>
    </ProfileEditSection>
  );
};

export default TalentProfileDetailsEditSection;
