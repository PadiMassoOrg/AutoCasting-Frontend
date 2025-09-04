import { useTranslation } from 'react-i18next';
import { InfoCarousel } from '../../../../../shared/components/InfoCarousel';
import type { ProfileResponse } from '../../../types/profile.types';
import { CharacteristicsForm, CreditsForm, EducationForm, SkillsForm } from '../../Form';

type PillKey = 'characteristics' | 'skills' | 'credits' | 'education';
const ORDER: readonly PillKey[] = ['characteristics', 'skills', 'credits', 'education'];

export default function DetailsInfoCarousel({ profile }: { profile: ProfileResponse }) {
  const { t } = useTranslation();

  return (
    <InfoCarousel<PillKey, ProfileResponse>
      data={profile}
      order={ORDER}
      renderers={renderers}
      getCount={getCount}
      t={t}
      defaultActive="characteristics"
      panelWrapperClassName="rounded-xl border border-[var(--color-secondary-outline)] py-6 px-7"
      translationPrefix="profile.pills"
    />
  );
}

const renderers = {
  characteristics: (profile: ProfileResponse) => <CharacteristicsForm data={profile.characteristics} />,
  skills: (profile: ProfileResponse) => <SkillsForm data={profile.skills} />,
  credits: (profile: ProfileResponse) => <CreditsForm data={profile.credits} />,
  education: (profile: ProfileResponse) => <EducationForm data={profile.education} />,
} as const;

const getCount = {
  skills: (p: ProfileResponse) => p.skills?.length ?? 0,
  credits: (p: ProfileResponse) => p.credits?.length ?? 0,
  education: (p: ProfileResponse) => p.education?.length ?? 0,
} as const;
