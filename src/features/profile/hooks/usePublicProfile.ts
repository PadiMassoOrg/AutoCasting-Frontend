import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPublicProfile, PUBLIC_PROFILE_CACHE_KEY } from '../services/profileService';
import type { PublicProfileResponse } from '../types/profile.types';

export const usePublicProfile = (slug?: string) => {
  const qc = useQueryClient();

  // “Bump” se actualiza cada vez que el perfil en cache se modifica (autosaves/setQueryData)
  const bump = qc.getQueryState<PublicProfileResponse>(PUBLIC_PROFILE_CACHE_KEY)?.dataUpdatedAt ?? 0;

  return useQuery({
    queryKey: ['public-profile', slug, bump],
    queryFn: () => getPublicProfile(slug!), // el backend necesita slug
    enabled: !!slug,
    // Evita refetches innecesarios; el "bump" es quien fuerza la actualización
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
