import { useTranslation } from 'react-i18next';
import { InfoCarousel } from '../../../../../../shared/components/InfoCarousel';
import type { TalentProfileResponse } from '../../../types/talentProfile.types';
import { CharacteristicsForm, CreditsForm, EducationForm, SkillsForm } from '../../Form';

type PillKey = 'characteristics' | 'skills' | 'credits' | 'education';
const ORDER: readonly PillKey[] = ['characteristics', 'skills', 'credits', 'education'];

export default function DetailsInfoCarousel({ profile }: { profile: TalentProfileResponse }) {
  const { t } = useTranslation();

  return (
    <InfoCarousel<PillKey, TalentProfileResponse>
      data={profile}
      order={ORDER}
      renderers={renderers}
      getCount={getCount}
      t={t}
      defaultActive="characteristics"
      translationPrefix="profile.pills"
    />
  );
}

const renderers = {
  characteristics: (profile: TalentProfileResponse) => <CharacteristicsForm data={profile.characteristics} />,
  skills: (profile: TalentProfileResponse) => <SkillsForm data={profile.skills} />,
  credits: (profile: TalentProfileResponse) => <CreditsForm data={profile.credits} />,
  education: (profile: TalentProfileResponse) => <EducationForm data={profile.education} />,
} as const;

const getCount = {
  skills: (p: TalentProfileResponse) => p.skills?.length ?? 0,
  credits: (p: TalentProfileResponse) => p.credits?.length ?? 0,
  education: (p: TalentProfileResponse) => p.education?.length ?? 0,
} as const;
