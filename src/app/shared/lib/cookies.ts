import Cookies from 'js-cookie';
import { jwtDecoder } from '../utils/jwtDecoder';

const AUTH_COOKIE_NAME = 'authToken';
const AUTH_COOKIE_PATH = '/';
const FALLBACK_AUTH_COOKIE_DAYS = 7;
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

export const getAuthToken = () => {
  const token = Cookies.get(AUTH_COOKIE_NAME);
  if (!token) return undefined;

  if (isAuthTokenExpired(token)) {
    clearAuthToken();
    return undefined;
  }

  return token;
};

export const clearAuthToken = () => {
  Cookies.remove(AUTH_COOKIE_NAME, { path: AUTH_COOKIE_PATH });
  Cookies.remove(AUTH_COOKIE_NAME);
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
