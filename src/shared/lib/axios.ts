import axios from 'axios';
import i18n from '../../shared/lib/i18n';
import { API_ROUTES } from './routes';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL + API_ROUTES.API_V,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const lang = i18n.language;
  if (lang === 'es') {
    config.headers['Accept-Language'] = 'es';
  } else {
    delete config.headers['Accept-Language'];
  }
  return config;
});

export default api;
