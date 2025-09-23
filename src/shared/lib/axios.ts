import axios, { AxiosError } from 'axios';
import i18n from '../../shared/lib/i18n';
import { clearAuthToken, getAuthToken } from './cookies';
import { queryClient } from './queryClient';
import { API_ROUTES, ROUTES } from './routes';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL + API_ROUTES.API_V,
  withCredentials: true,
});

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

    if (status === 401 && !redirectedOn401) {
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
