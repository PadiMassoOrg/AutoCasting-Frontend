import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';

export const login = async (data: { email: string; password: string }) => {
  const response = await api.post(API_ROUTES.AUTH_LOGIN, data);
  return response.data;
};

export const register = async (data: { name: string; email: string; password: string }) => {
  const response = await api.post(API_ROUTES.AUTH_REGISTER, data);
  return response.data;
};

export const googleLogin = async (data: { role: string }) => {
  let finalUrl = import.meta.env.VITE_BASE_API_URL + API_ROUTES.OAUTH_GOOGLE;
  data.role ? (finalUrl += API_ROUTES.PARAM_ROLE + data.role) : '';
  window.location.href = finalUrl;
};

export const forgotPassword = async (data: { email: string }) => {
  const response = await api.post(API_ROUTES.FORGOT_PASSWORD, data);
  return response.data;
};
