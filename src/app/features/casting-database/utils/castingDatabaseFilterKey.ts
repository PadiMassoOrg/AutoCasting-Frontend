import { stableStringify } from '../../../shared/utils/stableStringify';
import type { CastingFiltersQS } from '../types/casting-database.types';

const isNullToken = (x: unknown) => {
  const s = String(x);
  return s === 'NULL' || s === 'null' || s === 'undefined';
};

const cleanArray = (v: unknown) => {
  if (!Array.isArray(v)) return v;
  const cleaned = v.filter((x) => x !== undefined && x !== null && String(x) !== '' && !isNullToken(x));
  return cleaned.length ? cleaned : undefined;
};

export function normalizeCastingDatabaseFilters(filters: CastingFiltersQS): CastingFiltersQS {
  return {
    ...filters,
    roleName: (filters.roleName ?? '').trim(),
    locationText: filters.locationText?.trim() || undefined,

    genderIds: cleanArray(filters.genderIds) as any,
    ethnicityIds: cleanArray(filters.ethnicityIds) as any,
    hairColorIds: cleanArray(filters.hairColorIds) as any,
    eyeColorIds: cleanArray(filters.eyeColorIds) as any,
    professionId: cleanArray(filters.professionId) as any,
    skillId: cleanArray(filters.skillId) as any,
    projectTypeIds: cleanArray(filters.projectTypeIds) as any,
    castingModalityIds: cleanArray(filters.castingModalityIds) as any,
  };
}

export function castingDatabaseFiltersKey(filters: CastingFiltersQS): string {
  return stableStringify(normalizeCastingDatabaseFilters(filters));
}
