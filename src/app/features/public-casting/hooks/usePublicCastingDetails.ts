import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { getPublicCastingDetails, PUBLIC_CASTING_DETAILS_CACHE_KEY } from '../services/castingDetailsService';
import type { PublicCastingDetailsResponse } from '../types/publicCasting.types';

type Args = { slug: string; roleId: string };
type Options = Omit<UseQueryOptions<PublicCastingDetailsResponse>, 'queryKey' | 'queryFn'>;

export const usePublicCastingDetails = (args: Args, options?: Options) => {
  const { slug, roleId } = args;

  return useQuery<PublicCastingDetailsResponse>({
    queryKey: [...PUBLIC_CASTING_DETAILS_CACHE_KEY, slug ?? 'no-slug', roleId ?? 'no-role'],
    queryFn: ({ signal }) => getPublicCastingDetails({ slug, roleId, signal }),
    enabled: !!slug && !!roleId,
    staleTime: 60_000,
    gcTime: 30 * 60_000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
    ...(options ?? {}),
  });
};
