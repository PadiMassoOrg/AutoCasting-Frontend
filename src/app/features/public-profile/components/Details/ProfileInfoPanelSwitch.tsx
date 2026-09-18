import { LG_SCREEN_SIZE, useMedia } from 'autocasting-ui-library-padimasso';
import { useLayoutEffect, useRef, useState } from 'react';
import { CharacteristicsPanel, CreditsPanel, EducationPanel, SkillsPanel } from '.';
import type { TalentPublicProfileResponse } from '../../../talent/talent-profile-edit/types/talentProfile.types';

type PillKey = 'characteristics' | 'skills' | 'credits' | 'education';

const ProfileInfoPanelSwitch = ({
  activeKey,
  profile,
}: {
  activeKey: PillKey;
  profile: TalentPublicProfileResponse;
}) => {
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const characteristicsRef = useRef<HTMLDivElement>(null);
  const [characteristicsHeight, setCharacteristicsHeight] = useState<number>();

  useLayoutEffect(() => {
    if (isDesktop || activeKey !== 'characteristics') return;
    const el = characteristicsRef.current;
    if (!el) return;
    const update = () => setCharacteristicsHeight(el.scrollHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isDesktop, activeKey]);

  const otherPanelStyle =
    !isDesktop && characteristicsHeight ? { height: characteristicsHeight, overflowY: 'auto' as const } : undefined;

  return (
    <>
      <div
        ref={characteristicsRef}
        className="w-full h-full"
        role="tabpanel"
        id={`panel-characteristics`}
        aria-labelledby="tab-characteristics"
        hidden={activeKey !== 'characteristics'}
      >
        <CharacteristicsPanel data={profile.characteristics} />
      </div>

      <div
        className="w-full h-full"
        style={otherPanelStyle}
        role="tabpanel"
        id={`panel-skills`}
        aria-labelledby="tab-skills"
        hidden={activeKey !== 'skills'}
      >
        <SkillsPanel skills={profile.skills} />
      </div>

      <div
        className="w-full h-full"
        style={otherPanelStyle}
        role="tabpanel"
        id={`panel-credits`}
        aria-labelledby="tab-credits"
        hidden={activeKey !== 'credits'}
      >
        <CreditsPanel credits={profile.credits} />
      </div>

      <div
        className="w-full h-full"
        style={otherPanelStyle}
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
