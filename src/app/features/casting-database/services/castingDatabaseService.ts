import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type { SliceResponse } from '../../../shared/types/sliceResponse.types';
import { appendBasePersonFilters } from '../../search/buildPersonSearchQuery';
import type { BasePersonSearchFiltersQS } from '../../search/personSearchFilters.types';
import type { CastingFiltersQS, CastingRolePublicCardResponse } from '../types/casting-database.types';

export const CASTING_DATABASE_CACHE_KEY = 'cache-casting-database' as const;

export const getCastingDatabase = async (
  page: number,
  size: number,
  filters?: CastingFiltersQS,
  opts?: { signal?: AbortSignal }
): Promise<SliceResponse<CastingRolePublicCardResponse>> => {
  const qs = buildCastingQuery(page, size, filters);
  qs.set('_', String(Date.now()));
  const response = await api.get(`${API_ROUTES.CASTINGS_DATABASE}?${qs.toString()}`, {
    signal: opts?.signal,
    headers: { 'Cache-Control': 'no-store' },
    validateStatus: (s) => (s >= 200 && s < 300) || s === 204,
  });

  if (response.status === 204 || !response.data) {
    return { items: [], hasNext: false, page, size };
  }
  return response.data;
};

function buildCastingQuery(page: number, size: number, filters?: CastingFiltersQS) {
  const qs = new URLSearchParams();
  qs.set('page', String(page));
  qs.set('size', String(size));
  if (!filters) return qs;

  const isNullToken = (x: unknown) => {
    const s = String(x);
    return s === 'NULL' || s === 'null' || s === 'undefined';
  };

  const normalizeArray = (v: unknown) => {
    if (!Array.isArray(v)) return v;
    const cleaned = v.filter((x) => x !== undefined && x !== null && String(x) !== '' && !isNullToken(x));
    return cleaned.length ? cleaned : undefined;
  };

  const cleanedFilters = {
    ...filters,
    genderIds: normalizeArray(filters.genderIds),
    ethnicityIds: normalizeArray(filters.ethnicityIds),
    hairColorIds: normalizeArray(filters.hairColorIds),
    eyeColorIds: normalizeArray(filters.eyeColorIds),
    professionId: normalizeArray(filters.professionId),
    skillId: normalizeArray(filters.skillId),
    projectTypeIds: normalizeArray(filters.projectTypeIds),
    castingModalityIds: normalizeArray(filters.castingModalityIds),
  };

  const append = (k: string, v: unknown) => {
    if (v === undefined || v === null || v === '') return;
    if (Array.isArray(v)) {
      const arr = v.filter((x) => x !== undefined && x !== null && String(x) !== '' && !isNullToken(x));
      if (!arr.length) return;
      arr.forEach((x) => qs.append(k, String(x)));
      return;
    }
    if (isNullToken(v)) return;
    qs.set(k, String(v));
  };

  append('roleName', cleanedFilters.roleName);
  append('locationText', cleanedFilters.locationText);
  append('projectTypeId', cleanedFilters.projectTypeIds);
  append('castingModalityId', cleanedFilters.castingModalityIds);

  appendBasePersonFilters(append, cleanedFilters as BasePersonSearchFiltersQS);

  return qs;
}
