import { useQuery } from '@tanstack/react-query';
import { getRawAuthToken } from '../../../../shared/lib/cookies';
import {
  getEmployerApplicantsByCastingSlugGrouped,
  getEmployerCastingApplicantsGroupedQueryKey,
  type GetEmployerApplicantsGroupedArgs,
} from '../services/employerCastingApplicantsService';

export const useEmployerCastingApplicantsGrouped = (
  args: GetEmployerApplicantsGroupedArgs,
  opts?: { enabled?: boolean }
) => {
  const token = getRawAuthToken();

  return useQuery({
    queryKey: getEmployerCastingApplicantsGroupedQueryKey(args),
    queryFn: ({ signal }) => getEmployerApplicantsByCastingSlugGrouped(args, { signal }),
    enabled: (opts?.enabled ?? true) && !!token && !!args.slug,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: 1,
    placeholderData: (previousData) => previousData,
  });
};
