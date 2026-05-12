import { useQuery } from '@tanstack/react-query';
import { useAuthToken } from '../../../auth/hooks/useAuthToken';
import { EMPLOYER_CASTING_CACHE_KEY, getEmployerCastingDetailsBySlug } from '../services/employerCastingService';
import type { EmployerCastingDetailsResponse } from '../types/employerCastings.types';

export const useEmployerCastingDetailsBySlug = (slug?: string) => {
  const token = useAuthToken();

  return useQuery<EmployerCastingDetailsResponse>({
    queryKey: slug
      ? [...EMPLOYER_CASTING_CACHE_KEY, slug, token ?? 'no-token']
      : [...EMPLOYER_CASTING_CACHE_KEY, 'no-slug', token ?? 'no-token'],
    queryFn: () => getEmployerCastingDetailsBySlug(slug!),
    enabled: !!slug && !!token,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
