import type { AuditableOrderBy } from '../../../../shared/types/orderBy.types';

/**
 * =========================
 * ORDER BY
 * =========================
 */
export const TALENT_CASTING_APPLICATIONS_ORDER_BY = {
  // ejemplo futuro:
  // STAGE_NAME_ASC: 'STAGE_NAME_ASC',
  // STAGE_NAME_DESC: 'STAGE_NAME_DESC',
} as const;

export type TalentCastingApplicationsOrderBy =
  | AuditableOrderBy
  | (typeof TALENT_CASTING_APPLICATIONS_ORDER_BY)[keyof typeof TALENT_CASTING_APPLICATIONS_ORDER_BY];

/**
 * =========================
 * FILTER STATE
 * =========================
 */
export type TalentCastingApplicationsFiltersState = {
  search?: string;
  castingStatusIdTokens?: string[];
  projectTypeIdTokens?: string[];
  modalityIdTokens?: string[];
};
