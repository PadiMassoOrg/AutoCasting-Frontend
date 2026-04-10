import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '../../../../shared/lib/cookies';
import { getMyProfile, TALENT_PROFILE_CACHE_KEY } from '../services/talentProfileService';
import type { TalentProfileResponse } from '../types/talentProfile.types';

export const useTalentProfile = () => {
  const token = getAuthToken();

  return useQuery({
    queryKey: [...TALENT_PROFILE_CACHE_KEY, token ?? 'no-token'],
    queryFn: getMyProfile,
    select: (p): TalentProfileResponse => ({
      ...p,
    }),
    enabled: !!token,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
