// src/features/profile/components/edit/DetailsInfoCarousel.tsx
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Pills from '../../../../public-profile/components/Pills/Pills';
import type { ProfileResponse } from '../../../types/profile.types';
import { CharacteristicsForm, CreditsForm, EducationForm, SkillsForm } from '../../form';

type PillKey = 'characteristics' | 'skills' | 'credits' | 'education';
const ORDER: PillKey[] = ['characteristics', 'skills', 'credits', 'education'];

export default function DetailsInfoCarousel({ profile }: { profile: ProfileResponse }) {
  const { t } = useTranslation();
  const [active, setActive] = useState<PillKey>('characteristics');

  const counts = useMemo(
    () => ({
      characteristics: undefined as number | undefined,
      skills: profile.skills?.length ?? 0,
      credits: profile.credits?.length ?? 0,
      education: profile.education?.length ?? 0,
    }),
    [profile]
  );

  const pills = useMemo(
    () =>
      ORDER.map((key) => ({
        key,
        label: getLabel(key, t),
        count: counts[key as keyof typeof counts],
      })),
    [counts, t]
  );

  return (
    <section className="w-full min-w-0">
      <Pills items={pills} value={active} onChange={setActive} />
      <div className="mt-5 w-full min-w-0">
        {active === 'characteristics' && (
          <div className="rounded-xl border border-[var(--color-secondary-outline)] py-6 px-7">
            <CharacteristicsForm data={profile.characteristics} />
          </div>
        )}
        {active === 'skills' && (
          <div className="rounded-xl border border-[var(--color-secondary-outline)] py-6 px-7">
            <SkillsForm data={profile.skills} />
          </div>
        )}
        {active === 'credits' && (
          <div className="rounded-xl border border-[var(--color-secondary-outline)] p-6">
            <CreditsForm data={profile.credits} />
          </div>
        )}
        {active === 'education' && (
          <div className="rounded-xl border border-[var(--color-secondary-outline)] py-6 px-7">
            <EducationForm data={profile.education} />
          </div>
        )}
      </div>
    </section>
  );
}

function getLabel(key: PillKey, t: ReturnType<typeof useTranslation>['t']) {
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
