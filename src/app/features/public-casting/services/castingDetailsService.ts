import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type { CastingDetailsResponse } from '../types/publicCasting.types';

export const CASTING_DETAILS_CACHE_KEY = ['cache-casting-details'] as const;

export const getCastingDetails = async (args: {
  mode: 'public' | 'employer';
  slug: string;
  roleId?: string;
  signal?: AbortSignal;
}): Promise<CastingDetailsResponse> => {
  const { mode, slug, roleId, signal } = args;

  const url =
    mode === 'employer'
      ? `${API_ROUTES.EMPLOYER_CASTING}/${slug}/details`
      : `${API_ROUTES.CASTING}/${slug}/roles/${roleId}`;

  const res = await api.get(url, { signal });
  return res.data;
};
