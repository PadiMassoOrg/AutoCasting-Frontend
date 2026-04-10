import { useQuery } from '@tanstack/react-query';
import { useAuthToken } from '../../../../auth/hooks/useAuthToken';
import { CASTING_SECTION_BASIC_INFO_CACHE_KEY, getSectionBasicInfoById } from '../../services/employerCastingService';
import type { CastingSectionBasicInfo } from '../../types/employerCastings.types';

export const useSectionBasicInfo = (sectionId: string) => {
  const token = useAuthToken();

  return useQuery<CastingSectionBasicInfo>({
    queryKey: [...CASTING_SECTION_BASIC_INFO_CACHE_KEY, sectionId ?? 'no-id', token ?? 'no-token'],
    queryFn: () => getSectionBasicInfoById(sectionId),
    enabled: !!sectionId && !!token,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
