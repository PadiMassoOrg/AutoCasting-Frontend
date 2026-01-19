import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '../../../../shared/lib/cookies';
import { EMPLOYER_CASTINGS_LIST_CACHE_KEY, getMyCastings } from '../services/employerCastingService';

export const useEmployerCastings = () => {
  const token = getAuthToken();

  return useQuery({
    queryKey: [...EMPLOYER_CASTINGS_LIST_CACHE_KEY, token ?? 'no-token'],
    queryFn: getMyCastings,
    enabled: !!token,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
