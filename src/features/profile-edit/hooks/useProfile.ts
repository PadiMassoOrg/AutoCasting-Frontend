import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '../../../shared/lib/cookies';
import { computeProfileProgress } from '../services/computeProfileProgress';
import { getMyProfile, PROFILE_CACHE_KEY } from '../services/profileService';
import type { ProfileResponse } from '../types/profile.types';

export const useProfile = () => {
  const token = getAuthToken();

  return useQuery({
    queryKey: [...PROFILE_CACHE_KEY, token ?? 'no-token'],
    queryFn: getMyProfile,
    select: (p): ProfileResponse => ({
      ...p,
      progress: computeProfileProgress(p),
    }),
    enabled: !!token,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
