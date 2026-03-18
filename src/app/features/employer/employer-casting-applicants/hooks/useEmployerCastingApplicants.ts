import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '../../../../shared/lib/cookies';
import {
  getEmployerApplicantsByCastingSlug,
  getEmployerCastingApplicantsQueryKey,
  type GetEmployerApplicantsArgs,
} from '../services/employerCastingApplicantsService';

export const useEmployerCastingApplicants = (args: GetEmployerApplicantsArgs) => {
  const token = getAuthToken();

  return useQuery({
    queryKey: getEmployerCastingApplicantsQueryKey(args),
    queryFn: () => getEmployerApplicantsByCastingSlug(args),
    enabled: !!token && !!args.slug,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
