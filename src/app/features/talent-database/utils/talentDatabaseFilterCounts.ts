import type { SiteMetadataObject } from '../../sitemetadata/types/sitemetadata.types';
import type { TalentFiltersQS } from '../types/talent-database.types';

type TalentFilterCounts = {
  basicCount: number;
  characteristicsCount: number;
  skillsCount: number;
  totalCount: number;
};

const hasText = (value?: string | null) => Boolean(value?.trim());
const hasAny = (value?: unknown[]) => (value?.length ?? 0) > 0;
const hasRange = (min?: number, max?: number) => min != null || max != null;

function getSkillsCount(selectedIds: string[] | undefined, skillsRaw: SiteMetadataObject[] | undefined) {
  const selected = selectedIds ?? [];
  if (selected.length === 0 || !skillsRaw?.length) return 0;

  const selectedSet = new Set(selected);
  const groups = new Map<string, Set<string>>();

  skillsRaw.forEach((skill) => {
    const category = skill.categoryStringCode ?? 'sitemetadata.category.other';
    if (!groups.has(category)) groups.set(category, new Set<string>());
    groups.get(category)?.add(skill.id);
  });

  return Array.from(groups.values()).reduce((acc, ids) => {
    for (const id of selectedSet) {
      if (ids.has(id)) return acc + 1;
    }
    return acc;
  }, 0);
}

export function getTalentFilterCounts(
  value: TalentFiltersQS,
  skillsRaw?: SiteMetadataObject[] | undefined
): TalentFilterCounts {
  const genderActive = (value.genderIds ?? []).some((id) => id !== 'NULL');
  const ethnicityActive = (value.ethnicityIds ?? []).some((id) => id !== 'NULL');

  const basicCount =
    (hasText(value.stageName) ? 1 : 0) +
    (hasRange(value.ageMin, value.ageMax) ? 1 : 0) +
    (genderActive ? 1 : 0) +
    (hasAny(value.professionId) ? 1 : 0);

  const characteristicsCount =
    (hasRange(value.heightMinCm, value.heightMaxCm) ? 1 : 0) +
    (hasAny(value.hairColorIds) ? 1 : 0) +
    (hasAny(value.eyeColorIds) ? 1 : 0) +
    (ethnicityActive ? 1 : 0) +
    (value.tattoo !== undefined ? 1 : 0) +
    (value.passport !== undefined ? 1 : 0) +
    (value.drivingLicense !== undefined ? 1 : 0);

  const skillsCount = getSkillsCount(value.skillId, skillsRaw);

  return {
    basicCount,
    characteristicsCount,
    skillsCount,
    totalCount: basicCount + characteristicsCount + skillsCount,
  };
}
