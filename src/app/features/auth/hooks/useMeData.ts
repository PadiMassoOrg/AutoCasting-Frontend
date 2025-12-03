import { useQuery } from '@tanstack/react-query';
import { ME_DATA_CACHE_KEY, meData } from '../services/authService';
import { getAuthToken } from '../../../shared/lib/cookies';
import type { MeDataResponse } from '../types/auth.types';

export const useMeData = () => {
  const token = getAuthToken();

  return useQuery<MeDataResponse>({
    queryKey: ME_DATA_CACHE_KEY,
    queryFn: meData,
    enabled: !!token,
    staleTime: 0,
    refetchOnMount: 'always',
    retry: false,
  });
};
