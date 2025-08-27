import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type { Credit } from '../types/profile.types';
import type { CreditRequest } from '../types/requests';

// POST
export const createNewCredit = async (payload: CreditRequest): Promise<Credit> => {
  const response = await api.post(API_ROUTES.CREDIT, payload);
  return response.data;
};
