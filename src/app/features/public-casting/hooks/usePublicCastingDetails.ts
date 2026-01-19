import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PUBLIC_CASTING_CACHE_KEY, getPublicCastingDetails } from '../services/publicCastingService';
import type { PublicCastingResponse } from '../types/publicCasting.types';

export const usePublicCastingDetails = (slug?: string) => {
  const qc = useQueryClient();
  const bump = qc.getQueryState<PublicCastingResponse>(PUBLIC_CASTING_CACHE_KEY)?.dataUpdatedAt ?? 0;

  return useQuery({
    queryKey: [PUBLIC_CASTING_CACHE_KEY, slug, bump],
    queryFn: () => getPublicCastingDetails(slug!),
    enabled: !!slug,
    staleTime: Infinity,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
