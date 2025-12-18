import SectionCard from '../../../../../shared/components/SectionCard/SectionCard';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { EducationForm } from '../Form';

const TalentProfileEducationEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  return (
    <SectionCard>
      <EducationForm data={profile.education}></EducationForm>
    </SectionCard>
  );
};

export default TalentProfileEducationEditSection;
