import { useInfiniteQuery } from '@tanstack/react-query';
import type { SliceResponse } from '../../../shared/types/sliceResponse.types';
import { TALENT_DATABASE_CACHE_KEY, getTalentDatabase } from '../services/talentDatabaseService';
import type { ProfileCardResponse, TalentFiltersQS } from '../types/talent-database.types';
import { normalizeTalentDatabaseFilters, talentDatabaseFiltersKey } from '../utils/talentDatabaseFilterKey';

type UseTalentDatabaseInfiniteArgs = {
  pageSize: number;
  filters: TalentFiltersQS;
  enabled?: boolean;
};

export function useTalentDatabaseInfinite({ pageSize, filters, enabled = true }: UseTalentDatabaseInfiniteArgs) {
  const normalized = normalizeTalentDatabaseFilters(filters);
  const filtersKey = talentDatabaseFiltersKey(normalized);

  return useInfiniteQuery<SliceResponse<ProfileCardResponse>>({
    queryKey: [...TALENT_DATABASE_CACHE_KEY, pageSize, filtersKey],
    queryFn: ({ pageParam = 0, signal }) => getTalentDatabase(pageParam as number, pageSize, normalized, { signal }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    enabled,
    // Catalog visibility (headshot/full-body/deleted/suspended) can change at any time from
    // outside this page's own session (another tab, another device, an admin action) — this must
    // always reflect the current server state, never a stale client cache. Any client-side
    // caching here previously caused a real bug: a talent could delete their required photo and
    // still see themselves listed (or complete their profile and not appear) until a full reload.
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}
