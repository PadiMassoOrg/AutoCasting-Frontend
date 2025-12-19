import SectionCard from '../../../../../shared/components/Section/SectionCard';
import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { CharacteristicsForm } from '../Form';

const TalentProfileDetailsEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  return (
    <SectionCard>
      <CharacteristicsForm data={profile.characteristics}></CharacteristicsForm>
    </SectionCard>
  );
};

export default TalentProfileDetailsEditSection;
