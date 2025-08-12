import React, { useMemo, useRef, useState } from 'react';
import type {
  Characteristics,
  SiteMetadataObject,
  Credit,
  Education,
  PublicProfileResponse,
} from '../../types/profile.types';
import { useTranslation } from 'react-i18next';
import CharacteristicsPanel from './CharacteristicsPanel';
import SkillsPanel from './SkillsPanel';

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
        <div className="absolute left-0 top-0 h-10 w-10 pointer-events-none rounded-l-xl" />
        <div className="absolute right-0 top-0 h-10 w-10 pointer-events-none rounded-r-xl" />

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
        <Panel activeKey={active} profile={profile} t={t} />
      </div>
    </section>
  );
}

/* ------------------------------- Panel switch ------------------------------ */

function Panel({
  activeKey,
  profile,
  t,
}: {
  activeKey: PillKey;
  profile: PublicProfileResponse;
  t: ReturnType<typeof useTranslation>['t'];
}) {
  return (
    <>
      <div
        role="tabpanel"
        id={`panel-characteristics`}
        aria-labelledby="tab-characteristics"
        hidden={activeKey !== 'characteristics'}
        className="rounded-xl border border-[var(--color-secondary-outline)] py-6 px-7"
      >
        <CharacteristicsPanel data={profile.characteristics} />
      </div>

      <div
        role="tabpanel"
        id={`panel-skills`}
        aria-labelledby="tab-skills"
        hidden={activeKey !== 'skills'}
        className="rounded-xl border p-4"
      >
        <SkillsPanel skills={profile.skills} />
      </div>

      <div
        role="tabpanel"
        id={`panel-credits`}
        aria-labelledby="tab-credits"
        hidden={activeKey !== 'credits'}
        className="rounded-xl border p-4"
      >
        <CreditsView items={profile.credits} t={t} />
      </div>

      <div
        role="tabpanel"
        id={`panel-education`}
        aria-labelledby="tab-education"
        hidden={activeKey !== 'education'}
        className="rounded-xl border p-4"
      >
        <EducationView items={profile.education} />
      </div>
    </>
  );
}

/* --------------------------------- Credits --------------------------------- */

function CreditsView({ items, t }: { items: Credit[]; t: ReturnType<typeof useTranslation>['t'] }) {
  return <ul className="flex flex-col gap-3"></ul>;
}

/* ------------------------------- Education --------------------------------- */

function EducationView({ items }: { items: Education[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((e) => (
        <li key={e.id} className="rounded-lg border p-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="font-medium text-gray-900">{e.institution}</span>
            <span>•</span>
            <span>{e.courseName}</span>
            <span>•</span>
            <span>{e.graduationYear}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* --------------------------------- Helpers --------------------------------- */

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
