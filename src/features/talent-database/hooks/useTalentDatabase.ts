import { useInfiniteQuery } from '@tanstack/react-query';
import type { SliceResponse } from '../../../shared/types/sliceResponse.types';
import { normalizeFilters } from '../../../shared/utils/queryKeys';
import { getTalentDatabase } from '../services/talentDatabaseService';
import type { ProfileCardResponse, TalentFiltersQS } from '../types/talent-database.types';

export function useTalentDatabase(size = 6, filters?: TalentFiltersQS) {
  const norm = normalizeFilters(filters);
  const key = JSON.stringify(norm);

  return useInfiniteQuery<SliceResponse<ProfileCardResponse>>({
    queryKey: ['talents', size, key],
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) => getTalentDatabase(pageParam as number, size, norm, { signal }),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasNext ? allPages.length : undefined),
    placeholderData: (prev) => prev,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}
