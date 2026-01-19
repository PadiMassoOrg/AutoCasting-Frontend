import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type { PublicCastingResponse } from '../types/publicCasting.types';

export const PUBLIC_CASTING_CACHE_KEY = ['cache-casting-public-details'] as const;

export const getPublicCastingDetails = async (
  slug: string,
  opts?: { signal?: AbortSignal }
): Promise<PublicCastingResponse> => {
  const response = await api.get(API_ROUTES.CASTING + `/${slug}`, { signal: opts?.signal });
  return response.data;
};
