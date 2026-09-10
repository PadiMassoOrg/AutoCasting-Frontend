import { useQuery } from '@tanstack/react-query';
import { getRawAuthToken } from '../../../../shared/lib/cookies';
import {
  EMPLOYER_CASTINGS_LIST_CACHE_KEY,
  getMyCastings,
  type GetMyCastingsArgs,
} from '../services/employerCastingService';

export const useEmployerCastings = (args: GetMyCastingsArgs) => {
  const token = getRawAuthToken();

  return useQuery({
    queryKey: [
      ...EMPLOYER_CASTINGS_LIST_CACHE_KEY,
      args.page,
      args.size,
      args.orderBy,
      JSON.stringify(args.filters ?? {}),
    ],
    queryFn: () => getMyCastings(args),
    enabled: !!token,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
