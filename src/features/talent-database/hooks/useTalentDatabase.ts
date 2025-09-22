import { useInfiniteQuery } from '@tanstack/react-query';
import type { SliceResponse } from '../../../shared/types/sliceResponse.types';
import { normalizeFilters } from '../../../shared/utils/queryKeys';
import { getTalentDatabase, TALENT_DATABASE_CACHE_KEY } from '../services/talentDatabaseService';
import type { ProfileCardResponse, TalentFiltersQS } from '../types/talent-database.types';

export function useTalentDatabase(size = 6, filters?: TalentFiltersQS) {
  const norm = normalizeFilters(filters);
  const key = JSON.stringify(norm);

  return useInfiniteQuery<SliceResponse<ProfileCardResponse>>({
    queryKey: [TALENT_DATABASE_CACHE_KEY, size, key],
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) => getTalentDatabase(pageParam as number, size, norm, { signal }),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasNext ? allPages.length : undefined),
    refetchOnMount: 'always',
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 5 * 60_000,
    retry: 1,
    placeholderData: (prev) => prev,
  });
}
