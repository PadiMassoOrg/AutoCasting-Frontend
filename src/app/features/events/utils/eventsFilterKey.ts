import { stableStringify } from '../../../shared/utils/stableStringify';
import type { EventFiltersQS } from '../types/events.types';

export function normalizeEventFilters(filters: EventFiltersQS): EventFiltersQS {
  return {
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
  };
}

export function eventsFiltersKey(filters: EventFiltersQS): string {
  return stableStringify(normalizeEventFilters(filters));
}

export function countActiveEventFilters(filters: EventFiltersQS): number {
  const { dateFrom, dateTo } = normalizeEventFilters(filters);
  return dateFrom || dateTo ? 1 : 0;
}
