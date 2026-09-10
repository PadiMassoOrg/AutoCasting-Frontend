import { useInfiniteQuery } from '@tanstack/react-query';
import { getRawAuthToken } from '../../../../shared/lib/cookies';
import type { SliceResponse } from '../../../../shared/types/sliceResponse.types';
import type { TalentCastingApplicationCardResponse } from '../types/talentCastingApplication.types';
import {
  TALENT_CASTING_APPLICATIONS_CACHE_KEY,
  getMyTalentApplications,
  type GetMyTalentApplicationsArgs,
} from '../services/talentCastingApplicationsService';

type UseTalentCastingApplicationsArgs = Omit<GetMyTalentApplicationsArgs, 'page'>;

export const useTalentCastingApplications = (args: UseTalentCastingApplicationsArgs) => {
  const token = getRawAuthToken();

  return useInfiniteQuery<SliceResponse<TalentCastingApplicationCardResponse>>({
    queryKey: [...TALENT_CASTING_APPLICATIONS_CACHE_KEY, args.size, args.orderBy, JSON.stringify(args.filters ?? {})],
    queryFn: ({ pageParam = 0 }) => getMyTalentApplications({ ...args, page: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    enabled: !!token,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: 1,
    placeholderData: (previousData) => previousData,
  });
};
