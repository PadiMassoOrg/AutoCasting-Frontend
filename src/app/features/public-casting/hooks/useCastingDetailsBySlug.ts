import { useQuery } from '@tanstack/react-query';
import { CASTING_DETAILS_CACHE_KEY, getCastingDetailsBySlug } from '../services/publicCastingService';
import type { CastingDetailsResponse } from '../types/publicCasting.types';

export const useCastingDetailsBySlug = (slug?: string) => {
  return useQuery<CastingDetailsResponse>({
    queryKey: [...CASTING_DETAILS_CACHE_KEY, slug],
    queryFn: ({ signal }) => getCastingDetailsBySlug(slug!, { signal }),
    enabled: !!slug,
    staleTime: 60_000,
    gcTime: 30 * 60_000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};
