import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { CreditsForm } from '../Form';

const TalentProfileCreditsEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  return profile.credits.length > 0 ? <CreditsForm data={profile.credits}></CreditsForm> : null;
};

export default TalentProfileCreditsEditSection;
