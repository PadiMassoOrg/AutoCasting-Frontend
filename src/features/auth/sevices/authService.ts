import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  RoleRequest,
} from '../types/auth.types';

export const login = async (data: LoginRequest) => {
  const response = await api.post(API_ROUTES.AUTH_LOGIN, data);
  return response.data;
};

export const register = async (data: RegisterRequest) => {
  const response = await api.post(API_ROUTES.AUTH_REGISTER, data);
  return response.data;
};

export const googleLogin = async (data: RoleRequest) => {
  let finalUrl = import.meta.env.VITE_BASE_API_URL + API_ROUTES.OAUTH_GOOGLE;
  data.role ? (finalUrl += API_ROUTES.PARAM_ROLE + data.role) : '';
  window.location.href = finalUrl;
};

export const forgotPassword = async (data: ForgotPasswordRequest) => {
  const response = await api.post(API_ROUTES.FORGOT_PASSWORD, data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordRequest) => {
  const response = await api.post(API_ROUTES.RESET_PASSWORD, data);
  return response.data;
};
