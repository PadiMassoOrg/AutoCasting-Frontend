import { LG_SCREEN_SIZE, useMedia } from 'autocasting-ui-library-padimasso';
import { useLayoutEffect, useRef } from 'react';
import { CharacteristicsPanel, CreditsPanel, EducationPanel, SkillsPanel } from '.';
import type { TalentPublicProfileResponse } from '../../../talent/talent-profile-edit/types/talentProfile.types';

type PillKey = 'characteristics' | 'skills' | 'credits' | 'education';

const ProfileInfoPanelSwitch = ({
  activeKey,
  profile,
  onCharacteristicsHeightChange,
}: {
  activeKey: PillKey;
  profile: TalentPublicProfileResponse;
  onCharacteristicsHeightChange?: (height: number) => void;
}) => {
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const characteristicsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (isDesktop || activeKey !== 'characteristics' || !onCharacteristicsHeightChange) return;
    const el = characteristicsRef.current;
    if (!el) return;
    const update = () => onCharacteristicsHeightChange(el.scrollHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isDesktop, activeKey, onCharacteristicsHeightChange]);

  return (
    <>
      <div
        ref={characteristicsRef}
        className="w-full"
        role="tabpanel"
        id={`panel-characteristics`}
        aria-labelledby="tab-characteristics"
        hidden={activeKey !== 'characteristics'}
      >
        <CharacteristicsPanel data={profile.characteristics} />
      </div>

      <div
        className="w-full h-full"
        role="tabpanel"
        id={`panel-skills`}
        aria-labelledby="tab-skills"
        hidden={activeKey !== 'skills'}
      >
        <SkillsPanel skills={profile.skills} />
      </div>

      <div
        className="w-full h-full"
        role="tabpanel"
        id={`panel-credits`}
        aria-labelledby="tab-credits"
        hidden={activeKey !== 'credits'}
      >
        <CreditsPanel credits={profile.credits} />
      </div>

      <div
        className="w-full h-full"
        role="tabpanel"
        id={`panel-education`}
        aria-labelledby="tab-education"
        hidden={activeKey !== 'education'}
      >
        <EducationPanel education={profile.education} />
      </div>
    </>
  );
};

export default ProfileInfoPanelSwitch;
