import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type { CastingDetailsResponse } from '../types/publicCasting.types';

export const CASTING_DETAILS_CACHE_KEY = ['cache-casting-details'] as const;

export const getCastingDetailsBySlug = async (
  slug: string,
  opts?: { signal?: AbortSignal }
): Promise<CastingDetailsResponse> => {
  const response = await api.get(API_ROUTES.EMPLOYER_CASTING + `/${slug}` + '/details', { signal: opts?.signal });
  return response.data;
};
