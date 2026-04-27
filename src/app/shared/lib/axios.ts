import axios, { AxiosError } from 'axios';
import i18n from '../../shared/lib/i18n';
import { getAuthToken } from './cookies';
import { forceLogoutRedirect } from './authSession';
import { requestLegalAcceptance } from './legalAcceptanceGate';
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

const LEGAL_REDIRECT_EXCLUDED_PATHS = new Set([
  API_ROUTES.LEGAL_REQUIREMENTS,
  API_ROUTES.ACCEPT_CURRENT_LEGAL_DOCUMENT,
  API_ROUTES.ACCEPT_LEGAL_DOCUMENT,
  API_ROUTES.CURRENT_LEGAL_DOCUMENT,
  API_ROUTES.SITEMETADATA,
  API_ROUTES.SITEMETADATA_VERSION,
]);

const shouldSkip428Handling = (url?: string) => {
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    if (currentPath === ROUTES.TERMS || currentPath === ROUTES.PRIVACY) {
      return true;
    }
  }

  if (!url) return false;
  return Array.from(LEGAL_REDIRECT_EXCLUDED_PATHS).some((path) => url.includes(path));
};

// --- Request ---
api.interceptors.request.use((config) => {
  const lang = i18n.language;
  const token = getAuthToken();
  if (token && redirectedOn401) redirectedOn401 = false;
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
    const hasToken = !!getAuthToken();
    const alreadyRetriedForLegal = !!(error.config as any)?._legalAcceptanceRetried;

    if (status === 401 && hasToken && !redirectedOn401 && !shouldSkip401Redirect(url)) {
      redirectedOn401 = true;
      forceLogoutRedirect();
      return Promise.reject(error);
    }

    if (status === 428 && hasToken && !alreadyRetriedForLegal && !shouldSkip428Handling(url) && error.config) {
      const accepted = await requestLegalAcceptance();
      if (accepted) {
        return api.request({
          ...error.config,
          _legalAcceptanceRetried: true,
        } as any);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
