import { useQuery } from '@tanstack/react-query';
import { getRawAuthToken } from '../../../../shared/lib/cookies';
import {
  getEmployerApplicantsByCastingSlug,
  getEmployerCastingApplicantsQueryKey,
  type GetEmployerApplicantsArgs,
} from '../services/employerCastingApplicantsService';

export const useEmployerCastingApplicants = (args: GetEmployerApplicantsArgs, opts?: { enabled?: boolean }) => {
  const token = getRawAuthToken();

  return useQuery({
    queryKey: getEmployerCastingApplicantsQueryKey(args),
    queryFn: () => getEmployerApplicantsByCastingSlug(args),
    enabled: (opts?.enabled ?? true) && !!token && !!args.slug,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: 1,
    placeholderData: (previousData) => previousData,
  });
};
