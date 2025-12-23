import api from '../../../../shared/lib/axios';
import { API_ROUTES } from '../../../../shared/lib/routes';
import { stripUndefined } from '../../../../shared/utils/stripUndefined';
import type { CastingBasicInfo, CastingCardResponse } from '../types/employerCastings.types';
import type { CastingBasicInfoPatchRequest } from '../types/requests';

export const EMPLOYER_CASTING_CACHE_KEY = ['cache-employer-casting'] as const;

// GET
export const getMyCastings = async (): Promise<CastingCardResponse[]> => {
  const response = await api.get(API_ROUTES.EMPLOYER_CASTINGS);
  return response.data;
};

// POST
export const createEmptyCasting = async (): Promise<string> => {
  const response = await api.post(API_ROUTES.EMPLOYER_CASTINGS);
  return response.data;
};

// PATCH
export async function patchCastingBasicInfo(payload: CastingBasicInfoPatchRequest): Promise<CastingBasicInfo> {
  const body = stripUndefined(payload);
  const { data } = await api.patch(API_ROUTES.EMPLOYER_CASTING_BASIC_INFO, body);
  return data;
}
