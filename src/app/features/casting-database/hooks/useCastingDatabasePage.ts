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
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    placeholderData: (previousData) => previousData,
  });
}
