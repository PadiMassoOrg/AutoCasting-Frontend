import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '../../../../../shared/lib/cookies';
import { CASTING_SECTION_ROLES_CACHE_KEY, getSectionRolesById } from '../../services/employerCastingService';
import type { CastingSectionRoles } from '../../types/employerCastings.types';

export const useSectionRoles = (sectionId: string) => {
  const token = getAuthToken();

  return useQuery<CastingSectionRoles>({
    queryKey: [...CASTING_SECTION_ROLES_CACHE_KEY, sectionId ?? 'no-id', token ?? 'no-token'],
    queryFn: () => getSectionRolesById(sectionId),
    enabled: !!sectionId,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
