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

// Project Type
export const PROJECT_TYPE_DIGITAL_CONTENT = 'sitemetadata.project_type.digital_content' as const;
export const PROJECT_TYPE_SHORT_FILM = 'sitemetadata.project_type.short_film' as const;
export const PROJECT_TYPE_DOCUMENTARY = 'sitemetadata.project_type.documentary' as const;
export const PROJECT_TYPE_FEATURE_FILM = 'sitemetadata.project_type.feature_film' as const;
export const PROJECT_TYPE_MUSICAL = 'sitemetadata.project_type.musical' as const;
export const PROJECT_TYPE_THEATRE_PLAY = 'sitemetadata.project_type.theatre_play' as const;
export const PROJECT_TYPE_STUDENT_PROJECT = 'sitemetadata.project_type.student_project' as const;
export const PROJECT_TYPE_COMMERCIAL = 'sitemetadata.project_type.commercial' as const;
export const PROJECT_TYPE_MUSIC_VIDEO = 'sitemetadata.project_type.music_video' as const;
export const PROJECT_TYPE_OTHER = 'sitemetadata.project_type.other' as const;

// Gender
export const GENDER_INDISTINCT = 'sitemetadata.gender.indistinct' as const;

// Pay Rate Type
export const PAY_RATE_TYPE_COLLABORATIVE = 'sitemetadata.pay_rate_type.collaborative' as const;
export const PAY_RATE_TYPE_UNPAID = 'sitemetadata.pay_rate_type.unpaid' as const;

// Currency
export const CURRENCY_ARS = 'sitemetadata.currency.ars' as const;

// Ordered Lists
export const CASTING_STATUS_ORDER = [
  CASTING_STATUS_PUBLISHED,
  CASTING_STATUS_CLOSED,
  CASTING_STATUS_PAUSED,
  CASTING_STATUS_DRAFT,
  CASTING_STATUS_ARCHIVED,
];

export const CASTING_APPLICATION_STATUS_ORDER = [
  CASTING_APPLICATION_STATUS_SELECTED,
  CASTING_APPLICATION_STATUS_PRESELECTED,
  CASTING_APPLICATION_STATUS_NOT_PROCEEDING,
  CASTING_APPLICATION_STATUS_VIEWED,
  CASTING_APPLICATION_STATUS_BLANK,
];

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

export const PROJECT_TYPE_COLOR_VAR_BY_CODE: StatusColorMap = {
  [PROJECT_TYPE_DIGITAL_CONTENT]: 'var(--project-type-digital-content)',
  [PROJECT_TYPE_SHORT_FILM]: 'var(--project-type-short-film)',
  [PROJECT_TYPE_DOCUMENTARY]: 'var(--project-type-documentary)',
  [PROJECT_TYPE_FEATURE_FILM]: 'var(--project-type-feature-film)',
  [PROJECT_TYPE_MUSICAL]: 'var(--project-type-musical)',
  [PROJECT_TYPE_THEATRE_PLAY]: 'var(--project-type-theatre-play)',
  [PROJECT_TYPE_STUDENT_PROJECT]: 'var(--project-type-student-project)',
  [PROJECT_TYPE_COMMERCIAL]: 'var(--project-type-commercial)',
  [PROJECT_TYPE_MUSIC_VIDEO]: 'var(--project-type-music-video)',
  [PROJECT_TYPE_OTHER]: 'var(--project-type-other)',
};

// ==========================================================
// Modal Config
// ==========================================================

export type CastingActionConfirmationModalConfig = {
  titleKey: string;
  descriptionKey: string;
  description2Key?: string;
  confirmButtonKey: string;
  confirmButtonVariant?: 'primary' | 'danger';
};

export const CASTING_STATUS_CHANGE_MODAL_CONFIG_BY_CODE: Record<string, CastingActionConfirmationModalConfig> = {
  [CASTING_STATUS_PUBLISHED]: {
    titleKey: 'employer_castings.casting_card.status.published.title',
    descriptionKey: 'employer_castings.casting_card.status.published.description',
    description2Key: 'employer_castings.casting_card.status.published.description_2',
    confirmButtonKey: 'employer_castings.casting_card.status.published.confirm_button',
  },
  [CASTING_STATUS_PAUSED]: {
    titleKey: 'employer_castings.casting_card.status.paused.title',
    descriptionKey: 'employer_castings.casting_card.status.paused.description',
    description2Key: 'employer_castings.casting_card.status.paused.description_2',
    confirmButtonKey: 'employer_castings.casting_card.status.paused.confirm_button',
  },
  [CASTING_STATUS_CLOSED]: {
    titleKey: 'employer_castings.casting_card.status.closed.title',
    descriptionKey: 'employer_castings.casting_card.status.closed.description',
    description2Key: 'employer_castings.casting_card.status.closed.description_2',
    confirmButtonKey: 'employer_castings.casting_card.status.closed.confirm_button',
  },
  [CASTING_STATUS_ARCHIVED]: {
    titleKey: 'employer_castings.casting_card.status.archived.title',
    descriptionKey: 'employer_castings.casting_card.status.archived.description',
    description2Key: 'employer_castings.casting_card.status.archived.description_2',
    confirmButtonKey: 'employer_castings.casting_card.status.archived.confirm_button',
  },
};

export const CASTING_DELETE_MODAL_CONFIG: CastingActionConfirmationModalConfig = {
  titleKey: 'employer_castings.casting_card.delete.title',
  descriptionKey: 'employer_castings.casting_card.delete.description',
  description2Key: 'employer_castings.casting_card.delete.description_2',
  confirmButtonKey: 'employer_castings.casting_card.delete.confirm_button',
  confirmButtonVariant: 'danger',
};

// ==========================================================
// Generic Metadata Helpers
// ==========================================================

export const filterSiteMetadataByStringCodes = ({
  items,
  excludedStringCodes,
}: {
  items?: SiteMetadataObject[] | null;
  excludedStringCodes?: string[] | null;
}): SiteMetadataObject[] => {
  if (!items?.length) return [];
  if (!excludedStringCodes?.length) return [...items];

  const excludedSet = new Set(excludedStringCodes);
  return items.filter((item) => !excludedSet.has(item.stringCode));
};

// Context-specific helper example
export const getTalentVisibleGenderOptions = (items?: SiteMetadataObject[] | null): SiteMetadataObject[] => {
  return filterSiteMetadataByStringCodes({
    items,
    excludedStringCodes: [GENDER_INDISTINCT],
  });
};

export const getRoleRemunerationVisiblePayRateTypeOptions = (
  items?: SiteMetadataObject[] | null
): SiteMetadataObject[] => {
  return filterSiteMetadataByStringCodes({
    items,
    excludedStringCodes: [PAY_RATE_TYPE_COLLABORATIVE],
  });
};

export const getSiteMetadataIdByStringCode = (
  items: SiteMetadataObject[] | null | undefined,
  stringCode: string
): string | null => {
  return items?.find((item) => item.stringCode === stringCode)?.id ?? null;
};

export const getSiteMetadataStringCodeById = (
  items: SiteMetadataObject[] | null | undefined,
  id: string | null | undefined
): string | null => {
  return items?.find((item) => item.id === id)?.stringCode ?? null;
};

export const isUnpaidPayRateType = (
  payRateTypeId: string | null | undefined,
  payRateTypeOptions: SiteMetadataObject[] | null | undefined
): boolean => {
  return getSiteMetadataStringCodeById(payRateTypeOptions, payRateTypeId) === PAY_RATE_TYPE_UNPAID;
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

export const isCastingStatusIncomplete = (m?: { stringCode?: string | null } | null): boolean => {
  return m?.stringCode === CASTING_STATUS_DRAFT;
};

export const isCastingEditable = (m?: { stringCode?: string | null } | null): boolean => {
  return isCastingStatusIncomplete(m);
};

export function resolveCastingStatusColorVar(stringCode?: string | null): string | null {
  if (!stringCode) return null;
  return CASTING_STATUS_COLOR_VAR_BY_CODE[stringCode] ?? null;
}

export function resolveCastingApplicationStatusColorVar(stringCode?: string | null): string | null {
  if (!stringCode) return null;
  return CASTING_APPLICATION_STATUS_COLOR_VAR_BY_CODE[stringCode] ?? null;
}

export function resolveProjectTypeColorVar(stringCode?: string | null): string | null {
  if (!stringCode) return null;
  return PROJECT_TYPE_COLOR_VAR_BY_CODE[stringCode] ?? null;
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

export const getCastingStatusChangeModalConfig = (
  status?: Pick<SiteMetadataObject, 'stringCode'> | null
): CastingActionConfirmationModalConfig | null => {
  const stringCode = status?.stringCode;
  if (!stringCode) return null;

  return CASTING_STATUS_CHANGE_MODAL_CONFIG_BY_CODE[stringCode] ?? null;
};
