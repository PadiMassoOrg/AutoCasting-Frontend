import api from '../../../shared/lib/axios';
import { API_ROUTES } from '../../../shared/lib/routes';
import type { SliceResponse } from '../../../shared/types/sliceResponse.types';
import type { EventCardResponse, EventFiltersQS } from '../types/events.types';
import { normalizeEventFilters } from '../utils/eventsFilterKey';

export const EVENTS_CATALOG_CACHE_KEY = ['cache-events-catalog', 'v1'] as const;

export const getEvents = async (
  page: number,
  size: number,
  filters?: EventFiltersQS,
  opts?: { signal?: AbortSignal }
): Promise<SliceResponse<EventCardResponse>> => {
  const qs = buildEventsQuery(page, size, filters);

  const response = await api.get(`${API_ROUTES.EVENTS}?${qs.toString()}`, {
    signal: opts?.signal,
    headers: { 'Cache-Control': 'no-store' },
  });

  return response.data;
};

// ============ internals ============

function buildEventsQuery(page: number, size: number, filters?: EventFiltersQS) {
  const qs = new URLSearchParams();
  qs.set('page', String(page));
  qs.set('size', String(size));
  if (!filters) return qs;

  const { dateFrom, dateTo } = normalizeEventFilters(filters);
  if (dateFrom) qs.set('dateFrom', dateFrom);
  if (dateTo) qs.set('dateTo', dateTo);

  return qs;
}
