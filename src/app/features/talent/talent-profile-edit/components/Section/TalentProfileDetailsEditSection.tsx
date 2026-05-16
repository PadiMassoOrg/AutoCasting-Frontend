import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { CharacteristicsForm } from '../Form';

const TalentProfileDetailsEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  return <CharacteristicsForm data={profile.characteristics}></CharacteristicsForm>;
};

export default TalentProfileDetailsEditSection;
