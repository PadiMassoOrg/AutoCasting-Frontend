import { describe, expect, it } from 'vitest';
import { countActiveEventFilters, eventsFiltersKey, normalizeEventFilters } from './eventsFilterKey';

describe('normalizeEventFilters', () => {
  it('drops empty dates', () => {
    expect(normalizeEventFilters({ dateFrom: '', dateTo: '' })).toEqual({ dateFrom: undefined, dateTo: undefined });
  });

  it('keeps provided dates', () => {
    expect(normalizeEventFilters({ dateFrom: '2026-10-12', dateTo: '2026-10-20' })).toEqual({
      dateFrom: '2026-10-12',
      dateTo: '2026-10-20',
    });
  });
});

describe('eventsFiltersKey', () => {
  it('is equal for empty and missing dates', () => {
    expect(eventsFiltersKey({ dateFrom: '' })).toBe(eventsFiltersKey({}));
  });

  it('differs when the range differs', () => {
    expect(eventsFiltersKey({ dateFrom: '2026-10-12' })).not.toBe(eventsFiltersKey({ dateFrom: '2026-10-13' }));
  });
});

describe('countActiveEventFilters', () => {
  it('is 0 without dates', () => {
    expect(countActiveEventFilters({})).toBe(0);
  });

  it('is 1 when only one bound is set', () => {
    expect(countActiveEventFilters({ dateTo: '2026-10-20' })).toBe(1);
  });

  it('is 1 for a full range', () => {
    expect(countActiveEventFilters({ dateFrom: '2026-10-12', dateTo: '2026-10-20' })).toBe(1);
  });
});
