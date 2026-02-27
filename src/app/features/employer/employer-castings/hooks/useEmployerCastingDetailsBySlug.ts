import { useQuery } from '@tanstack/react-query';
import { EMPLOYER_CASTING_CACHE_KEY, getEmployerCastingEditorBySlug } from '../services/employerCastingService';
import type { EmployerCastingEditorResponse } from '../types/employerCastings.types';

export const useEmployerCastingEditorBySlug = (slug?: string) => {
  return useQuery<EmployerCastingEditorResponse>({
    queryKey: slug ? [...EMPLOYER_CASTING_CACHE_KEY, slug] : [...EMPLOYER_CASTING_CACHE_KEY, 'no-slug'],
    queryFn: () => getEmployerCastingEditorBySlug(slug!),
    enabled: !!slug,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
