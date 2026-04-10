import { useQuery } from '@tanstack/react-query';
import { ME_DATA_CACHE_KEY, meData } from '../services/authService';
import type { MeDataResponse } from '../types/auth.types';
import { useAuthToken } from './useAuthToken';

export const useMeData = () => {
  const token = useAuthToken();

  return useQuery<MeDataResponse>({
    queryKey: [...ME_DATA_CACHE_KEY, token ?? 'no-token'],
    queryFn: meData,
    enabled: !!token,
    staleTime: 0,
    refetchOnMount: 'always',
    retry: false,
  });
};
