import { useQuery } from '@tanstack/react-query';
import { getRawAuthToken } from '../../../../shared/lib/cookies';
import { getMyProfile, TALENT_PROFILE_CACHE_KEY } from '../services/talentProfileService';
import type { TalentProfileResponse } from '../types/talentProfile.types';

export const useTalentProfile = () => {
  const token = getRawAuthToken();

  return useQuery({
    queryKey: TALENT_PROFILE_CACHE_KEY,
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
