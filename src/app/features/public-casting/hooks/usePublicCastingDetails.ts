import { useQuery } from '@tanstack/react-query';
import { PUBLIC_CASTING_CACHE_KEY, getPublicCastingDetails } from '../services/publicCastingService';
import type { PublicCastingResponse } from '../types/publicCasting.types';

export const usePublicCastingDetails = (slug?: string) => {
  return useQuery<PublicCastingResponse>({
    queryKey: [...PUBLIC_CASTING_CACHE_KEY, slug],
    queryFn: ({ signal }) => getPublicCastingDetails(slug!, { signal }),
    enabled: !!slug,
    staleTime: 60_000,
    gcTime: 30 * 60_000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};
