import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '../../../../shared/lib/cookies';
import { EMPLOYER_CASTING_ROLES_LIST_CACHE_KEY, getRolesBySectionId } from '../services/employerCastingService';

export const useCastingRoles = (sectionId?: string) => {
  const token = getAuthToken();

  return useQuery({
    queryKey: [...EMPLOYER_CASTING_ROLES_LIST_CACHE_KEY, token ?? 'no-token'],
    queryFn: () => getRolesBySectionId(sectionId!),
    enabled: !!sectionId,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
