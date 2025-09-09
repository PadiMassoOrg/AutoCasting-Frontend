import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type { SliceResponse } from '../../../shared/types/sliceResponse.types';
import type { ProfileCardResponse, TalentFiltersQS } from '../types/talent-database.types';

export const TALENT_DATABASE_CACHE_KEY = ['cache-talent-database'] as const;

export const getTalentDatabase = async (
  page: number,
  size: number,
  filters?: TalentFiltersQS
): Promise<SliceResponse<ProfileCardResponse>> => {
  const qs = buildQuery(page, size, filters);
  const response = await api.get(`${API_ROUTES.TALENT_DATABASE}?${qs.toString()}`);
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

  append('stageName', filters.stageName);
  append('ageMin', filters.ageMin);
  append('ageMax', filters.ageMax);
  append('genderId', filters.genderId);
  append('professionId', filters.professionId);
  append('professionsMode', filters.professionsMode);
  append('heightMinCm', filters.heightMinCm);
  append('heightMaxCm', filters.heightMaxCm);
  append('hairColorId', filters.hairColorId);
  append('eyeColorId', filters.eyeColorId);
  append('tattoo', filters.tattoo);
  append('passport', filters.passport);
  append('drivingLicense', filters.drivingLicense);
  append('skillId', filters.skillId);
  append('skillsMode', filters.skillsMode);

  return qs;
}
