import { useInfiniteQuery } from '@tanstack/react-query';
import type { SliceResponse } from '../../../shared/types/sliceResponse.types';
import { getTalentDatabase } from '../services/talentDatabaseService';
import type { ProfileCardResponse, TalentFiltersQS } from '../types/talent-database.types';

export function useTalentDatabase(size = 6, filters?: TalentFiltersQS) {
  return useInfiniteQuery<SliceResponse<ProfileCardResponse>>({
    queryKey: ['talents', size, filters],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getTalentDatabase(pageParam as number, size, filters),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasNext ? allPages.length : undefined),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
