import api from '../../../../../shared/lib/axios';
import { API_ROUTES } from '../../../../../shared/lib/routes';
import type { ChangePasswordRequest } from '../types/account.types';

export const changePassword = async (data: ChangePasswordRequest) => {
  const response = await api.post(API_ROUTES.CHANGE_PASSWORD, data);
  return response.data;
};
