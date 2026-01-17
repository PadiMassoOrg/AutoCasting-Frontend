import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '../../../../../shared/lib/cookies';
import {
  CASTING_SECTION_REQUIREMENTS_CACHE_KEY,
  getSectionRequirementsById,
} from '../../services/employerCastingService';
import type { CastingSectionRequirements } from '../../types/employerCastings.types';

export const useSectionRequirements = (sectionId: string) => {
  const token = getAuthToken();

  return useQuery<CastingSectionRequirements>({
    queryKey: [...CASTING_SECTION_REQUIREMENTS_CACHE_KEY, sectionId ?? 'no-id', token ?? 'no-token'],
    queryFn: () => getSectionRequirementsById(sectionId),
    enabled: !!sectionId,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
