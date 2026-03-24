import type { SiteMetadataObject } from '../types/sitemetadata.types';

// ==========================================================
// Constants
// ==========================================================

// Casting Status
export const CASTING_STATUS_DRAFT = 'sitemetadata.casting_status.draft' as const;
export const CASTING_STATUS_PUBLISHED = 'sitemetadata.casting_status.published' as const;
export const CASTING_STATUS_PAUSED = 'sitemetadata.casting_status.paused' as const;
export const CASTING_STATUS_CLOSED = 'sitemetadata.casting_status.closed' as const;
export const CASTING_STATUS_ARCHIVED = 'sitemetadata.casting_status.archived' as const;

// Casting Application Status
export const CASTING_APPLICATION_STATUS_BLANK = 'sitemetadata.application_status.blank' as const;
export const CASTING_APPLICATION_STATUS_PRESELECTED = 'sitemetadata.application_status.preselected' as const;
export const CASTING_APPLICATION_STATUS_SELECTED = 'sitemetadata.application_status.selected' as const;
export const CASTING_APPLICATION_STATUS_NOT_PROCEEDING = 'sitemetadata.application_status.not_proceeding' as const;
export const CASTING_APPLICATION_STATUS_VIEWED = 'sitemetadata.application_status.viewed' as const;

// Ordered Lists
export const CASTING_STATUS_ORDER = [
  CASTING_STATUS_PUBLISHED,
  CASTING_STATUS_CLOSED,
  CASTING_STATUS_PAUSED,
  CASTING_STATUS_DRAFT,
  CASTING_STATUS_ARCHIVED
] as const;

export const CASTING_APPLICATION_STATUS_ORDER = [
  CASTING_APPLICATION_STATUS_SELECTED,
  CASTING_APPLICATION_STATUS_PRESELECTED,
  CASTING_APPLICATION_STATUS_NOT_PROCEEDING,
  CASTING_APPLICATION_STATUS_VIEWED,
  CASTING_APPLICATION_STATUS_BLANK,
] as const;

// Display
export const DISPLAYABLE_CASTING_STATUS_ORDER = [
  CASTING_STATUS_PUBLISHED,
  CASTING_STATUS_PAUSED,
  CASTING_STATUS_CLOSED,
] as const;

// Colors
export type StatusColorMap = Record<string, string>;

export const CASTING_STATUS_COLOR_VAR_BY_CODE: StatusColorMap = {
  [CASTING_STATUS_DRAFT]: 'var(--casting-status-draft)',
  [CASTING_STATUS_PUBLISHED]: 'var(--casting-status-published)',
  [CASTING_STATUS_PAUSED]: 'var(--casting-status-paused)',
  [CASTING_STATUS_CLOSED]: 'var(--casting-status-closed)',
  [CASTING_STATUS_ARCHIVED]: 'var(--casting-status-archived)',
};

export const CASTING_APPLICATION_STATUS_COLOR_VAR_BY_CODE: StatusColorMap = {
  [CASTING_APPLICATION_STATUS_BLANK]: 'var(--casting-application-status-blank)',
  [CASTING_APPLICATION_STATUS_PRESELECTED]: 'var(--casting-application-status-preselected)',
  [CASTING_APPLICATION_STATUS_SELECTED]: 'var(--casting-application-status-selected)',
  [CASTING_APPLICATION_STATUS_NOT_PROCEEDING]: 'var(--casting-application-status-not-proceeding)',
  [CASTING_APPLICATION_STATUS_VIEWED]: 'var(--casting-application-status-viewed)',
};

// ==========================================================
// Utils
// ==========================================================

export const isCastingStatusPublished = (m?: { stringCode?: string | null } | null): boolean => {
  return m?.stringCode === CASTING_STATUS_PUBLISHED;
};

export const isCastingStatusArchived = (m?: { stringCode?: string | null } | null): boolean => {
  return m?.stringCode === CASTING_STATUS_ARCHIVED;
};

export function resolveCastingStatusColorVar(stringCode?: string | null): string | null {
  if (!stringCode) return null;
  return CASTING_STATUS_COLOR_VAR_BY_CODE[stringCode] ?? null;
}

export function resolveCastingApplicationStatusColorVar(stringCode?: string | null): string | null {
  if (!stringCode) return null;
  return CASTING_APPLICATION_STATUS_COLOR_VAR_BY_CODE[stringCode] ?? null;
}

export const normalizeCastingStatusForDisplay = (status?: SiteMetadataObject | null): SiteMetadataObject | null => {
  if (!status) return null;

  switch (status.stringCode) {
    case CASTING_STATUS_ARCHIVED:
      return {
        ...status,
        stringCode: CASTING_STATUS_CLOSED,
      };
    default:
      return status;
  }
};

export const isDisplayableCastingStatus = (stringCode?: string | null): boolean => {
  return (
    stringCode === CASTING_STATUS_PUBLISHED ||
    stringCode === CASTING_STATUS_PAUSED ||
    stringCode === CASTING_STATUS_CLOSED
  );
};

export const getDisplayableCastingStatuses = (statuses?: SiteMetadataObject[] | null): SiteMetadataObject[] => {
  if (!statuses?.length) return [];
  return statuses.filter((status) => isDisplayableCastingStatus(status.stringCode));
};

export const expandTalentCastingApplicationStatusIdsForBackend = ({
  selectedVisibleIds,
  allStatuses,
}: {
  selectedVisibleIds: string[];
  allStatuses?: SiteMetadataObject[] | null;
}): string[] => {
  if (!selectedVisibleIds.length || !allStatuses?.length) return [];

  const closedStatus = allStatuses.find((s) => s.stringCode === CASTING_STATUS_CLOSED);
  const archivedStatus = allStatuses.find((s) => s.stringCode === CASTING_STATUS_ARCHIVED);

  const expanded = new Set<string>();

  selectedVisibleIds.forEach((selectedId) => {
    const selectedStatus = allStatuses.find((s) => s.id === selectedId);
    if (!selectedStatus) return;

    if (selectedStatus.stringCode === CASTING_STATUS_CLOSED) {
      if (closedStatus?.id) expanded.add(closedStatus.id);
      if (archivedStatus?.id) expanded.add(archivedStatus.id);
      return;
    }

    expanded.add(selectedStatus.id);
  });

  return Array.from(expanded);
};

export const collapseTalentCastingApplicationStatusIdsForDisplay = ({
  selectedBackendIds,
  visibleStatuses,
  allStatuses,
}: {
  selectedBackendIds?: string[] | null;
  visibleStatuses?: SiteMetadataObject[] | null;
  allStatuses?: SiteMetadataObject[] | null;
}): string[] => {
  if (!selectedBackendIds?.length || !visibleStatuses?.length || !allStatuses?.length) return [];

  const selectedSet = new Set(selectedBackendIds);
  const closedStatus = allStatuses.find((s) => s.stringCode === CASTING_STATUS_CLOSED);
  const archivedStatus = allStatuses.find((s) => s.stringCode === CASTING_STATUS_ARCHIVED);

  return visibleStatuses
    .filter((status) => {
      if (status.stringCode === CASTING_STATUS_CLOSED) {
        return Boolean(
          (closedStatus?.id && selectedSet.has(closedStatus.id)) ||
            (archivedStatus?.id && selectedSet.has(archivedStatus.id))
        );
      }

      return selectedSet.has(status.id);
    })
    .map((status) => status.id);
};
