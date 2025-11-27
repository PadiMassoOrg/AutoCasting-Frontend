import { DashboardSection } from '../../../../../layouts/components';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { EducationForm } from '../Form';

const TalentProfileEducationEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  return (
    <DashboardSection>
      <EducationForm data={profile.education}></EducationForm>
    </DashboardSection>
  );
};

export default TalentProfileEducationEditSection;
