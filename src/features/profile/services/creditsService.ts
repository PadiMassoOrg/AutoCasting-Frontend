import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type { Credit } from '../types/profile.types';
import type { CreditRequest } from '../types/requests';
import { PROFILE_CACHE_KEY } from './profileService';

export const PROFILE_CREDITS_CACHE_KEY = [PROFILE_CACHE_KEY, 'credits'];
// POST
export const createNewCredit = async (payload: CreditRequest): Promise<Credit> => {
  const response = await api.post(API_ROUTES.CREDIT, payload);
  return response.data;
};

// PATCH
export const patchCredit = async (payload: CreditRequest): Promise<Credit> => {
  const response = await api.patch(API_ROUTES.CREDIT + `/${payload.id}`, payload);
  return response.data;
};

// DELETE
export const deleteCredit = async (id: string): Promise<void> => {
  await api.delete(API_ROUTES.CREDIT + `/${id}`); // 204 OK
};
