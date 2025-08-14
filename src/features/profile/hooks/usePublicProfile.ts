import { useQuery } from '@tanstack/react-query';
import { getPublicProfile } from '../services/profileService';

export const usePublicProfile = (slug: string) => {
  return useQuery({
    queryKey: ['public-profile', slug],
    queryFn: () => getPublicProfile(slug),
    enabled: !!slug,
  });
};
