import api from '../../../shared/lib/axios';
import { clearAuthToken, getAuthToken } from '../../../shared/lib/cookies';
import { queryClient } from '../../../shared/lib/queryClient';
import { API_ROUTES, ROUTES } from '../../../shared/lib/routes';
import { TALENT_PROFILE_CACHE_KEY } from '../../talent/talent-profile-edit/services/talentProfileService';
import type {
  AuthenticationResponse,
  ForgotPasswordRequest,
  LoginRequest,
  MeDataResponse,
  RegisterRequest,
  ResetPasswordRequest,
} from '../types/auth.types';

export const ME_DATA_CACHE_KEY = ['cache-me-data'] as const;

export const register = async (data: RegisterRequest): Promise<AuthenticationResponse> => {
  const response = await api.post(API_ROUTES.AUTH_REGISTER, data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<AuthenticationResponse> => {
  const response = await api.post(API_ROUTES.AUTH_LOGIN, data);
  return response.data;
};

export const meData = async (): Promise<MeDataResponse> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('NO_TOKEN');
  }

  try {
    const { data } = await api.get<MeDataResponse>(API_ROUTES.AUTH_ME_DATA);
    return data;
  } catch (error: any) {
    const status = error?.response?.status;

    if (status === 401 || status === 403 || status === 409) {
      logout();
    }

    throw error;
  }
};

export const googleLogin = async () => {
  let finalUrl = import.meta.env.VITE_BASE_API_URL + API_ROUTES.OAUTH_GOOGLE;
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
  queryClient.removeQueries({ queryKey: ME_DATA_CACHE_KEY });
  queryClient.removeQueries({ queryKey: [TALENT_PROFILE_CACHE_KEY] });
  window.location.href = ROUTES.HOME;
};
