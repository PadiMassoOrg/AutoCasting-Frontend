import type { TalentFiltersQS } from '../types/talent-database.types';
import { stableStringify } from '../../../shared/utils/stableStringify';

const isNullToken = (x: unknown) => {
  const s = String(x);
  return s === 'NULL' || s === 'null' || s === 'undefined';
};

const cleanArray = (v: unknown) => {
  if (!Array.isArray(v)) return v;
  const cleaned = v.filter((x) => x !== undefined && x !== null && String(x) !== '' && !isNullToken(x));
  return cleaned.length ? cleaned : undefined;
};

export function normalizeTalentDatabaseFilters(filters: TalentFiltersQS): TalentFiltersQS {
  return {
    ...filters,
    stageName: (filters.stageName ?? '').trim(),

    genderIds: cleanArray(filters.genderIds) as any,
    ethnicityIds: cleanArray(filters.ethnicityIds) as any,
    hairColorIds: cleanArray(filters.hairColorIds) as any,
    eyeColorIds: cleanArray(filters.eyeColorIds) as any,
    professionId: cleanArray(filters.professionId) as any,
    skillId: cleanArray(filters.skillId) as any,
  };
}

export function talentDatabaseFiltersKey(filters: TalentFiltersQS): string {
  return stableStringify(normalizeTalentDatabaseFilters(filters));
}
