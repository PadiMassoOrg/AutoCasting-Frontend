import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '../../../shared/lib/cookies';
import { getMyProfile, PROFILE_CACHE_KEY } from '../services/profileService';

export const useProfile = () => {
  const token = getAuthToken();

  return useQuery({
    queryKey: [...PROFILE_CACHE_KEY, token ?? 'no-token'],
    queryFn: getMyProfile,
    enabled: !!token,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
