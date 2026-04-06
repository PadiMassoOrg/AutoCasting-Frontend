import axios, { AxiosError } from 'axios';
import i18n from '../../shared/lib/i18n';
import { clearAuthToken, getAuthToken } from './cookies';
import { queryClient } from './queryClient';
import { API_ROUTES, ROUTES } from './routes';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL + API_ROUTES.API_V,
  withCredentials: true,
});

const AUTH_REDIRECT_EXCLUDED_PATHS = new Set([
  API_ROUTES.AUTH_LOGIN,
  API_ROUTES.AUTH_REGISTER,
  API_ROUTES.FORGOT_PASSWORD,
  API_ROUTES.RESET_PASSWORD,
]);

const shouldSkip401Redirect = (url?: string) => {
  if (!url) return false;
  return Array.from(AUTH_REDIRECT_EXCLUDED_PATHS).some((path) => url.includes(path));
};

// --- Request ---
api.interceptors.request.use((config) => {
  const lang = i18n.language;
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (lang === 'es') config.headers['Accept-Language'] = 'es';
  else delete config.headers['Accept-Language'];
  return config;
});

// --- Response ---
let redirectedOn401 = false;

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url;

    if (status === 401 && !redirectedOn401 && !shouldSkip401Redirect(url)) {
      redirectedOn401 = true;
      clearAuthToken();
      queryClient.clear();
      window.location.replace(ROUTES.HOME);
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
