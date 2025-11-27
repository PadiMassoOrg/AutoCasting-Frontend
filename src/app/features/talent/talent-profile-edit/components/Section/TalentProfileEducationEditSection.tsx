import { ProfileEditSection } from '../../../../../shared/components/Section';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { EducationForm } from '../Form';

const TalentProfileEducationEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  return (
    <ProfileEditSection>
      <EducationForm data={profile.education}></EducationForm>
    </ProfileEditSection>
  );
};

export default TalentProfileEducationEditSection;
