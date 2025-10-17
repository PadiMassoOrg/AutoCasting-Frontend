import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { TalentPublicProfileResponse } from '../../talent/talent-profile-edit/types/talentProfile.types';
import { getPublicProfile, PUBLIC_PROFILE_CACHE_KEY } from '../services/publicProfileService';

export const usePublicProfile = (slug?: string) => {
  const qc = useQueryClient();
  const bump = qc.getQueryState<TalentPublicProfileResponse>(PUBLIC_PROFILE_CACHE_KEY)?.dataUpdatedAt ?? 0;

  return useQuery({
    queryKey: [PUBLIC_PROFILE_CACHE_KEY, slug, bump],
    queryFn: () => getPublicProfile(slug!),
    enabled: !!slug,
    staleTime: Infinity,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
