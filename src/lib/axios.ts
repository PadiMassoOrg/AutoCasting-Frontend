import axios from 'axios';
import i18n from '../i18n';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
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
