import { useInfiniteQuery } from '@tanstack/react-query';
import type { SliceResponse } from '../../../shared/types/sliceResponse.types';
import { TALENT_DATABASE_CACHE_KEY, getTalentDatabase } from '../services/talentDatabaseService';
import type { ProfileCardResponse, TalentFiltersQS } from '../types/talent-database.types';
import { normalizeTalentDatabaseFilters, talentDatabaseFiltersKey } from '../utils/talentDatabaseFilterKey';

type UseTalentDatabaseInfiniteArgs = {
  pageSize: number;
  filters: TalentFiltersQS;
  enabled?: boolean;
  staleTimeMs?: number; // default 60s
};

export function useTalentDatabaseInfinite({
  pageSize,
  filters,
  enabled = true,
  staleTimeMs = 60_000,
}: UseTalentDatabaseInfiniteArgs) {
  const normalized = normalizeTalentDatabaseFilters(filters);
  const filtersKey = talentDatabaseFiltersKey(normalized);

  return useInfiniteQuery<SliceResponse<ProfileCardResponse>>({
    queryKey: [...TALENT_DATABASE_CACHE_KEY, pageSize, filtersKey],
    queryFn: ({ pageParam = 0, signal }) => getTalentDatabase(pageParam as number, pageSize, normalized, { signal }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    enabled,
    staleTime: staleTimeMs,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}
