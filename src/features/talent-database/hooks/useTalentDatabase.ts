// useTalentDatabase.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import type { SliceResponse } from '../../../shared/types/sliceResponse.types';
import { normalizeFilters } from '../../../shared/utils/queryKeys';
import { getTalentDatabase, TALENT_DATABASE_CACHE_KEY } from '../services/talentDatabaseService';
import type { ProfileCardResponse, TalentFiltersQS } from '../types/talent-database.types';

export function useTalentDatabase(size = 6, filters?: TalentFiltersQS) {
  const norm = normalizeFilters(filters);
  const key = JSON.stringify(norm);

  return useInfiniteQuery<SliceResponse<ProfileCardResponse>, Error>({
    queryKey: [TALENT_DATABASE_CACHE_KEY, size, key],
    initialPageParam: 0,
    queryFn: async ({ pageParam, signal }) => {
      const data = await getTalentDatabase(pageParam as number, size, norm, { signal });
      return data ?? { items: [], hasNext: false, page: pageParam as number, size };
    },
    getNextPageParam: (lastPage, allPages) => (lastPage.hasNext ? allPages.length : undefined),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
    networkMode: 'always',
    retry: 1,
  });
}
