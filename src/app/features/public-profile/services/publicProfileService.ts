import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type { TalentPublicProfileResponse } from '../../talent/talent-profile-edit/types/talentProfile.types';

export const PUBLIC_PROFILE_CACHE_KEY = ['cache-profile'] as const;

export const getPublicProfile = async (slug: string): Promise<TalentPublicProfileResponse> => {
  const response = await api.get(API_ROUTES.TALENT_PROFILE + `/${slug}`);
  return response.data;
};
