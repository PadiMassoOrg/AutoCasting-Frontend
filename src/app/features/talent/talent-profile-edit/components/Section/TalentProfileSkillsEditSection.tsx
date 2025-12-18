import SectionCard from '../../../../../shared/components/SectionCard/SectionCard';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { SkillsForm } from '../Form';

const TalentProfileSkillsEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  return (
    <SectionCard>
      <SkillsForm data={profile.skills}></SkillsForm>
    </SectionCard>
  );
};

export default TalentProfileSkillsEditSection;
