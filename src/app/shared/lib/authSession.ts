import { clearAuthToken } from './cookies';
import { queryClient } from './queryClient';
import { ROUTES } from './routes';
import { USER_MODE_STORAGE_KEY } from './storageKeys';

const ME_DATA_CACHE_PREFIX = 'cache-me-data';

export const clearClientSession = () => {
  void queryClient.cancelQueries();

  // Evita limpiar todo el QueryClient (costoso en logout con cache grande).
  queryClient.removeQueries({
    predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === ME_DATA_CACHE_PREFIX,
  });

  clearAuthToken();

  try {
    window.localStorage.removeItem(USER_MODE_STORAGE_KEY);
  } catch {
    // ignore localStorage failures
  }
};

export const forceLogoutRedirect = () => {
  clearClientSession();
  window.location.replace(ROUTES.HOME);
};
