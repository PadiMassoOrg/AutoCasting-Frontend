import { useQuery } from '@tanstack/react-query';
import type { TalentPublicProfileResponse } from '../../talent/talent-profile-edit/types/talentProfile.types';
import { getPublicProfile, getPublicProfileQueryKey } from '../services/publicProfileService';

export const usePublicProfile = (slug?: string | null, enabled = true) => {
  return useQuery<TalentPublicProfileResponse>({
    queryKey: getPublicProfileQueryKey(slug),
    queryFn: () => getPublicProfile(slug!),
    enabled: !!slug && enabled,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
  });
};
