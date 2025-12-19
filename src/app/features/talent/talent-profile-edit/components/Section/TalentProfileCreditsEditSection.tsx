import SectionCard from '../../../../../shared/components/Section/SectionCard';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { CreditsForm } from '../Form';

const TalentProfileCreditsEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  return (
    <SectionCard>
      <CreditsForm data={profile.credits}></CreditsForm>
    </SectionCard>
  );
};

export default TalentProfileCreditsEditSection;
