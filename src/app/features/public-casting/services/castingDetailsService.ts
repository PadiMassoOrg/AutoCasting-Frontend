import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type { PublicCastingDetailsResponse, PublicCastingOverviewResponse } from '../types/publicCasting.types';

export const PUBLIC_CASTING_DETAILS_CACHE_KEY = ['cache-casting-details'] as const;
export const PUBLIC_CASTING_OVERVIEW_CACHE_KEY = ['cache-public-casting-overview'] as const;

export const getPublicCastingDetails = async (args: {
  slug: string;
  roleId: string;
  signal?: AbortSignal;
}): Promise<PublicCastingDetailsResponse> => {
  const { slug, roleId, signal } = args;

  const url = `${API_ROUTES.CASTING}/${slug}/roles/${roleId}`;
  const res = await api.get(url, { signal });
  return res.data;
};

export const getPublicCastingOverview = async (args: {
  slug: string;
  signal?: AbortSignal;
}): Promise<PublicCastingOverviewResponse> => {
  const { slug, signal } = args;

  const url = `${API_ROUTES.CASTING}/${slug}`;
  const res = await api.get(url, { signal });
  return res.data;
};
