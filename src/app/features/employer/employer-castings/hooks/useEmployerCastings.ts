import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '../../../../shared/lib/cookies';
import {
  EMPLOYER_CASTINGS_LIST_CACHE_KEY,
  getMyCastings,
  type GetMyCastingsArgs,
} from '../services/employerCastingService';

export const useEmployerCastings = (args: GetMyCastingsArgs) => {
  const token = getAuthToken();

  return useQuery({
    queryKey: [...EMPLOYER_CASTINGS_LIST_CACHE_KEY, token ?? 'no-token', args],
    queryFn: () => getMyCastings(args),
    enabled: !!token,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
