import { useQuery } from '@tanstack/react-query';
import { ME_DATA_CACHE_KEY, meData } from '../services/authService';
import type { MeDataResponse } from '../types/auth.types';
import { useAuthToken } from './useAuthToken';

export const useMeData = () => {
  const token = useAuthToken();

  // Token is NOT part of the query key: /auth/me's response doesn't depend on which
  // access token was used, only on whether one exists (enabled). Keying on the token
  // value meant every silent refresh (new access token) reset this to a fresh,
  // dataless query, causing a visible flash while it refetched — even though nothing
  // about the user's data actually changed.
  return useQuery<MeDataResponse>({
    queryKey: ME_DATA_CACHE_KEY,
    queryFn: meData,
    enabled: !!token,
    staleTime: 0,
    refetchOnMount: 'always',
    retry: false,
  });
};
