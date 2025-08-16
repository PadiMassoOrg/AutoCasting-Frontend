import { useMemo, useRef, useState } from 'react';
import type { PublicProfileResponse } from '../../../types/profile.types';
import { useTranslation } from 'react-i18next';
import ProfileInfoPanelSwitch from './ProfileInfoPanelSwitch';
import Pills from '../../../../../shared/components/A EXTRAER EN UI LIB/Pills/Pills';

type PillKey = 'characteristics' | 'skills' | 'credits' | 'education';

type Props = {
  profile: PublicProfileResponse; // <- te paso la entidad completa
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
      {/* Pills */}
      <Pills items={pills} value={active} onChange={setActive}></Pills>

      {/* Panel */}
      <div className="mt-5">
        <ProfileInfoPanelSwitch activeKey={active} profile={profile} t={t} />
      </div>
    </section>
  );
}

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
