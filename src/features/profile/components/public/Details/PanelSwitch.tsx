import type { PublicProfileResponse } from '../../../types/profile.types';
import type { useTranslation } from 'react-i18next';
import { CharacteristicsPanel, CreditsPanel, EducationPanel, SkillsPanel } from './';

type PillKey = 'characteristics' | 'skills' | 'credits' | 'education';

const PanelSwitch = ({
  activeKey,
  profile,
}: {
  activeKey: PillKey;
  profile: PublicProfileResponse;
  t: ReturnType<typeof useTranslation>['t'];
}) => {
  return (
    <>
      <div
        role="tabpanel"
        id={`panel-characteristics`}
        aria-labelledby="tab-characteristics"
        hidden={activeKey !== 'characteristics'}
        className="rounded-xl border border-[var(--color-secondary-outline)] py-6 px-7"
      >
        <CharacteristicsPanel data={profile.characteristics} />
      </div>

      <div
        role="tabpanel"
        id={`panel-skills`}
        aria-labelledby="tab-skills"
        hidden={activeKey !== 'skills'}
        className="rounded-xl border border-[var(--color-secondary-outline)] py-6 px-7"
      >
        <SkillsPanel skills={profile.skills} />
      </div>

      <div
        role="tabpanel"
        id={`panel-credits`}
        aria-labelledby="tab-credits"
        hidden={activeKey !== 'credits'}
        className="rounded-xl border border-[var(--color-secondary-outline)] p-6"
      >
        <CreditsPanel credits={profile.credits} />
      </div>

      <div
        role="tabpanel"
        id={`panel-education`}
        aria-labelledby="tab-education"
        hidden={activeKey !== 'education'}
        className="rounded-xl border border-[var(--color-secondary-outline)] py-6 px-7"
      >
        <EducationPanel education={profile.education} />
      </div>
    </>
  );
};

export default PanelSwitch;
