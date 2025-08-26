import axios from 'axios';
import i18n from '../../shared/lib/i18n';
import { API_ROUTES, ROUTES } from './routes';
import { clearAuthToken, getAuthToken } from './cookies';
import { queryClient } from './queryClient';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL + API_ROUTES.API_V,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const lang = i18n.language;
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (lang === 'es') {
    config.headers['Accept-Language'] = 'es';
  } else {
    delete config.headers['Accept-Language'];
  }

  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthToken();
      queryClient.clear();
      window.location.href = ROUTES.HOME;
    }
    return Promise.reject(error);
  }
);

export default api;
