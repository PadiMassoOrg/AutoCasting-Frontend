import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type { SliceResponse } from '../../../shared/types/sliceResponse.types';
import { appendBasePersonFilters } from '../../search/buildPersonSearchQuery';
import type { BasePersonSearchFiltersQS } from '../../search/personSearchFilters.types';
import type { ProfileCardResponse, TalentFiltersQS } from '../types/talent-database.types';
import { normalizeTalentDatabaseFilters } from '../utils/talentDatabaseFilterKey';

export const TALENT_DATABASE_CACHE_KEY = ['cache-talent-database', 'v1'] as const;

export const getTalentDatabase = async (
  page: number,
  size: number,
  filters?: TalentFiltersQS,
  opts?: { signal?: AbortSignal }
): Promise<SliceResponse<ProfileCardResponse>> => {
  const qs = buildTalentQuery(page, size, filters);

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

// ============ internals ============

function buildTalentQuery(page: number, size: number, filters?: TalentFiltersQS) {
  const qs = new URLSearchParams();
  qs.set('page', String(page));
  qs.set('size', String(size));
  if (!filters) return qs;
  const cleanedFilters = normalizeTalentDatabaseFilters(filters);

  const append = (k: string, v: unknown) => {
    if (v === undefined || v === null || v === '') return;
    if (Array.isArray(v)) {
      const cleaned = v.filter((x) => x !== undefined && x !== null && String(x) !== '');
      if (!cleaned.length) return;
      cleaned.forEach((x) => qs.append(k, String(x)));
      return;
    }
    qs.set(k, String(v));
  };

  append('includeNoHeadshot', cleanedFilters.includeNoHeadshot);
  append('stageName', cleanedFilters.stageName || undefined);

  appendBasePersonFilters(append, cleanedFilters as BasePersonSearchFiltersQS);

  return qs;
}
