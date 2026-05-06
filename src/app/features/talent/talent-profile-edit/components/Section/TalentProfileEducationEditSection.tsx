import type { TalentProfileResponse } from '../../types/talentProfile.types';
import { EducationForm } from '../Form';

const TalentProfileEducationEditSection = ({ profile }: { profile: TalentProfileResponse }) => {
  return profile.education.length > 0 ? <EducationForm data={profile.education}></EducationForm> : null;
};

export default TalentProfileEducationEditSection;
