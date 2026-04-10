import { clearAuthToken } from './cookies';
import { queryClient } from './queryClient';
import { ROUTES } from './routes';
import { QUERY_CACHE_PERSIST_KEY, USER_MODE_STORAGE_KEY } from './storageKeys';

export const clearClientSession = () => {
  void queryClient.cancelQueries();
  queryClient.clear();
  clearAuthToken();

  try {
    window.localStorage.removeItem(QUERY_CACHE_PERSIST_KEY);
    window.localStorage.removeItem(USER_MODE_STORAGE_KEY);
  } catch {
    // ignore localStorage failures
  }
};

export const forceLogoutRedirect = () => {
  clearClientSession();
  window.location.replace(ROUTES.HOME);
};
