import { CharacteristicsPanel, CreditsPanel, EducationPanel, SkillsPanel } from '.';
import type { PublicProfileResponse } from '../../../profile-edit/types/profile.types';

type PillKey = 'characteristics' | 'skills' | 'credits' | 'education';

const ProfileInfoPanelSwitch = ({ activeKey, profile }: { activeKey: PillKey; profile: PublicProfileResponse }) => {
  return (
    <>
      <div
        role="tabpanel"
        id={`panel-characteristics`}
        aria-labelledby="tab-characteristics"
        hidden={activeKey !== 'characteristics'}
      >
        <CharacteristicsPanel data={profile.characteristics} />
      </div>

      <div role="tabpanel" id={`panel-skills`} aria-labelledby="tab-skills" hidden={activeKey !== 'skills'}>
        <SkillsPanel skills={profile.skills} />
      </div>

      <div role="tabpanel" id={`panel-credits`} aria-labelledby="tab-credits" hidden={activeKey !== 'credits'}>
        <CreditsPanel credits={profile.credits} />
      </div>

      <div role="tabpanel" id={`panel-education`} aria-labelledby="tab-education" hidden={activeKey !== 'education'}>
        <EducationPanel education={profile.education} />
      </div>
    </>
  );
};

export default ProfileInfoPanelSwitch;
