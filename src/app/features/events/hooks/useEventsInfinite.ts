import { useInfiniteQuery } from '@tanstack/react-query';
import type { SliceResponse } from '../../../shared/types/sliceResponse.types';
import { EVENTS_CATALOG_CACHE_KEY, getEvents } from '../services/eventsService';
import type { EventCardResponse, EventFiltersQS } from '../types/events.types';
import { eventsFiltersKey, normalizeEventFilters } from '../utils/eventsFilterKey';

type UseEventsInfiniteArgs = {
  pageSize: number;
  filters: EventFiltersQS;
  enabled?: boolean;
};

export function useEventsInfinite({ pageSize, filters, enabled = true }: UseEventsInfiniteArgs) {
  const normalized = normalizeEventFilters(filters);
  const filtersKey = eventsFiltersKey(normalized);

  return useInfiniteQuery<SliceResponse<EventCardResponse>>({
    queryKey: [...EVENTS_CATALOG_CACHE_KEY, pageSize, filtersKey],
    queryFn: ({ pageParam = 0, signal }) => getEvents(pageParam as number, pageSize, normalized, { signal }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    enabled,
    // Events can be created, edited or removed from another tab or device at any time, so the
    // catalog always reflects the current server state.
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}
