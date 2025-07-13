import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type { ProfileResponse, PublicProfileResponse } from '../types/profile.types';

export const getMyProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get(API_ROUTES.PROFILE);
  return response.data;
};

export const getPublicProfile = async (slug: string): Promise<PublicProfileResponse> => {
  const response = await api.get(API_ROUTES.PROFILE + `/${slug}`);
  return response.data;
};
