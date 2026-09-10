import axios, { AxiosError } from 'axios';
import i18n from '../../shared/lib/i18n';
import { getRawAuthToken, getRefreshToken, setAuthToken, setAuthTokens } from './cookies';
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
  API_ROUTES.AUTH_REFRESH,
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
  // Always attach whatever token is stored, even if expired — an expired token must
  // still reach the backend so it comes back as a 401 the response interceptor can
  // silently refresh from. getAuthToken() would self-clear an expired token before
  // the request is even sent, defeating that.
  const token = getRawAuthToken();
  if (token && redirectedOn401) redirectedOn401 = false;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (lang === 'es') config.headers['Accept-Language'] = 'es';
  else delete config.headers['Accept-Language'];
  return config;
});

// --- Response ---
let redirectedOn401 = false;
let refreshPromise: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  // A JS-readable refreshToken cookie only exists for the password-login flow. For a
  // Google OAuth2 session, the refresh token lives in an HttpOnly cookie that this code
  // can never read — but the browser still attaches it automatically (withCredentials)
  // as long as the request is actually made, so don't bail out just because there's
  // nothing to put in the body; the backend falls back to reading the cookie itself.
  const refreshToken = getRefreshToken();
  try {
    // Bare axios, not the `api` instance: `api`'s own interceptors would re-attach the
    // (expired) Authorization header from getRawAuthToken() and could recursively trigger
    // this same refresh-on-401 logic.
    const { data } = await axios.post(API_ROUTES.AUTH_REFRESH, refreshToken ? { refreshToken } : {}, {
      baseURL: api.defaults.baseURL,
      withCredentials: true,
    });
    if (refreshToken) {
      // Password-login session: both new tokens arrive in the body and must be written
      // as JS-set cookies here, same as login.
      setAuthTokens(data.token, data.refreshToken);
    } else {
      // Google-originated session: the rotated refresh token was already re-delivered as
      // an HttpOnly Set-Cookie header on this same response — writing it again here via
      // JS would downgrade it to a JS-readable cookie, defeating the point of HttpOnly.
      // Only the access token needs to be set client-side.
      setAuthToken(data.token);
    }
    return data.token as string;
  } catch {
    return null;
  }
}

// Exported so AuthSessionWatcher (AppRoutes.tsx) can proactively trigger the same
// shared, single-flight refresh when its own expiry timer fires, instead of just
// logging the user out — the timer firing means the access token's exp claim was
// reached, not that the session itself is dead; only a failed refresh means that.
export function getOrStartRefresh(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url;
    // Whether the request that just failed actually carried an Authorization header —
    // the accurate "was there a session" signal here, since getAuthToken() self-clears
    // an expired token and would otherwise make every branch below think there's no
    // session at all right when an expired token is exactly the case being handled.
    const hadTokenOnRequest = !!(error.config?.headers as any)?.Authorization;
    const alreadyRetriedForLegal = !!(error.config as any)?._legalAcceptanceRetried;
    const alreadyRetriedForRefresh = !!(error.config as any)?._refreshRetried;

    if (
      status === 401 &&
      hadTokenOnRequest &&
      !alreadyRetriedForRefresh &&
      !shouldSkip401Redirect(url) &&
      error.config
    ) {
      const newToken = await getOrStartRefresh();
      if (newToken) {
        return api.request({
          ...error.config,
          _refreshRetried: true,
          headers: { ...error.config.headers, Authorization: `Bearer ${newToken}` },
        } as any);
      }
      // refresh failed — fall through to the redirect below
    }

    // No `hadTokenOnRequest` gate here (unlike the refresh-attempt branch above): a 401
    // from a non-public endpoint always means "not currently authenticated," whether the
    // token expired, was manually cleared, or never existed — all of those should redirect
    // the same way, not just the "had a token" case.
    if (status === 401 && !redirectedOn401 && !shouldSkip401Redirect(url)) {
      redirectedOn401 = true;
      forceLogoutRedirect();
      return Promise.reject(error);
    }

    if (status === 428 && hadTokenOnRequest && !alreadyRetriedForLegal && !shouldSkip428Handling(url) && error.config) {
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
