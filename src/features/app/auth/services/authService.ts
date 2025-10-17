import api from '../../../../shared/lib/axios';
import { clearAuthToken } from '../../../../shared/lib/cookies';
import { queryClient } from '../../../../shared/lib/queryClient';
import { API_ROUTES, ROUTES } from '../../../../shared/lib/routes';
import { TALENT_PROFILE_CACHE_KEY } from '../../talent/talent-profile-edit/services/talentProfileService';
import type {
  AuthenticationResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  RoleRequest,
} from '../types/auth.types';

export const login = async (data: LoginRequest): Promise<AuthenticationResponse> => {
  const response = await api.post(API_ROUTES.AUTH_LOGIN, data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthenticationResponse> => {
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

export const logout = () => {
  clearAuthToken();
  queryClient.removeQueries({ queryKey: [TALENT_PROFILE_CACHE_KEY] });
  window.location.href = ROUTES.HOME;
};
