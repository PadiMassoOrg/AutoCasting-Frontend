import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { EMPLOYER_CASTING_DETAILS_CACHE_KEY, getEmployerCastingDetails } from '../services/castingDetailsService';
import type { CastingDetailsResponse } from '../types/publicCasting.types';

type Args = { slug: string };
type Options = Omit<UseQueryOptions<CastingDetailsResponse>, 'queryKey' | 'queryFn'>;

export const useEmployerCastingDetails = (args: Args, options?: Options) => {
  const { slug } = args;

  return useQuery<CastingDetailsResponse>({
    queryKey: [...EMPLOYER_CASTING_DETAILS_CACHE_KEY, slug ?? 'no-slug'],
    queryFn: ({ signal }) => getEmployerCastingDetails({ slug, signal }),
    enabled: !!slug,
    staleTime: 60_000,
    gcTime: 30 * 60_000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    ...(options ?? {}),
  });
};
