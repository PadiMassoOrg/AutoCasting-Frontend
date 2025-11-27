import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type { SliceResponse } from '../../../shared/types/sliceResponse.types';
import type { ProfileCardResponse, TalentFiltersQS } from '../types/talent-database.types';

export const TALENT_DATABASE_CACHE_KEY = 'cache-talent-database' as const;

export const getTalentDatabase = async (
  page: number,
  size: number,
  filters?: TalentFiltersQS,
  opts?: { signal?: AbortSignal }
): Promise<SliceResponse<ProfileCardResponse>> => {
  const qs = buildQuery(page, size, filters);
  qs.set('_', String(Date.now()));
  const response = await api.get(`${API_ROUTES.TALENT_DATABASE}?${qs.toString()}`, {
    signal: opts?.signal,
    headers: { 'Cache-Control': 'no-store' },
    validateStatus: (s) => (s >= 200 && s < 300) || s === 204,
  });

  if (response.status === 204 || !response.data) {
    return { items: [], hasNext: false, page, size };
  }
  return response.data;
};

function buildQuery(page: number, size: number, filters?: TalentFiltersQS) {
  const qs = new URLSearchParams();
  qs.set('page', String(page));
  qs.set('size', String(size));
  if (!filters) return qs;

  const append = (k: string, v: unknown) => {
    if (v === undefined || v === null || v === '') return;
    if (Array.isArray(v)) v.forEach((x) => qs.append(k, String(x)));
    else qs.set(k, String(v));
  };

  append('includeNoHeadshot', filters.includeNoHeadshot);
  append('stageName', filters.stageName);
  append('ageMin', filters.ageMin);
  append('ageMax', filters.ageMax);

  if (Array.isArray(filters.genderIds) && filters.genderIds.length > 0) {
    filters.genderIds.forEach((token) => qs.append('genderId', token));
  } else {
    append('genderId', (filters as any).genderId);
  }

  if (Array.isArray(filters.ethnicityIds) && filters.ethnicityIds.length > 0) {
    filters.ethnicityIds.forEach((token) => qs.append('ethnicityId', token));
  } else {
    append('ethnicityId', (filters as any).ethnicityId);
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

  return qs;
}
