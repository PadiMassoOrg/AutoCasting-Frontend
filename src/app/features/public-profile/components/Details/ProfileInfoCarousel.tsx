import { useTranslation } from 'react-i18next';
import { InfoCarousel } from '../../../../shared/components/InfoCarousel';
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

  return (
    <InfoCarousel<PillKey, TalentPublicProfileResponse>
      data={profile}
      order={ORDER}
      renderers={renderers}
      getCount={getCount}
      t={t}
      className={className}
      defaultActive="characteristics"
      translationPrefix="profile.pills"
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
