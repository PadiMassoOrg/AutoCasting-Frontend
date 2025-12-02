import { DashboardSection } from '../../../../../layouts/components';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { CharacteristicsForm } from '../Form';

const TalentProfileDetailsEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  return (
    <DashboardSection>
      <CharacteristicsForm data={profile.characteristics}></CharacteristicsForm>
    </DashboardSection>
  );
};

export default TalentProfileDetailsEditSection;
