import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PublicProfileResponse } from '../../../profile/types/profile.types';
import Pills from '../Pills/Pills';
import ProfileInfoPanelSwitch from './ProfileInfoPanelSwitch';

type PillKey = 'characteristics' | 'skills' | 'credits' | 'education';

type Props = {
  profile: PublicProfileResponse;
  className?: string;
};

const PILL_ORDER: PillKey[] = ['characteristics', 'skills', 'credits', 'education'];

export default function ProfileInfoCarousel({ profile, className }: Props) {
  const { t } = useTranslation();
  const [active, setActive] = useState<PillKey>('characteristics');

  const counts = useMemo(
    () => ({
      characteristics: undefined as number | undefined,
      skills: profile.skills.length ?? 0,
      credits: profile.credits.length ?? 0,
      education: profile.education.length ?? 0,
    }),
    [profile]
  );

  const pills = useMemo(
    () =>
      PILL_ORDER.map((key) => ({
        key,
        label: getPillLabel(key, t),
        count: counts[key as keyof typeof counts],
      })),
    [counts, t]
  );

  return (
    <section className={`w-full ${className ?? ''}`}>
      <Pills items={pills} value={active} onChange={setActive}></Pills>
      <div className="mt-5">
        <ProfileInfoPanelSwitch activeKey={active} profile={profile} />
      </div>
    </section>
  );
}

// TODO - Move Helpers
function getPillLabel(key: PillKey, t: ReturnType<typeof useTranslation>['t']) {
  switch (key) {
    case 'characteristics':
      return t('profile.pills.characteristics');
    case 'skills':
      return t('profile.pills.skills');
    case 'credits':
      return t('profile.pills.credits');
    case 'education':
      return t('profile.pills.education');
  }
}
