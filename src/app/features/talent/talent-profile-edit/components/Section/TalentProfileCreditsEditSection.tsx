import { DashboardSection } from '../../../../../layouts/components';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { CreditsForm } from '../Form';

const TalentProfileCreditsEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  return (
    <DashboardSection>
      <CreditsForm data={profile.credits}></CreditsForm>
    </DashboardSection>
  );
};

export default TalentProfileCreditsEditSection;
