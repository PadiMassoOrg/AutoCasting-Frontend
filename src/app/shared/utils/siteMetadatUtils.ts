// ==========================================================
// Utils
// ==========================================================
export const isCastingStatusPublished = (m?: { stringCode?: string | null } | null): boolean => {
  return m?.stringCode === CASTING_STATUS_PUBLISHED;
};

// ==========================================================
// Constants
// ==========================================================
export const CASTING_STATUS_PUBLISHED = 'sitemetadata.casting_status.published' as const;
