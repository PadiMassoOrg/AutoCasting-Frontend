import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type { Education } from '../types/profile.types';
import type { EducationRequest } from '../types/requests';
import { PROFILE_CACHE_KEY } from './profileService';

export const PROFILE_EDUCATION_CACHE_KEY = [PROFILE_CACHE_KEY, 'education'];

// POST
export const createNewEducation = async (payload: EducationRequest): Promise<Education> => {
  const response = await api.post(API_ROUTES.EDUCATION, payload);
  return response.data;
};

// PATCH
export const patchEducation = async (payload: EducationRequest): Promise<Education> => {
  const response = await api.patch(API_ROUTES.EDUCATION + `/${payload.id}`, payload);
  return response.data;
};

// DELETE
export const deleteEducation = async (id: string): Promise<void> => {
  await api.delete(API_ROUTES.EDUCATION + `/${id}`); // 204 OK
};
