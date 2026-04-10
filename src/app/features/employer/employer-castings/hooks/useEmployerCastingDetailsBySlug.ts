import { useQuery } from '@tanstack/react-query';
import { useAuthToken } from '../../../auth/hooks/useAuthToken';
import { EMPLOYER_CASTING_CACHE_KEY, getEmployerCastingEditorBySlug } from '../services/employerCastingService';
import type { EmployerCastingEditorResponse } from '../types/employerCastings.types';

export const useEmployerCastingEditorBySlug = (slug?: string) => {
  const token = useAuthToken();

  return useQuery<EmployerCastingEditorResponse>({
    queryKey: slug
      ? [...EMPLOYER_CASTING_CACHE_KEY, slug, token ?? 'no-token']
      : [...EMPLOYER_CASTING_CACHE_KEY, 'no-slug', token ?? 'no-token'],
    queryFn: () => getEmployerCastingEditorBySlug(slug!),
    enabled: !!slug && !!token,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
