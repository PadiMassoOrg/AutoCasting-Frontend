import axios from 'axios';
import i18n from '../../shared/lib/i18n';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL + '/api/v1',
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
