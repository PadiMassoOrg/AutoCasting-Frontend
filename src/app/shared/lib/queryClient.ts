import { QueryClient } from '@tanstack/react-query';

export { QUERY_CACHE_PERSIST_KEY } from './storageKeys';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Importante: gcTime >= maxAge de persistencia (ver docs)
      gcTime: 24 * 60 * 60 * 1000, // 24h
      staleTime: 24 * 60 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});
