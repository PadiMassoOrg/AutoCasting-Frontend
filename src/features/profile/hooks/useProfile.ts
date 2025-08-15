import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '../services/profileService';
import { PROFILE_CACHE_KEY } from '../services/profileService';

export const useProfile = () => {
  return useQuery({
    queryKey: PROFILE_CACHE_KEY,
    queryFn: getMyProfile,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
