import { DashboardSection } from '../../../../../layouts/components';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { SkillsForm } from '../Form';

const TalentProfileSkillsEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  return (
    <DashboardSection>
      <SkillsForm data={profile.skills}></SkillsForm>
    </DashboardSection>
  );
};

export default TalentProfileSkillsEditSection;
