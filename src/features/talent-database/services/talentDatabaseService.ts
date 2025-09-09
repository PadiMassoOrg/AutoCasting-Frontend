import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type { SliceResponse } from '../../../shared/types/sliceResponse.types';
import type { ProfileCardResponse } from '../types/talent-database.types';

export const TALENT_DATABASE_CACHE_KEY = ['cache-talent-database'] as const;

export const getTalentDatabase = async (): Promise<SliceResponse<ProfileCardResponse>> => {
  const response = await api.get(API_ROUTES.TALENT_DATABASE);
  return response.data;
};
