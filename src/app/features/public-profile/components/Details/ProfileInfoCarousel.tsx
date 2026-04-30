import { InfoCarousel } from 'autocasting-ui-library-padimasso';
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

  const labels: Record<PillKey, string> = {
    characteristics: t('profile.pills.characteristics'),
    skills: t('profile.pills.skills'),
    credits: t('profile.pills.credits'),
    education: t('profile.pills.education'),
  };

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
    />
  );
}

const renderers = {
  characteristics: (p: TalentPublicProfileResponse) => (
    <ProfileInfoPanelSwitch activeKey="characteristics" profile={p} />
  ),
  skills: (p: TalentPublicProfileResponse) => <ProfileInfoPanelSwitch activeKey="skills" profile={p} />,
  credits: (p: TalentPublicProfileResponse) => <ProfileInfoPanelSwitch activeKey="credits" profile={p} />,
  education: (p: TalentPublicProfileResponse) => <ProfileInfoPanelSwitch activeKey="education" profile={p} />,
} as const;

const getCount = {
  skills: (p: TalentPublicProfileResponse) => p.skills?.length ?? 0,
  credits: (p: TalentPublicProfileResponse) => p.credits?.length ?? 0,
  education: (p: TalentPublicProfileResponse) => p.education?.length ?? 0,
} as const;
