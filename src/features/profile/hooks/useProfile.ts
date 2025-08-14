import { useQuery } from '@tanstack/react-query';
import type { ProfileResponse } from '../types/profile.types';
import { getMyProfile } from '../services/profileService';

export const useProfile = () => {
  return useQuery<ProfileResponse>({
    queryKey: ['profile'],
    queryFn: getMyProfile,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
