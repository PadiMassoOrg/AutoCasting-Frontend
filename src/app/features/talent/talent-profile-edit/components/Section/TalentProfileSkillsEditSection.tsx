import { ProfileEditSection } from '../../../../../shared/components/Section';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { SkillsForm } from '../Form';

const TalentProfileSkillsEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  return (
    <ProfileEditSection>
      <SkillsForm data={profile.skills}></SkillsForm>
    </ProfileEditSection>
  );
};

export default TalentProfileSkillsEditSection;
