import { useInfiniteQuery } from '@tanstack/react-query';
import type { SliceResponse } from '../../../shared/types/sliceResponse.types';
import { CASTING_DATABASE_CACHE_KEY, getCastingDatabase } from '../services/castingDatabaseService';
import type { CastingFiltersQS, CastingRolePublicCardResponse } from '../types/casting-database.types';
import { castingDatabaseFiltersKey, normalizeCastingDatabaseFilters } from '../utils/castingDatabaseFilterKey';

type UseCastingDatabaseInfiniteArgs = {
  pageSize: number;
  filters: CastingFiltersQS;
  enabled?: boolean;
  staleTimeMs?: number; // default 60s
};

export function useCastingDatabaseInfinite({
  pageSize,
  filters,
  enabled = true,
  staleTimeMs = 60_000,
}: UseCastingDatabaseInfiniteArgs) {
  const normalized = normalizeCastingDatabaseFilters(filters);
  const filtersKey = castingDatabaseFiltersKey(normalized);

  return useInfiniteQuery<SliceResponse<CastingRolePublicCardResponse>>({
    queryKey: [...CASTING_DATABASE_CACHE_KEY, pageSize, filtersKey],
    queryFn: ({ pageParam = 0, signal }) => getCastingDatabase(pageParam as number, pageSize, normalized, { signal }),
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
