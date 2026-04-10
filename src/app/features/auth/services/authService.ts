import api from '../../../shared/lib/axios';
import { getAuthToken } from '../../../shared/lib/cookies';
import { forceLogoutRedirect } from '../../../shared/lib/authSession';
import { API_ROUTES } from '../../../shared/lib/routes';
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
    logout();
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
  forceLogoutRedirect();
};
