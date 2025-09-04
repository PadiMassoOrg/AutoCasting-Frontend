import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type { PublicProfileResponse } from '../../profile/types/profile.types';

export const PUBLIC_PROFILE_CACHE_KEY = ['cache-profile'] as const;

export const getPublicProfile = async (slug: string): Promise<PublicProfileResponse> => {
  const response = await api.get(API_ROUTES.PROFILE + `/${slug}`);
  return response.data;
};
