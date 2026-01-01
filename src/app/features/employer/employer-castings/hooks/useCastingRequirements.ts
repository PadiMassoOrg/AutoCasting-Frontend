import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '../../../../shared/lib/cookies';
import {
  EMPLOYER_CASTING_REQUIREMENTS_LIST_CACHE_KEY,
  getRequirementsBySectionId,
} from '../services/employerCastingService';

export const useCastingRequirements = (sectionId?: string) => {
  const token = getAuthToken();

  return useQuery({
    queryKey: [...EMPLOYER_CASTING_REQUIREMENTS_LIST_CACHE_KEY, sectionId ?? 'no-section', token ?? 'no-token'],
    queryFn: () => getRequirementsBySectionId(sectionId!),
    enabled: !!sectionId,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
