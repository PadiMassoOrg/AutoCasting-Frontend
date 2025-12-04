import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '../../../../shared/lib/cookies';
import { EMPLOYER_PROFILE_CACHE_KEY, getMyProfile } from '../services/employerProfileService';
import type { EmployerProfileResponse } from '../types/employerProfile.types';

export const useEmployerProfile = () => {
  const token = getAuthToken();

  return useQuery({
    queryKey: [...EMPLOYER_PROFILE_CACHE_KEY, token ?? 'no-token'],
    queryFn: getMyProfile,
    select: (p): EmployerProfileResponse => ({
      ...p,
    }),
    enabled: !!token,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
