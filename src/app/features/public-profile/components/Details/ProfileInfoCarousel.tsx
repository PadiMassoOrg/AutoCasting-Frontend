import { InfoCarousel, LG_SCREEN_SIZE, useMedia } from 'autocasting-ui-library-padimasso';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TalentPublicProfileResponse } from '../../../talent/talent-profile-edit/types/talentProfile.types';
import ProfileInfoPanelSwitch from './ProfileInfoPanelSwitch';

type PillKey = 'characteristics' | 'skills' | 'credits' | 'education';
const ORDER: readonly PillKey[] = ['characteristics', 'skills', 'credits', 'education'];

export default function ProfileInfoCarousel({
  profile,
  infoPanelFixedHeight,
  className,
}: {
  profile: TalentPublicProfileResponse;
  infoPanelFixedHeight?: boolean;
  className?: string;
}) {
  const { t } = useTranslation();
  const isDesktop = useMedia(LG_SCREEN_SIZE);
  const [characteristicsHeight, setCharacteristicsHeight] = useState<number>();

  const labels: Record<PillKey, string> = {
    characteristics: t('profile.pills.characteristics'),
    skills: t('profile.pills.skills'),
    credits: t('profile.pills.credits'),
    education: t('profile.pills.education'),
  };

  const renderers = useMemo(
    () => ({
      characteristics: (p: TalentPublicProfileResponse) => (
        <ProfileInfoPanelSwitch
          activeKey="characteristics"
          profile={p}
          onCharacteristicsHeightChange={setCharacteristicsHeight}
        />
      ),
      skills: (p: TalentPublicProfileResponse) => <ProfileInfoPanelSwitch activeKey="skills" profile={p} />,
      credits: (p: TalentPublicProfileResponse) => <ProfileInfoPanelSwitch activeKey="credits" profile={p} />,
      education: (p: TalentPublicProfileResponse) => <ProfileInfoPanelSwitch activeKey="education" profile={p} />,
    }),
    []
  );

  return (
    <InfoCarousel<PillKey, TalentPublicProfileResponse>
      data={profile}
      order={ORDER}
      labels={labels}
      renderers={renderers}
      getCount={getCount}
      className={className}
      defaultActive="characteristics"
      fixedHeight={infoPanelFixedHeight}
      panelHeightPx={!isDesktop ? characteristicsHeight : undefined}
    />
  );
}

const getCount = {
  skills: (p: TalentPublicProfileResponse) => p.skills?.length ?? 0,
  credits: (p: TalentPublicProfileResponse) => p.credits?.length ?? 0,
  education: (p: TalentPublicProfileResponse) => p.education?.length ?? 0,
} as const;
