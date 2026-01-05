import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '../../../../shared/lib/cookies';
import {
  CASTING_SECTION_REMUNERATIONS_CACHE_KEY,
  getSectionRemunerationsById,
} from '../services/employerCastingService';
import type { CastingSectionRemunerations } from '../types/employerCastings.types';

export const useSectionRemunerations = (sectionId: string) => {
  const token = getAuthToken();

  return useQuery<CastingSectionRemunerations>({
    queryKey: [...CASTING_SECTION_REMUNERATIONS_CACHE_KEY, sectionId ?? 'no-id', token ?? 'no-token'],
    queryFn: () => getSectionRemunerationsById(sectionId),
    enabled: !!sectionId,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
