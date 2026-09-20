import { useQuery } from '@tanstack/react-query';
import type { SliceResponse } from '../../../shared/types/sliceResponse.types';
import { CASTING_DATABASE_CACHE_KEY, getCastingDatabase } from '../services/castingDatabaseService';
import type { CastingFiltersQS, CastingRolePublicCardResponse } from '../types/casting-database.types';
import { castingDatabaseFiltersKey, normalizeCastingDatabaseFilters } from '../utils/castingDatabaseFilterKey';

type UseCastingDatabasePageArgs = {
  page: number;
  size: number;
  filters: CastingFiltersQS;
  enabled?: boolean;
};

export const getCastingDatabasePageQueryKey = ({ page, size, filters }: UseCastingDatabasePageArgs) =>
  [
    ...CASTING_DATABASE_CACHE_KEY,
    page,
    size,
    castingDatabaseFiltersKey(normalizeCastingDatabaseFilters(filters)),
  ] as const;

export function useCastingDatabasePage({ page, size, filters, enabled = true }: UseCastingDatabasePageArgs) {
  const normalizedFilters = normalizeCastingDatabaseFilters(filters);

  return useQuery<SliceResponse<CastingRolePublicCardResponse>>({
    queryKey: getCastingDatabasePageQueryKey({ page, size, filters: normalizedFilters }),
    queryFn: ({ signal }) => getCastingDatabase(page, size, normalizedFilters, { signal }),
    enabled,
    // Catalog eligibility (a role's casting must still be published, its employer not suspended,
    // etc.) can change at any time from outside this session — always reflect current server
    // state rather than a stale client cache (see useTalentDatabaseInfinite for the concrete bug
    // this caused on the talent side). staleTime: 0 + refetchOnMount: 'always' together guarantee
    // a fresh request every time this page mounts; gcTime is kept small (not 0) only so the
    // previous page's rows can still serve as `placeholderData` during a page-change within the
    // same mount, not to allow reusing data across a real revisit.
    staleTime: 0,
    gcTime: 5_000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    placeholderData: (previousData) => previousData,
  });
}
