import { useTranslation } from 'react-i18next';
import { InfoCarousel } from '../../../../shared/components/InfoCarousel';
import type { PublicProfileResponse } from '../../../profile-edit/types/profile.types';
import ProfileInfoPanelSwitch from './ProfileInfoPanelSwitch';

type PillKey = 'characteristics' | 'skills' | 'credits' | 'education';
const ORDER: readonly PillKey[] = ['characteristics', 'skills', 'credits', 'education'];

export default function ProfileInfoCarousel({
  profile,
  className,
}: {
  profile: PublicProfileResponse;
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <InfoCarousel<PillKey, PublicProfileResponse>
      data={profile}
      order={ORDER}
      renderers={renderers}
      getCount={getCount}
      t={t}
      className={className}
      defaultActive="characteristics"
      panelWrapperClassName="mt-5"
      translationPrefix="profile.pills"
    />
  );
}

const renderers = {
  characteristics: (p: PublicProfileResponse) => <ProfileInfoPanelSwitch activeKey="characteristics" profile={p} />,
  skills: (p: PublicProfileResponse) => <ProfileInfoPanelSwitch activeKey="skills" profile={p} />,
  credits: (p: PublicProfileResponse) => <ProfileInfoPanelSwitch activeKey="credits" profile={p} />,
  education: (p: PublicProfileResponse) => <ProfileInfoPanelSwitch activeKey="education" profile={p} />,
} as const;

const getCount = {
  skills: (p: PublicProfileResponse) => p.skills?.length ?? 0,
  credits: (p: PublicProfileResponse) => p.credits?.length ?? 0,
  education: (p: PublicProfileResponse) => p.education?.length ?? 0,
} as const;
