import Cookies from 'js-cookie';
import { jwtDecoder } from '../utils/jwtDecoder';

const AUTH_COOKIE_NAME = 'authToken';
const REFRESH_COOKIE_NAME = 'refreshToken';
const AUTH_COOKIE_PATH = '/';
const FALLBACK_AUTH_COOKIE_DAYS = 7;
const REFRESH_COOKIE_DAYS = 30;
const AUTH_TOKEN_CHANGE_EVENT = 'autocasting:auth-token-changed';
const AUTH_TOKEN_SYNC_STORAGE_KEY = 'autocasting:auth-token-sync';

const emitAuthTokenChange = () => {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new Event(AUTH_TOKEN_CHANGE_EVENT));

  try {
    window.localStorage.setItem(AUTH_TOKEN_SYNC_STORAGE_KEY, String(Date.now()));
  } catch {
    // ignore localStorage failures
  }
};

const getTokenExpirationTime = (token: string) => {
  const payload = jwtDecoder(token);
  if (!payload?.exp) return null;

  const expirationTime = payload.exp * 1000;
  return Number.isNaN(expirationTime) ? null : expirationTime;
};

const getTokenExpirationDate = (token: string) => {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return undefined;

  const expirationDate = new Date(expirationTime);
  return Number.isNaN(expirationDate.getTime()) ? undefined : expirationDate;
};

export const getAuthTokenExpirationTime = (token: string) => {
  return getTokenExpirationTime(token);
};

export const isAuthTokenExpired = (token: string) => {
  const expirationTime = getTokenExpirationTime(token);
  return !expirationTime || expirationTime <= Date.now();
};

// Sets only the access-token cookie. Used directly by the Google OAuth2 redirect
// flow (GoogleAuthSuccessPage), where the refresh token isn't in the URL at all —
// it arrives separately as an HttpOnly cookie set by the backend itself.
export const setAuthToken = (token: string) => {
  const expirationDate = getTokenExpirationDate(token);

  Cookies.set(
    AUTH_COOKIE_NAME,
    token,
    expirationDate
      ? { expires: expirationDate, path: AUTH_COOKIE_PATH }
      : { expires: FALLBACK_AUTH_COOKIE_DAYS, path: AUTH_COOKIE_PATH }
  );
  emitAuthTokenChange();
};

// Sets both cookies together — used by the JSON-body login/register/refresh flows,
// where both values are always available at once.
export const setAuthTokens = (token: string, refreshToken: string) => {
  setAuthToken(token);
  // Refresh token is opaque (not a JWT) — no exp claim to derive from, use a fixed expiry.
  Cookies.set(REFRESH_COOKIE_NAME, refreshToken, { expires: REFRESH_COOKIE_DAYS, path: AUTH_COOKIE_PATH });
};

// Returns whatever access token is stored, without checking expiry — used by the
// axios request interceptor, which must always attach a token if one exists (even
// an expired one) so an expired-token request reaches the backend and comes back
// as a 401 the response interceptor can react to (silent refresh, then retry).
// Self-clearing here would strip the header before the request is even sent,
// leaving no 401-with-token case for the refresh logic to ever detect.
export const getRawAuthToken = () => {
  return Cookies.get(AUTH_COOKIE_NAME);
};

// Returns a token only if it's still valid — used by callers that need to know
// "is there a usable session right now" (e.g. isAuthenticated checks), not by
// the request interceptor.
export const getAuthToken = () => {
  const token = Cookies.get(AUTH_COOKIE_NAME);
  if (!token) return undefined;

  if (isAuthTokenExpired(token)) {
    clearAuthToken();
    return undefined;
  }

  return token;
};

export const getRefreshToken = () => {
  return Cookies.get(REFRESH_COOKIE_NAME);
};

export const clearAuthToken = () => {
  Cookies.remove(AUTH_COOKIE_NAME, { path: AUTH_COOKIE_PATH });
  Cookies.remove(AUTH_COOKIE_NAME);
  Cookies.remove(REFRESH_COOKIE_NAME, { path: AUTH_COOKIE_PATH });
  Cookies.remove(REFRESH_COOKIE_NAME);
  emitAuthTokenChange();
};

export const subscribeToAuthTokenChanges = (onStoreChange: () => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleTokenChange = () => onStoreChange();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === AUTH_TOKEN_SYNC_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener(AUTH_TOKEN_CHANGE_EVENT, handleTokenChange);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(AUTH_TOKEN_CHANGE_EVENT, handleTokenChange);
    window.removeEventListener('storage', handleStorage);
  };
};
