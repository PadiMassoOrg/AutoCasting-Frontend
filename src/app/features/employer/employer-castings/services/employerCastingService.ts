import api from '../../../../shared/lib/axios';
import { API_ROUTES } from '../../../../shared/lib/routes';
import type { CastingCardResponse } from '../types/employerCastings.types';

export const getMyCastings = async (): Promise<CastingCardResponse[]> => {
  const response = await api.get(API_ROUTES.EMPLOYER_CASTINGS);
  return response.data;
};
