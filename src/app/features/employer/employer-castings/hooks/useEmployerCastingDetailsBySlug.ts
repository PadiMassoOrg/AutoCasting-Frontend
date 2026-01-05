import { useQuery } from '@tanstack/react-query';
import { EMPLOYER_CASTING_CACHE_KEY, getEmployerCastingDetailsBySlug } from '../services/employerCastingService';
import type { EmployerCastingResponse } from '../types/employerCastings.types';

export const useEmployerCastingDetailsBySlug = (slug?: string) => {
  return useQuery<EmployerCastingResponse>({
    queryKey: slug ? [...EMPLOYER_CASTING_CACHE_KEY, slug] : [...EMPLOYER_CASTING_CACHE_KEY, 'no-slug'],
    queryFn: () => getEmployerCastingDetailsBySlug(slug!),
    enabled: !!slug,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
