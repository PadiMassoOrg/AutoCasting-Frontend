import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { getPublicCastingOverview, PUBLIC_CASTING_OVERVIEW_CACHE_KEY } from '../services/castingDetailsService';
import type { PublicCastingOverviewResponse } from '../types/publicCasting.types';

type Args = { slug: string };
type Options = Omit<UseQueryOptions<PublicCastingOverviewResponse>, 'queryKey' | 'queryFn'>;

export const usePublicCastingOverview = (args: Args, options?: Options) => {
  const { slug } = args;

  return useQuery<PublicCastingOverviewResponse>({
    queryKey: [...PUBLIC_CASTING_OVERVIEW_CACHE_KEY, slug ?? 'no-slug'],
    queryFn: ({ signal }) => getPublicCastingOverview({ slug, signal }),
    enabled: !!slug,
    staleTime: 60_000,
    gcTime: 30 * 60_000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
    ...(options ?? {}),
  });
};
