import { useInfiniteQuery } from '@tanstack/react-query';
import { getAuthToken } from '../../../../shared/lib/cookies';
import type { SliceResponse } from '../../../../shared/types/sliceResponse.types';
import type { EmployerCastingApplicantCardResponse } from '../types/employerCastingApplicants.types';
import {
  EMPLOYER_CASTING_APPLICANTS_CACHE_KEY,
  getEmployerApplicantsByCastingSlug,
  type GetEmployerApplicantsArgs,
} from '../services/employerCastingApplicantsService';

type UseEmployerCastingApplicantsInfiniteArgs = Omit<GetEmployerApplicantsArgs, 'page'>;

export const useEmployerCastingApplicantsInfinite = (
  args: UseEmployerCastingApplicantsInfiniteArgs,
  opts?: { enabled?: boolean }
) => {
  const token = getAuthToken();

  return useInfiniteQuery<SliceResponse<EmployerCastingApplicantCardResponse>>({
    queryKey: [
      ...EMPLOYER_CASTING_APPLICANTS_CACHE_KEY,
      args.slug,
      'infinite',
      args.size,
      args.orderBy,
      JSON.stringify({
        search: (args.filters.search ?? '').trim() || undefined,
        roleId: args.filters.roleId,
        applicationStatusIdTokens: args.filters.applicationStatusIdTokens ?? [],
      }),
    ],
    queryFn: ({ pageParam = 0, signal }) =>
      getEmployerApplicantsByCastingSlug({ ...args, page: pageParam as number }, { signal }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    enabled: (opts?.enabled ?? true) && !!token && !!args.slug,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
