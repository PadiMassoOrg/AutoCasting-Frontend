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
  const response = await api.get(`${API_ROUTES.CASTING_DATABASE}?${qs.toString()}`, {
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

  const append = (k: string, v: unknown) => {
    if (v === undefined || v === null || v === '') return;
    if (Array.isArray(v)) v.forEach((x) => qs.append(k, String(x)));
    else qs.set(k, String(v));
  };

  append('roleName', filters.roleName);
  append('locationText', filters.locationText);
  append('projectTypeId', filters.projectTypeIds);
  append('castingModalityId', filters.castingModalityIds);

  appendBasePersonFilters(append, filters as BasePersonSearchFiltersQS);

  return qs;
}
