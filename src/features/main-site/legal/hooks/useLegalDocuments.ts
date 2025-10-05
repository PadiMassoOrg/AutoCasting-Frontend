import { useQuery } from '@tanstack/react-query';
import { fetchLegalDocuments, LEGAL_CACHE_KEY } from '../services/legalService';

export function useLegalDocuments(type: string, locale: string) {
  return useQuery({
    queryKey: [LEGAL_CACHE_KEY, type],
    queryFn: () => fetchLegalDocuments(type, locale),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24 * 30, // 30 Days
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
