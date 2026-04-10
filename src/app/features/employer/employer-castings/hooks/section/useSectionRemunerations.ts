import { useQuery } from '@tanstack/react-query';
import { useAuthToken } from '../../../../auth/hooks/useAuthToken';
import {
  CASTING_SECTION_REMUNERATIONS_CACHE_KEY,
  getSectionRemunerationsById,
} from '../../services/employerCastingService';
import type { CastingSectionRemunerations } from '../../types/employerCastings.types';

export const useSectionRemunerations = (sectionId: string) => {
  const token = useAuthToken();

  return useQuery<CastingSectionRemunerations>({
    queryKey: [...CASTING_SECTION_REMUNERATIONS_CACHE_KEY, sectionId ?? 'no-id', token ?? 'no-token'],
    queryFn: () => getSectionRemunerationsById(sectionId),
    enabled: !!sectionId && !!token,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
