import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '../../../../shared/lib/cookies';
import {
  EMPLOYER_CASTING_APPLICANTS_CACHE_KEY,
  getEmployerApplicantsByCastingSlug,
  type GetEmployerApplicantsArgs,
} from '../services/employerCastingApplicantsService';

export const useEmployerCastingApplicants = (args: GetEmployerApplicantsArgs) => {
  const token = getAuthToken();

  return useQuery({
    queryKey: [
      ...EMPLOYER_CASTING_APPLICANTS_CACHE_KEY,
      token ?? 'no-token',
      args.slug,
      args.page,
      args.size,
      args.orderBy,
      JSON.stringify(args.filters ?? {}),
    ],
    queryFn: () => getEmployerApplicantsByCastingSlug(args),
    enabled: !!token && !!args.slug,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
