import { describe, expect, it } from 'vitest';
import type { SiteMetadataObject } from '../types/sitemetadata.types';
import {
  CASTING_STATUS_ARCHIVED,
  CASTING_STATUS_CLOSED,
  CASTING_STATUS_DRAFT,
  CASTING_STATUS_PAUSED,
  CASTING_STATUS_PUBLISHED,
  collapseTalentCastingApplicationStatusIdsForDisplay,
  expandTalentCastingApplicationStatusIdsForBackend,
  getCastingStatusChangeModalConfig,
  getDisplayableCastingStatuses,
  isCastingEditable,
  isCastingStatusArchived,
  isCastingStatusIncomplete,
  isCastingStatusPublished,
  isDisplayableCastingStatus,
  normalizeCastingStatusForDisplay,
  resolveCastingStatusColorVar,
} from './siteMetadataUtils';

const statusObject = (stringCode: string, id = stringCode): SiteMetadataObject => ({ id, stringCode });

describe('isCastingStatusPublished', () => {
  it('returns true when stringCode matches published', () => {
    expect(isCastingStatusPublished(statusObject(CASTING_STATUS_PUBLISHED))).toBe(true);
  });

  it('returns false for other statuses', () => {
    expect(isCastingStatusPublished(statusObject(CASTING_STATUS_DRAFT))).toBe(false);
  });

  it('returns false for null/undefined', () => {
    expect(isCastingStatusPublished(null)).toBe(false);
    expect(isCastingStatusPublished(undefined)).toBe(false);
  });
});

describe('isCastingStatusArchived', () => {
  it('returns true when stringCode matches archived', () => {
    expect(isCastingStatusArchived(statusObject(CASTING_STATUS_ARCHIVED))).toBe(true);
  });

  it('returns false otherwise', () => {
    expect(isCastingStatusArchived(statusObject(CASTING_STATUS_CLOSED))).toBe(false);
  });
});

describe('isCastingStatusIncomplete / isCastingEditable', () => {
  it('treats draft as incomplete and editable', () => {
    expect(isCastingStatusIncomplete(statusObject(CASTING_STATUS_DRAFT))).toBe(true);
    expect(isCastingEditable(statusObject(CASTING_STATUS_DRAFT))).toBe(true);
  });

  it('treats non-draft statuses as not editable', () => {
    expect(isCastingEditable(statusObject(CASTING_STATUS_PUBLISHED))).toBe(false);
    expect(isCastingEditable(null)).toBe(false);
  });
});

describe('resolveCastingStatusColorVar', () => {
  it('resolves a known status code to its CSS variable', () => {
    expect(resolveCastingStatusColorVar(CASTING_STATUS_PUBLISHED)).toBe('var(--casting-status-published)');
  });

  it('returns null for unknown or missing codes', () => {
    expect(resolveCastingStatusColorVar('unknown')).toBeNull();
    expect(resolveCastingStatusColorVar(null)).toBeNull();
    expect(resolveCastingStatusColorVar(undefined)).toBeNull();
  });
});

describe('normalizeCastingStatusForDisplay', () => {
  it('collapses archived into closed for display', () => {
    const archived = statusObject(CASTING_STATUS_ARCHIVED);
    expect(normalizeCastingStatusForDisplay(archived)).toEqual({ ...archived, stringCode: CASTING_STATUS_CLOSED });
  });

  it('leaves other statuses unchanged', () => {
    const published = statusObject(CASTING_STATUS_PUBLISHED);
    expect(normalizeCastingStatusForDisplay(published)).toEqual(published);
  });

  it('returns null for null input', () => {
    expect(normalizeCastingStatusForDisplay(null)).toBeNull();
  });
});

describe('isDisplayableCastingStatus / getDisplayableCastingStatuses', () => {
  it('marks published, paused and closed as displayable', () => {
    expect(isDisplayableCastingStatus(CASTING_STATUS_PUBLISHED)).toBe(true);
    expect(isDisplayableCastingStatus(CASTING_STATUS_PAUSED)).toBe(true);
    expect(isDisplayableCastingStatus(CASTING_STATUS_CLOSED)).toBe(true);
  });

  it('marks draft and archived as not displayable', () => {
    expect(isDisplayableCastingStatus(CASTING_STATUS_DRAFT)).toBe(false);
    expect(isDisplayableCastingStatus(CASTING_STATUS_ARCHIVED)).toBe(false);
    expect(isDisplayableCastingStatus(null)).toBe(false);
  });

  it('filters a list down to only displayable statuses', () => {
    const statuses = [
      statusObject(CASTING_STATUS_DRAFT),
      statusObject(CASTING_STATUS_PUBLISHED),
      statusObject(CASTING_STATUS_ARCHIVED),
      statusObject(CASTING_STATUS_CLOSED),
    ];

    expect(getDisplayableCastingStatuses(statuses)).toEqual([
      statusObject(CASTING_STATUS_PUBLISHED),
      statusObject(CASTING_STATUS_CLOSED),
    ]);
  });

  it('returns an empty array for empty/missing input', () => {
    expect(getDisplayableCastingStatuses(null)).toEqual([]);
    expect(getDisplayableCastingStatuses([])).toEqual([]);
  });
});

describe('expandTalentCastingApplicationStatusIdsForBackend', () => {
  const allStatuses = [
    statusObject(CASTING_STATUS_PUBLISHED, 'id-published'),
    statusObject(CASTING_STATUS_CLOSED, 'id-closed'),
    statusObject(CASTING_STATUS_ARCHIVED, 'id-archived'),
  ];

  it('expands closed into closed + archived ids', () => {
    const result = expandTalentCastingApplicationStatusIdsForBackend({
      selectedVisibleIds: ['id-closed'],
      allStatuses,
    });

    expect(new Set(result)).toEqual(new Set(['id-closed', 'id-archived']));
  });

  it('passes through non-closed ids unchanged', () => {
    const result = expandTalentCastingApplicationStatusIdsForBackend({
      selectedVisibleIds: ['id-published'],
      allStatuses,
    });

    expect(result).toEqual(['id-published']);
  });

  it('returns an empty array when there is nothing selected', () => {
    expect(expandTalentCastingApplicationStatusIdsForBackend({ selectedVisibleIds: [], allStatuses })).toEqual([]);
  });
});

describe('collapseTalentCastingApplicationStatusIdsForDisplay', () => {
  const allStatuses = [
    statusObject(CASTING_STATUS_PUBLISHED, 'id-published'),
    statusObject(CASTING_STATUS_CLOSED, 'id-closed'),
    statusObject(CASTING_STATUS_ARCHIVED, 'id-archived'),
  ];
  const visibleStatuses = [
    statusObject(CASTING_STATUS_PUBLISHED, 'id-published'),
    statusObject(CASTING_STATUS_CLOSED, 'id-closed'),
  ];

  it('collapses archived selection back into the closed visible id', () => {
    const result = collapseTalentCastingApplicationStatusIdsForDisplay({
      selectedBackendIds: ['id-archived'],
      visibleStatuses,
      allStatuses,
    });

    expect(result).toEqual(['id-closed']);
  });

  it('keeps non-closed selections as-is', () => {
    const result = collapseTalentCastingApplicationStatusIdsForDisplay({
      selectedBackendIds: ['id-published'],
      visibleStatuses,
      allStatuses,
    });

    expect(result).toEqual(['id-published']);
  });

  it('returns an empty array when inputs are missing', () => {
    expect(
      collapseTalentCastingApplicationStatusIdsForDisplay({ selectedBackendIds: [], visibleStatuses, allStatuses })
    ).toEqual([]);
  });
});

describe('getCastingStatusChangeModalConfig', () => {
  it('returns the modal config for a known status', () => {
    const config = getCastingStatusChangeModalConfig(statusObject(CASTING_STATUS_PUBLISHED));

    expect(config?.titleKey).toBe('employer_castings.casting_card.status.published.title');
  });

  it('returns null for an unknown or missing status', () => {
    expect(getCastingStatusChangeModalConfig(statusObject('unknown'))).toBeNull();
    expect(getCastingStatusChangeModalConfig(null)).toBeNull();
  });
});
