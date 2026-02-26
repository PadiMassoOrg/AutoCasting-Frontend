import { useQuery } from '@tanstack/react-query';
import { CASTING_DETAILS_CACHE_KEY, getCastingDetails } from '../services/castingDetailsService';
import type { CastingDetailsResponse } from '../types/publicCasting.types';

export const useCastingDetails = (args: { mode: 'public' | 'employer'; slug: string; roleId?: string }) => {
  const { mode, slug, roleId } = args;

  return useQuery<CastingDetailsResponse>({
    queryKey: [CASTING_DETAILS_CACHE_KEY, mode, slug, roleId ?? 'all'],
    queryFn: ({ signal }) => getCastingDetails({ mode, slug, roleId, signal }),
    enabled: !!slug && (mode === 'employer' || !!roleId),
    staleTime: 60_000,
    gcTime: 30 * 60_000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};
