import { useMemo, useRef, useState } from 'react';
import type { PublicProfileResponse } from '../../../types/profile.types';
import { useTranslation } from 'react-i18next';
import PanelSwitch from './PanelSwitch';

type PillKey = 'characteristics' | 'skills' | 'credits' | 'education';

type Props = {
  profile: PublicProfileResponse; // <- te paso la entidad completa
  className?: string;
};

const PILL_ORDER: PillKey[] = ['characteristics', 'skills', 'credits', 'education'];

export default function ProfileInfoCarousel({ profile, className }: Props) {
  const { t } = useTranslation();
  const [active, setActive] = useState<PillKey>('characteristics');
  const listRef = useRef<HTMLDivElement>(null);

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
      <div className="relative">
        <div className="flex items-center gap-2">
          <div
            ref={listRef}
            role="tablist"
            aria-label="Profile sections"
            className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar snap-x"
          >
            {pills.map(({ key, label }) => {
              const selected = active === key;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`panel-${key}`}
                  id={`tab-${key}`}
                  onClick={() => setActive(key)}
                  className={[
                    'bg-[var(--color-primary-light-grey)] text-base font-semibold cursor-pointer px-4 py-2 snap-start whitespace-nowrap rounded-full',
                    selected && 'bg-black text-white',
                  ].join(' ')}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Panel */}
      <div className="mt-5">
        <PanelSwitch activeKey={active} profile={profile} t={t} />
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
