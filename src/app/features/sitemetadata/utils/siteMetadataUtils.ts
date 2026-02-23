// ==========================================================
// Constants
// ==========================================================
export const CASTING_STATUS_DRAFT = 'sitemetadata.casting_status.draft' as const;
export const CASTING_STATUS_PUBLISHED = 'sitemetadata.casting_status.published' as const;
export const CASTING_STATUS_PAUSED = 'sitemetadata.casting_status.paused' as const;
export const CASTING_STATUS_CLOSED = 'sitemetadata.casting_status.closed' as const;
export const CASTING_STATUS_ARCHIVED = 'sitemetadata.casting_status.archived' as const;

export type StatusColorMap = Record<string, string>;

export const CASTING_STATUS_COLOR_VAR_BY_CODE: StatusColorMap = {
  [CASTING_STATUS_DRAFT]: 'var(--casting-status-draft)',
  [CASTING_STATUS_PUBLISHED]: 'var(--casting-status-published)',
  [CASTING_STATUS_PAUSED]: 'var(--casting-status-paused)',
  [CASTING_STATUS_CLOSED]: 'var(--casting-status-closed)',
  [CASTING_STATUS_ARCHIVED]: 'var(--casting-status-archived)',
};

// ==========================================================
// Utils
// ==========================================================
export function resolveCastingStatusColorVar(stringCode?: string | null): string | null {
  if (!stringCode) return null;
  return CASTING_STATUS_COLOR_VAR_BY_CODE[stringCode] ?? null;
}

export const isCastingStatusPublished = (m?: { stringCode?: string | null } | null): boolean => {
  return m?.stringCode === CASTING_STATUS_PUBLISHED;
};
