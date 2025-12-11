import type { BasePersonSearchFiltersQS } from './personSearchFilters.types';

export type AppendFn = (k: string, v: unknown) => void;

export const appendBasePersonFilters = (append: AppendFn, filters?: BasePersonSearchFiltersQS) => {
  if (!filters) return;

  append('ageMin', filters.ageMin);
  append('ageMax', filters.ageMax);

  if (Array.isArray(filters.genderIds) && filters.genderIds.length > 0) {
    filters.genderIds.forEach((token) => append('genderId', token));
  }

  if (Array.isArray(filters.ethnicityIds) && filters.ethnicityIds.length > 0) {
    filters.ethnicityIds.forEach((token) => append('ethnicityId', token));
  }

  append('professionId', filters.professionId);
  append('professionsMode', filters.professionsMode);

  append('heightMinCm', filters.heightMinCm);
  append('heightMaxCm', filters.heightMaxCm);

  append('hairColorId', filters.hairColorIds);
  append('hairColorIdsMode', filters.hairColorIdsMode);

  append('eyeColorId', filters.eyeColorIds);
  append('eyeColorIdsMode', filters.eyeColorIdsMode);

  append('tattoo', filters.tattoo);
  append('passport', filters.passport);
  append('drivingLicense', filters.drivingLicense);

  append('skillId', filters.skillId);
  append('skillsMode', filters.skillsMode);
};
