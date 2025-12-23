import { useQuery } from '@tanstack/react-query';
import { EMPLOYER_CASTING_CACHE_KEY, getCastingDetailsBySlug } from '../services/employerCastingService';
import type { CastingResponse } from '../types/employerCastings.types';

export const useCastingDetailsBySlug = (slug?: string) => {
  return useQuery<CastingResponse>({
    queryKey: slug ? [...EMPLOYER_CASTING_CACHE_KEY, slug] : [...EMPLOYER_CASTING_CACHE_KEY, 'no-slug'],
    queryFn: () => getCastingDetailsBySlug(slug!),
    enabled: !!slug,
    staleTime: Infinity,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
